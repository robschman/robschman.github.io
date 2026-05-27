const puppeteer = require('puppeteer');
const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const VIDEOS = [
  { file: 'video4.html', name: 'promo4_showcase',      duration: 30000 },
  { file: 'video5.html', name: 'promo5_termine',       duration: 30000 },
  { file: 'video6.html', name: 'promo6_routine',       duration: 30000 },
  { file: 'video7.html', name: 'promo7_homescreen',    duration: 38000 },
  { file: 'video8.html', name: 'promo8_termin_add',    duration: 35000 },
  { file: 'video9.html', name: 'promo9_routine_add',   duration: 35000 },
];

const WIDTH = 390;
const HEIGHT = 844;
const FPS = 30;
const FRAMES_DIR = path.join(__dirname, 'frames');
const OUT_DIR = path.join(__dirname, 'output');

async function recordVideo({ file, name, duration }) {
  console.log(`\n🎬 Aufnahme: ${name} (${duration/1000}s)...`);

  const framesPath = path.join(FRAMES_DIR, name);
  fs.mkdirSync(framesPath, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      `--window-size=${WIDTH},${HEIGHT}`,
    ],
    defaultViewport: { width: WIDTH, height: HEIGHT, deviceScaleFactor: 2 },
  });

  const page = await browser.newPage();
  const filePath = `file://${path.join(__dirname, file)}`;
  await page.goto(filePath, { waitUntil: 'networkidle0' });

  // Wait for fonts to load
  await new Promise(r => setTimeout(r, 1500));

  const totalFrames = Math.floor((duration / 1000) * FPS);
  const interval = 1000 / FPS;

  console.log(`  📸 ${totalFrames} Frames aufnehmen...`);

  for (let i = 0; i < totalFrames; i++) {
    const frameNum = String(i).padStart(5, '0');
    await page.screenshot({
      path: path.join(framesPath, `frame${frameNum}.jpg`),
      type: 'jpeg',
      quality: 92,
    });
    await new Promise(r => setTimeout(r, interval));
    if (i % 30 === 0) process.stdout.write(`  ⏱  Frame ${i}/${totalFrames}\r`);
  }

  await browser.close();
  console.log(`\n  ✅ Frames fertig. Konvertiere zu MP4...`);

  const outputFile = path.join(OUT_DIR, `${name}.mp4`);
  fs.mkdirSync(OUT_DIR, { recursive: true });

  execSync(
    `ffmpeg -y -framerate ${FPS} -i "${framesPath}/frame%05d.jpg" ` +
    `-vf "scale=${WIDTH*2}:${HEIGHT*2},format=yuv420p" ` +
    `-c:v libx264 -preset fast -crf 18 ` +
    `-movflags +faststart "${outputFile}"`,
    { stdio: 'inherit' }
  );

  // Cleanup frames
  fs.rmSync(framesPath, { recursive: true });
  console.log(`  🎉 Fertig: ${outputFile}`);
}

(async () => {
  console.log('🌸 Beauty Routine – TikTok Video Generator');
  console.log('==========================================');

  for (const video of VIDEOS) {
    await recordVideo(video);
  }

  console.log('\n✨ Alle Videos fertig! Zu finden unter: promo/output/');
  console.log('   promo1.mp4 – "Deine Haut verdient das Beste"');
  console.log('   promo2.mp4 – "Vergisst du deine Skincare auch immer?"');
  console.log('   promo3.mp4 – "Glow Up – POV Style"');
})();
