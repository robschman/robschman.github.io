// Längeres Theme-Video (Video 08): Intro "so stellst du um" + jedes Design 1.8s mit Hook + Abspann.
// Aufruf: node build-theme-video.js
const fs = require('fs'), cp = require('child_process');
const puppeteer = require('puppeteer');
const REC = '../ScreenRecording_06-17-2026 Beauty routine.MP4';
const MUSIK = 'musik/beauty_rnb-afrohouse_112bpm.m4a';
const SX=387, SY=646, SW=306, SH=660, CLIP=1.8, SR=54;
const ff = (a) => cp.execSync(`ffmpeg -y ${a}`, {stdio:'ignore'});
const dur = (f) => parseFloat(cp.execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 ${f}`).toString().trim());

const THEMES = [
  { img:'Themen/IMG_1547.PNG', name:'Pink 🩷',       box:'linear-gradient(135deg,#f06292,#ab47bc)', bg:'c0=0xF8BBD0:c1=0xF06292' },
  { img:'Themen/IMG_1548.PNG', name:'Cozy 🤎',       box:'linear-gradient(135deg,#EF9320,#BD6C0A)', bg:'c0=0xEAC9A0:c1=0xEF9320' },
  { img:'Themen/IMG_1549.PNG', name:'Blau 💙',       box:'linear-gradient(135deg,#42a5f5,#1e88e5)', bg:'c0=0x90CAF9:c1=0x1E88E5' },
  { img:'Themen/IMG_1550.PNG', name:'Beere 🫐',      box:'linear-gradient(135deg,#E91E8C,#8E24AA)', bg:'c0=0xF06EC2:c1=0x8E24AA' },
  { img:'Themen/IMG_1551.PNG', name:'Mono 🖤',       box:'linear-gradient(135deg,#5a5a5a,#1a1a1a)', bg:'c0=0xBDBDBD:c1=0x424242' },
  { img:'Themen/IMG_1552.PNG', name:'Regenbogen 🌈', box:'linear-gradient(100deg,#ff6b9d,#ff9a56,#ffd24d,#7bed9f,#5ea8ff,#c77dff)', bg:'c0=0xFF6B9D:c1=0x5EA8FF' },
];
const logo = fs.readFileSync('../cozyvibe-icon.png').toString('base64');
const appicon = fs.readFileSync('../icon-192.png').toString('base64');
const HEAD = `<link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Marcellus&family=Mulish:wght@700;800&display=swap" rel="stylesheet"><style>
*{margin:0;padding:0;box-sizing:border-box}html,body{width:1080px;height:1920px;background:transparent;overflow:hidden;font-family:'Mulish',sans-serif}
.brandrow{position:absolute;top:292px;left:0;right:0;display:flex;align-items:center;justify-content:center;gap:16px}
.blogo{width:62px;height:62px;border-radius:50%;box-shadow:0 6px 18px rgba(120,66,4,.3)}
.bname{font-family:'Dancing Script',cursive;font-weight:700;font-size:52px;color:#fff;text-shadow:0 3px 12px rgba(90,50,10,.45);line-height:1}
.btag{position:absolute;top:382px;left:0;right:0;text-align:center;font-family:'Marcellus',serif;font-size:24px;letter-spacing:.4em;color:#fff;text-transform:uppercase;opacity:.9;text-shadow:0 2px 8px rgba(0,0,0,.4)}
.hook{position:absolute;top:436px;left:50%;transform:translateX(-50%);white-space:nowrap;padding:38px 46px;border-radius:32px;border:7px solid #fff;font-family:'Mulish',sans-serif;font-weight:800;font-size:56px;line-height:1.05;letter-spacing:-.01em;color:#fff;box-shadow:0 14px 40px rgba(40,12,34,.55),0 0 0 3px rgba(20,8,16,.28);paint-order:stroke fill;-webkit-text-stroke:7px rgba(15,5,12,.55);text-shadow:0 5px 14px rgba(0,0,0,.5)}
.phone{position:absolute;left:377px;top:636px;width:326px;height:680px;border:10px solid #15131a;border-radius:62px;box-shadow:0 26px 60px rgba(60,20,50,.4),0 0 0 2px rgba(255,255,255,.12) inset}
.notch{position:absolute;left:50%;top:647px;transform:translateX(-50%);width:156px;height:50px;background:#000;border-radius:25px;box-shadow:0 1px 3px rgba(0,0,0,.5)}
.cta{position:absolute;bottom:456px;left:0;right:0;display:flex;flex-direction:column;align-items:center;gap:16px}
.ctapill{padding:22px 48px;border-radius:999px;background:linear-gradient(135deg,#EF9320,#BD6C0A);color:#fff;font-weight:800;font-size:36px}
.ctaurl{font-weight:800;font-size:38px;color:#fff;text-shadow:0 2px 10px rgba(0,0,0,.45)}
.ai{position:absolute;bottom:418px;left:0;right:0;text-align:center;font-size:23px;color:rgba(255,255,255,.9);font-weight:700;letter-spacing:1px;text-shadow:0 1px 8px rgba(0,0,0,.5)}
.ocenter{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:30px}
.obig{font-family:'Dancing Script',cursive;font-weight:700;font-size:100px;color:#fff;text-shadow:0 4px 16px rgba(90,50,10,.4)}
.oappicon{width:168px;height:168px;border-radius:40px;box-shadow:0 16px 42px rgba(90,50,10,.42)}</style>`;
const brand = `<div class="brandrow"><img class="blogo" src="data:image/png;base64,${logo}"><span class="bname">CozyVibe</span></div><div class="btag">DEINE BEAUTY ROUTINE</div>`;
function pg(inner){ return `<!DOCTYPE html><html><head><meta charset="utf-8">${HEAD}</head><body><div style="position:relative;width:1080px;height:1920px">${brand}<div class="ai">✦ KI-generiert</div>${inner}</div></body></html>`; }

(async () => {
  const b = await puppeteer.launch({args:['--no-sandbox','--force-color-profile=srgb']});
  const p = await b.newPage();
  await p.setViewport({width:1080,height:1920,deviceScaleFactor:1});
  const shot = async (inner,f) => { await p.setContent(pg(inner),{waitUntil:'domcontentloaded'}); await Promise.race([p.evaluateHandle('document.fonts.ready'),new Promise(r=>setTimeout(r,6000))]); await new Promise(r=>setTimeout(r,350)); await p.screenshot({path:f,omitBackground:true}); };
  // Intro
  await shot(`<div class="hook" style="background:linear-gradient(100deg,#ff6b9d,#ff9a56,#ffd24d,#7bed9f,#5ea8ff,#c77dff)">Mach sie zu deiner ✨</div><div class="phone"></div><div class="notch"></div>`, '_tv_intro.png');
  // 6 Theme-Overlays
  for (let i=0;i<THEMES.length;i++){
    await shot(`<div class="hook" style="background:${THEMES[i].box}">${THEMES[i].name}</div><div class="phone"></div><div class="notch"></div>`, `_tv_t${i}.png`);
  }
  // Outro
  await shot(`<div class="ocenter"><img class="oappicon" src="data:image/png;base64,${appicon}"><div class="obig">Starte heute ✨</div><div class="ctapill" style="font-size:46px;padding:28px 56px">Jetzt kostenlos</div><div class="ctaurl" style="font-size:50px">📲 beautyroutine.app</div></div>`, '_tv_outro.png');
  // Rundeck-Maske fürs App-Bild
  const mp = await b.newPage();
  await mp.setViewport({width:SW,height:SH,deviceScaleFactor:1});
  await mp.setContent(`<style>html,body{margin:0;background:#000}.m{width:${SW}px;height:${SH}px;background:#fff;border-radius:${SR}px}</style><div class="m"></div>`,{waitUntil:'domcontentloaded'});
  await new Promise(r=>setTimeout(r,150));
  await mp.screenshot({path:'_appmask.png',omitBackground:false});
  await b.close();
  console.log('Overlays ok');
  const segs=[];
  // Intro: Theme-Umstellen aus Aufnahme (Einstellungen, Themes durchschalten ~t=160), 4s
  ff(`-f lavfi -i "gradients=s=1080x1920:c0=0xF8BBD0:c1=0xc084fc:d=2.5:r=30" -ss 160 -t 2.5 -i "${REC}" -loop 1 -i "_tv_intro.png" -loop 1 -i "_appmask.png" -filter_complex "[1]scale=${SW}:${SH}:force_original_aspect_ratio=increase,crop=${SW}:${SH}[appc];[appc][3]alphamerge[app];[0][app]overlay=${SX}:${SY}[bg];[bg][2]overlay=0:0[v]" -map "[v]" -t 2.5 -c:v libx264 -crf 20 -pix_fmt yuv420p -r 30 _tv_seg_intro.mp4`);
  segs.push('_tv_seg_intro.mp4');
  // 6 Themes je 1.8s (Screenshot)
  THEMES.forEach((t,i)=>{
    ff(`-f lavfi -i "gradients=s=1080x1920:${t.bg}:d=${CLIP}:r=30" -loop 1 -t ${CLIP} -i "${t.img}" -loop 1 -t ${CLIP} -i "_tv_t${i}.png" -loop 1 -t ${CLIP} -i "_appmask.png" -filter_complex "[1]scale=${SW}:${SH}:force_original_aspect_ratio=increase,crop=${SW}:${SH}[appc];[appc][3]alphamerge[app];[0][app]overlay=${SX}:${SY}[bg];[bg][2]overlay=0:0[v]" -map "[v]" -t ${CLIP} -c:v libx264 -crf 20 -pix_fmt yuv420p -r 30 _tv_seg_t${i}.mp4`);
    segs.push(`_tv_seg_t${i}.mp4`);
  });
  // Outro
  ff(`-f lavfi -i "gradients=s=1080x1920:c0=0xf48fb1:c1=0xc084fc:d=3.5:r=30" -loop 1 -i "_tv_outro.png" -filter_complex "[1:v]fade=t=in:st=0:d=0.3:alpha=1[ov];[0:v][ov]overlay=0:0[v]" -map "[v]" -t 3.5 -c:v libx264 -crf 20 -pix_fmt yuv420p -r 30 _tv_seg_outro.mp4`);
  segs.push('_tv_seg_outro.mp4');
  fs.writeFileSync('_tv_list.txt', segs.map(s=>`file '${s}'`).join('\n'));
  ff(`-f concat -safe 0 -i _tv_list.txt -c:v libx264 -crf 20 -pix_fmt yuv420p -r 30 _tv_nomusic.mp4`);
  const d = dur('_tv_nomusic.mp4');
  ff(`-i _tv_nomusic.mp4 -i "${MUSIK}" -filter_complex "[1:a]afade=t=out:st=${Math.max(0,d-1.5).toFixed(1)}:d=1.5[a]" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 160k -shortest output/styles/promo_08_themes.mp4`);
  cp.execSync('rm -f _tv_*.png _tv_seg*.mp4 _tv_nomusic.mp4 _tv_list.txt');
  console.log(`OK promo_08_themes.mp4 ${d.toFixed(1)}s`);
})();
