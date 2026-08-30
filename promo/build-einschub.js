// Schneller Theme-Einschub (stumm, ohne CTA) für den Schluss jedes Videos, vor dem Abspann.
// 6 Theme-Screenshots im Handy, fixer Hook, Hintergrund je in Theme-Farbe. Aufruf: node build-einschub.js
const fs = require('fs'), cp = require('child_process');
const puppeteer = require('puppeteer');
const SX=387, SY=646, SW=306, SH=660, CLIP=0.5, SR=54;
const ff = (a) => cp.execSync(`ffmpeg -y ${a}`, {stdio:'ignore'});

const THEMES = [
  { img:'Themen/IMG_1547.PNG', bg:'c0=0xF8BBD0:c1=0xF06292' },
  { img:'Themen/IMG_1548.PNG', bg:'c0=0xEAC9A0:c1=0xEF9320' },
  { img:'Themen/IMG_1549.PNG', bg:'c0=0x90CAF9:c1=0x1E88E5' },
  { img:'Themen/IMG_1550.PNG', bg:'c0=0xF06EC2:c1=0x8E24AA' },
  { img:'Themen/IMG_1551.PNG', bg:'c0=0xBDBDBD:c1=0x424242' },
  { img:'Themen/IMG_1552.PNG', bg:'c0=0xFF6B9D:c1=0x5EA8FF' },
];
const logo = fs.readFileSync('../cozyvibe-icon.png').toString('base64');
const OVERLAY = `<!DOCTYPE html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Mulish:wght@700;800&display=swap" rel="stylesheet">
<style>*{margin:0;padding:0;box-sizing:border-box}html,body{width:1080px;height:1920px;background:transparent;overflow:hidden}
.brandrow{position:absolute;top:292px;left:0;right:0;display:flex;align-items:center;justify-content:center;gap:16px}
.blogo{width:62px;height:62px;border-radius:50%;box-shadow:0 6px 18px rgba(120,66,4,.3)}
.bname{font-family:'Dancing Script',cursive;font-weight:700;font-size:52px;color:#fff;text-shadow:0 3px 12px rgba(90,50,10,.45);line-height:1}
.btag{position:absolute;top:382px;left:0;right:0;text-align:center;font-family:'Mulish',sans-serif;font-size:24px;letter-spacing:.4em;color:#fff;text-transform:uppercase;opacity:.9;text-shadow:0 2px 8px rgba(0,0,0,.4)}
.hook{position:absolute;top:436px;left:50%;transform:translateX(-50%);white-space:nowrap;padding:38px 46px;border-radius:32px;border:7px solid #fff;font-family:'Mulish',sans-serif;font-weight:800;font-size:56px;line-height:1.05;letter-spacing:-.01em;color:#fff;background:linear-gradient(100deg,#ff6b9d,#ff9a56,#ffd24d,#7bed9f,#5ea8ff,#c77dff);box-shadow:0 14px 40px rgba(40,12,34,.55),0 0 0 3px rgba(20,8,16,.28);paint-order:stroke fill;-webkit-text-stroke:7px rgba(15,5,12,.55);text-shadow:0 5px 14px rgba(0,0,0,.5)}
.phone{position:absolute;left:377px;top:636px;width:326px;height:680px;border:10px solid #15131a;border-radius:62px;box-shadow:0 26px 60px rgba(60,20,50,.4),0 0 0 2px rgba(255,255,255,.12) inset}
.notch{position:absolute;left:50%;top:647px;transform:translateX(-50%);width:156px;height:50px;background:#000;border-radius:25px;box-shadow:0 1px 3px rgba(0,0,0,.5)}
.ai{position:absolute;bottom:418px;left:0;right:0;text-align:center;font-size:23px;color:rgba(255,255,255,.9);font-weight:700;letter-spacing:1px;text-shadow:0 1px 8px rgba(0,0,0,.5);font-family:'Mulish',sans-serif}</style></head>
<body><div style="position:relative;width:1080px;height:1920px">
<div class="brandrow"><img class="blogo" src="data:image/png;base64,${logo}"><span class="bname">CozyVibe</span></div>
<div class="btag">DEINE BEAUTY ROUTINE</div>
<div class="hook">6 Designs für dich 🌈</div>
<div class="phone"></div><div class="notch"></div>
<div class="ai">✦ KI-generiert</div></div></body></html>`;

(async () => {
  const b = await puppeteer.launch({args:['--no-sandbox','--force-color-profile=srgb']});
  const p = await b.newPage();
  await p.setViewport({width:1080,height:1920,deviceScaleFactor:1});
  await p.setContent(OVERLAY,{waitUntil:'domcontentloaded'});
  await Promise.race([p.evaluateHandle('document.fonts.ready'), new Promise(r=>setTimeout(r,6000))]);
  await new Promise(r=>setTimeout(r,350));
  await p.screenshot({path:'_ein_ov.png', omitBackground:true});
  // Rundeck-Maske fürs App-Bild (weiß=sichtbar, schwarz=transparent)
  const mp = await b.newPage();
  await mp.setViewport({width:SW,height:SH,deviceScaleFactor:1});
  await mp.setContent(`<style>html,body{margin:0;background:#000}.m{width:${SW}px;height:${SH}px;background:#fff;border-radius:${SR}px}</style><div class="m"></div>`,{waitUntil:'domcontentloaded'});
  await new Promise(r=>setTimeout(r,150));
  await mp.screenshot({path:'_appmask.png',omitBackground:false});
  await b.close();
  const segs=[];
  THEMES.forEach((t,i)=>{
    ff(`-f lavfi -i "gradients=s=1080x1920:${t.bg}:d=${CLIP}:r=30" -loop 1 -t ${CLIP} -i "${t.img}" -loop 1 -t ${CLIP} -i "_ein_ov.png" -loop 1 -t ${CLIP} -i "_appmask.png" -filter_complex "[1]scale=${SW}:${SH}:force_original_aspect_ratio=increase,crop=${SW}:${SH}[appc];[appc][3]alphamerge[app];[0][app]overlay=${SX}:${SY}[bg];[bg][2]overlay=0:0[v]" -map "[v]" -t ${CLIP} -c:v libx264 -crf 20 -pix_fmt yuv420p -r 30 _ein_seg${i}.mp4`);
    segs.push(`_ein_seg${i}.mp4`);
  });
  fs.writeFileSync('_ein_list.txt', segs.map(s=>`file '${s}'`).join('\n'));
  ff(`-f concat -safe 0 -i _ein_list.txt -c:v libx264 -crf 20 -pix_fmt yuv420p -r 30 _einschub.mp4`);
  cp.execSync('rm -f _ein_ov.png _ein_seg*.mp4 _ein_list.txt');
  const d = cp.execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 _einschub.mp4`).toString().trim();
  console.log(`OK _einschub.mp4 ${d}s`);
})();
