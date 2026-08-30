// Baut alle 6 Videos aus _6videos.json. Aufruf: node build-6-videos.js
const fs = require('fs'), cp = require('child_process');
const VIDEOS = JSON.parse(fs.readFileSync('_6videos.json','utf8'));
const REC = '../ScreenRecording_06-17-2026 Beauty routine.MP4';
const INTRO = 'output/test/test1_pink_routine.mp4';
const MUSIK = { house:'musik/beauty_house-anthem_124bpm.m4a', rnb:'musik/beauty_rnb-afrohouse_112bpm.m4a' };
const BG = { pink:'c0=0xF8BBD0:c1=0xF06292', rainbow:'c0=0xFF6B9D:c1=0x5EA8FF', gold:'c0=0xEAC9A0:c1=0xEF9320', blau:'c0=0x90CAF9:c1=0x1E88E5' };
const SX=387, SY=646, SW=306, SH=660;
const ff = (a) => cp.execSync(`ffmpeg -y ${a}`, {stdio:'ignore'});
const dur = (f) => parseFloat(cp.execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 ${f}`).toString().trim());

let ok=0, fail=[];
for (const v of VIDEOS){
  if (process.argv[2] && v.id !== process.argv[2]) continue; // optional nur ein Video bauen
  try {
    const segs=[];
    ff(`-i "${INTRO}" -loop 1 -i "_v6_${v.id}_intro.png" -filter_complex "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1[v0];[1:v]fade=t=in:st=0:d=0.3:alpha=1[ov];[v0][ov]overlay=0:0[v]" -map "[v]" -t 1.5 -c:v libx264 -crf 20 -pix_fmt yuv420p -r 30 _s_${v.id}_intro.mp4`);
    segs.push(`_s_${v.id}_intro.mp4`);
    v.scenes.forEach((s,i)=>{
      ff(`-f lavfi -i "gradients=s=1080x1920:${BG[s.bg]||BG.pink}:d=${s.dur}:r=30" -ss ${s.t} -t ${s.dur} -i "${REC}" -loop 1 -i "_v6_${v.id}_s${i}.png" -loop 1 -i "_appmask.png" -filter_complex "[1]scale=${SW}:${SH}:force_original_aspect_ratio=increase,crop=${SW}:${SH}[appc];[appc][3]alphamerge[app];[0][app]overlay=${SX}:${SY}[bg];[bg][2]overlay=0:0[v]" -map "[v]" -t ${s.dur} -c:v libx264 -crf 20 -pix_fmt yuv420p -r 30 _s_${v.id}_s${i}.mp4`);
      segs.push(`_s_${v.id}_s${i}.mp4`);
    });
    segs.push('_einschub.mp4'); // schneller Theme-Showcase ganz am Schluss, vor dem Abspann
    ff(`-f lavfi -i "gradients=s=1080x1920:c0=0xf48fb1:c1=0xc084fc:d=3.5:r=30" -loop 1 -i "_v6_${v.id}_outro.png" -filter_complex "[1:v]fade=t=in:st=0:d=0.3:alpha=1[ov];[0:v][ov]overlay=0:0[v]" -map "[v]" -t 3.5 -c:v libx264 -crf 20 -pix_fmt yuv420p -r 30 _s_${v.id}_outro.mp4`);
    segs.push(`_s_${v.id}_outro.mp4`);
    fs.writeFileSync(`_list_${v.id}.txt`, segs.map(s=>`file '${s}'`).join('\n'));
    ff(`-f concat -safe 0 -i _list_${v.id}.txt -c:v libx264 -crf 20 -pix_fmt yuv420p -r 30 _nomusic_${v.id}.mp4`);
    const d = dur(`_nomusic_${v.id}.mp4`);
    const fst = Math.max(0, d-1.5).toFixed(1);
    ff(`-i _nomusic_${v.id}.mp4 -i "${MUSIK[v.musik]}" -filter_complex "[1:a]afade=t=out:st=${fst}:d=1.5[a]" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 160k -shortest output/styles/promo_${v.id}.mp4`);
    console.log(`OK promo_${v.id}.mp4 ${d.toFixed(1)}s musik=${v.musik}`);
    ok++;
  } catch(e){ console.log(`FAIL ${v.id}: ${e.message.split('\n')[0]}`); fail.push(v.id); }
}
// cleanup zwischendateien
try { cp.execSync(`rm -f _s_*.mp4 _nomusic_*.mp4 _list_*.txt`); } catch(e){}
console.log(`\nFERTIG: ${ok}/6 ok` + (fail.length?`, FAILS: ${fail.join(',')}`:''));
