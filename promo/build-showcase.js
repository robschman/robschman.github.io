// Baut das Theme-Showcase-Video: Hook oben fix, App wechselt schnell durch alle 6 Designs.
// Aufruf: node build-showcase.js
const fs = require('fs'), cp = require('child_process');
const puppeteer = require('puppeteer');
const REC = '../ScreenRecording_06-17-2026 Beauty routine.MP4';
const MUSIK = 'musik/beauty_house-anthem_124bpm.m4a';
const SX=313, SY=425, SW=454, SH=1014;
const ff = (a) => cp.execSync(`ffmpeg -y ${a}`, {stdio:'ignore'});
const dur = (f) => parseFloat(cp.execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 ${f}`).toString().trim());

// 6 Designs: Zeitpunkt in der Aufnahme + passende Hintergrundfarbe
const THEMES = [
  { t:10,  bg:'c0=0xF8BBD0:c1=0xF06292' }, // Pink
  { t:176, bg:'c0=0x90CAF9:c1=0x1E88E5' }, // Blau
  { t:190, bg:'c0=0xE91E8C:c1=0x8E24AA' }, // Beere
  { t:218, bg:'c0=0xEAC9A0:c1=0xEF9320' }, // Gold
  { t:232, bg:'c0=0xFF6B9D:c1=0x5EA8FF' }, // Regenbogen
  { t:162, bg:'c0=0xF0F0F0:c1=0x5A5A5A' }, // Mono
];
const CLIP = 0.75; // Sekunden pro Design

const logo = fs.readFileSync('../cozyvibe-icon.png').toString('base64');
const appicon = fs.readFileSync('../icon-192.png').toString('base64');
const OVERLAY_HTML = `<!DOCTYPE html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Marcellus&family=Mulish:wght@600;700;800&display=swap" rel="stylesheet">
<style>*{margin:0;padding:0;box-sizing:border-box}html,body{width:1080px;height:1920px;background:transparent;overflow:hidden;font-family:'Mulish',sans-serif}
.brandrow{position:absolute;top:54px;left:0;right:0;display:flex;align-items:center;justify-content:center;gap:18px}
.blogo{width:78px;height:78px;border-radius:50%;box-shadow:0 6px 18px rgba(120,66,4,.3)}
.bname{font-family:'Dancing Script',cursive;font-weight:700;font-size:62px;color:#fff;text-shadow:0 3px 12px rgba(90,50,10,.45)}
.btag{position:absolute;top:140px;left:0;right:0;text-align:center;font-family:'Marcellus',serif;font-size:26px;letter-spacing:.42em;color:#fff;text-transform:uppercase;opacity:.92;text-shadow:0 2px 8px rgba(0,0,0,.4)}
.hook{position:absolute;top:230px;left:50%;transform:translateX(-50%);white-space:nowrap;padding:24px 52px;border-radius:40px;text-align:center;font-family:'Dancing Script',cursive;font-weight:700;font-size:64px;color:#fff;background:linear-gradient(100deg,#ff6b9d,#ff9a56,#ffd24d,#7bed9f,#5ea8ff,#c77dff);box-shadow:0 14px 38px rgba(120,30,80,.36);text-shadow:0 3px 10px rgba(0,0,0,.28)}
.phone{position:absolute;left:300px;top:412px;width:480px;height:1040px;border:13px solid #15131a;border-radius:62px;box-shadow:0 26px 60px rgba(60,20,50,.4),0 0 0 2px rgba(255,255,255,.12) inset}
.notch{position:absolute;left:50%;top:426px;transform:translateX(-50%);width:150px;height:30px;background:#15131a;border-radius:0 0 20px 20px}
.cta{position:absolute;bottom:150px;left:0;right:0;display:flex;flex-direction:column;align-items:center;gap:18px}
.ctapill{padding:24px 50px;border-radius:999px;background:linear-gradient(135deg,#EF9320,#BD6C0A);color:#fff;font-weight:800;font-size:38px;box-shadow:0 12px 34px rgba(120,66,4,.4)}
.ctaurl{font-weight:800;font-size:40px;color:#fff;letter-spacing:.5px;text-shadow:0 2px 10px rgba(0,0,0,.45)}
.ai{position:absolute;bottom:54px;left:0;right:0;text-align:center;font-size:24px;color:rgba(255,255,255,.85);font-weight:700;letter-spacing:1px;text-shadow:0 1px 8px rgba(0,0,0,.5)}</style></head>
<body><div style="position:relative;width:1080px;height:1920px">
<div class="brandrow"><img class="blogo" src="data:image/png;base64,${logo}"><span class="bname">CozyVibe</span></div>
<div class="btag">DEINE BEAUTY ROUTINE</div>
<div class="hook">6 Designs, ein Vibe 🌈</div>
<div class="phone"></div><div class="notch"></div>
<div class="cta"><div class="ctapill">Jetzt kostenlos</div><div class="ctaurl">📲 beautyroutine.app</div></div>
<div class="ai">✦ KI-generiert</div></div></body></html>`;

(async () => {
  // 1) Overlay rendern
  const b = await puppeteer.launch({args:['--no-sandbox','--force-color-profile=srgb']});
  const p = await b.newPage();
  await p.setViewport({width:1080,height:1920,deviceScaleFactor:1});
  await p.setContent(OVERLAY_HTML,{waitUntil:'domcontentloaded'});
  await Promise.race([p.evaluateHandle('document.fonts.ready'), new Promise(r=>setTimeout(r,6000))]);
  await new Promise(r=>setTimeout(r,400));
  await p.screenshot({path:'_showcase_overlay.png', omitBackground:true});
  await b.close();
  console.log('Overlay ok');
  // 2) pro Design ein kurzes App-im-Mockup-Segment
  const segs=[];
  THEMES.forEach((th,i)=>{
    ff(`-f lavfi -i "gradients=s=1080x1920:${th.bg}:d=${CLIP}:r=30" -ss ${th.t} -t ${CLIP} -i "${REC}" -filter_complex "[1]scale=${SW}:${SH}:force_original_aspect_ratio=increase,crop=${SW}:${SH}[app];[0][app]overlay=${SX}:${SY}[v]" -map "[v]" -t ${CLIP} -c:v libx264 -crf 20 -pix_fmt yuv420p -r 30 _sc_${i}.mp4`);
    segs.push(`_sc_${i}.mp4`);
  });
  // 3) concat -> schnelle Abfolge
  fs.writeFileSync('_sc_list.txt', segs.map(s=>`file '${s}'`).join('\n'));
  ff(`-f concat -safe 0 -i _sc_list.txt -c:v libx264 -crf 20 -pix_fmt yuv420p -r 30 _sc_seq.mp4`);
  // 4) fixes Overlay drueber
  ff(`-i _sc_seq.mp4 -loop 1 -i _showcase_overlay.png -filter_complex "[0:v][1:v]overlay=0:0[v]" -map "[v]" -c:v libx264 -crf 20 -pix_fmt yuv420p -r 30 _sc_over.mp4`);
  // 5) Musik (vom Anfang, energiegeladen)
  const d = dur('_sc_over.mp4');
  ff(`-i _sc_over.mp4 -i "${MUSIK}" -filter_complex "[1:a]afade=t=out:st=${Math.max(0,d-0.8).toFixed(1)}:d=0.8[a]" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 160k -shortest output/styles/promo_07_showcase.mp4`);
  cp.execSync('rm -f _sc_*.mp4 _sc_list.txt');
  console.log(`OK promo_07_showcase.mp4 ${d.toFixed(1)}s (${THEMES.length} Designs x ${CLIP}s)`);
})();
