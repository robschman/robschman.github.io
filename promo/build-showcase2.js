// Showcase aus 6 echten Theme-Screenshots: jeder im Handy, Hintergrund + Hook in Theme-Farbe.
// Aufruf: node build-showcase2.js
const fs = require('fs'), cp = require('child_process');
const puppeteer = require('puppeteer');
const MUSIK = 'musik/beauty_house-anthem_124bpm.m4a';
const SX=313, SY=425, SW=454, SH=1014, CLIP=0.6;
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

function overlayHtml(t){ return `<!DOCTYPE html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Marcellus&family=Mulish:wght@600;700;800&display=swap" rel="stylesheet">
<style>*{margin:0;padding:0;box-sizing:border-box}html,body{width:1080px;height:1920px;background:transparent;overflow:hidden;font-family:'Mulish',sans-serif}
.brandrow{position:absolute;top:54px;left:0;right:0;display:flex;align-items:center;justify-content:center;gap:16px}
.blogo{width:70px;height:70px;border-radius:50%;box-shadow:0 6px 18px rgba(120,66,4,.3)}
.bname{font-family:'Dancing Script',cursive;font-weight:700;font-size:56px;color:#fff;text-shadow:0 3px 12px rgba(90,50,10,.45)}
.hook{position:absolute;top:170px;left:50%;transform:translateX(-50%);white-space:nowrap;padding:22px 56px;border-radius:40px;text-align:center;font-family:'Dancing Script',cursive;font-weight:700;font-size:72px;color:#fff;background:${t.box};box-shadow:0 14px 38px rgba(60,20,50,.4);text-shadow:0 3px 10px rgba(0,0,0,.3)}
.phone{position:absolute;left:300px;top:412px;width:480px;height:1040px;border:13px solid #15131a;border-radius:62px;box-shadow:0 26px 60px rgba(60,20,50,.4),0 0 0 2px rgba(255,255,255,.12) inset}
.notch{position:absolute;left:50%;top:426px;transform:translateX(-50%);width:150px;height:30px;background:#15131a;border-radius:0 0 20px 20px}
.cta{position:absolute;bottom:150px;left:0;right:0;display:flex;flex-direction:column;align-items:center;gap:16px}
.ctapill{padding:22px 48px;border-radius:999px;background:linear-gradient(135deg,#EF9320,#BD6C0A);color:#fff;font-weight:800;font-size:36px;box-shadow:0 12px 34px rgba(120,66,4,.4)}
.ctaurl{font-weight:800;font-size:38px;color:#fff;letter-spacing:.5px;text-shadow:0 2px 10px rgba(0,0,0,.45)}
.ai{position:absolute;bottom:54px;left:0;right:0;text-align:center;font-size:24px;color:rgba(255,255,255,.85);font-weight:700;letter-spacing:1px;text-shadow:0 1px 8px rgba(0,0,0,.5)}</style></head>
<body><div style="position:relative;width:1080px;height:1920px">
<div class="brandrow"><img class="blogo" src="data:image/png;base64,${logo}"><span class="bname">CozyVibe</span></div>
<div class="hook">${t.name}</div>
<div class="phone"></div><div class="notch"></div>
<div class="cta"><div class="ctapill">Jetzt kostenlos</div><div class="ctaurl">📲 beautyroutine.app</div></div>
<div class="ai">✦ KI-generiert</div></div></body></html>`; }

(async () => {
  const b = await puppeteer.launch({args:['--no-sandbox','--force-color-profile=srgb']});
  const p = await b.newPage();
  await p.setViewport({width:1080,height:1920,deviceScaleFactor:1});
  for (let i=0;i<THEMES.length;i++){
    await p.setContent(overlayHtml(THEMES[i]),{waitUntil:'domcontentloaded'});
    await Promise.race([p.evaluateHandle('document.fonts.ready'), new Promise(r=>setTimeout(r,6000))]);
    await new Promise(r=>setTimeout(r,350));
    await p.screenshot({path:`_so_${i}.png`, omitBackground:true});
  }
  await b.close();
  console.log('6 Overlays ok');
  const segs=[];
  THEMES.forEach((t,i)=>{
    ff(`-f lavfi -i "gradients=s=1080x1920:${t.bg}:d=${CLIP}:r=30" -loop 1 -t ${CLIP} -i "${t.img}" -loop 1 -t ${CLIP} -i "_so_${i}.png" -filter_complex "[1]scale=${SW}:${SH}:force_original_aspect_ratio=increase,crop=${SW}:${SH}[app];[0][app]overlay=${SX}:${SY}[bg];[bg][2]overlay=0:0[v]" -map "[v]" -t ${CLIP} -c:v libx264 -crf 20 -pix_fmt yuv420p -r 30 _so_seg${i}.mp4`);
    segs.push(`_so_seg${i}.mp4`);
  });
  fs.writeFileSync('_so_list.txt', segs.map(s=>`file '${s}'`).join('\n'));
  ff(`-f concat -safe 0 -i _so_list.txt -c:v libx264 -crf 20 -pix_fmt yuv420p -r 30 _so_seq.mp4`);
  const d = dur('_so_seq.mp4');
  ff(`-i _so_seq.mp4 -i "${MUSIK}" -filter_complex "[1:a]afade=t=out:st=${Math.max(0,d-0.8).toFixed(1)}:d=0.8[a]" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 160k -shortest output/styles/promo_07_showcase.mp4`);
  cp.execSync('rm -f _so_*.png _so_seg*.mp4 _so_seq.mp4 _so_list.txt');
  console.log(`OK promo_07_showcase.mp4 ${d.toFixed(1)}s`);
})();
