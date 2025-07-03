// download-db.js
const fetch = require('node-fetch');
const fs = require('fs');
const unzipper = require('unzipper');

const url = 'https://github.com/a0952864901/device-lookup-web/releases/download/v1.1.0/cm_events_cm1_2.zip';

async function downloadAndUnzip() {
  const zipPath = './cm_events_cm1_2.zip';
  const outputPath = './public/data/';

  console.log('⬇️  開始下載資料庫 ZIP...');
  const res = await fetch(url);
  if (!res.ok) throw new Error(`下載失敗：${res.statusText}`);
  const fileStream = fs.createWriteStream(zipPath);
  await new Promise((resolve, reject) => {
    res.body.pipe(fileStream);
    res.body.on('error', reject);
    fileStream.on('finish', resolve);
  });

  console.log('✅ 下載完成，開始解壓...');
  fs.createReadStream(zipPath)
    .pipe(unzipper.Extract({ path: outputPath }))
    .on('close', () => {
      console.log('✅ 解壓完成');
      fs.unlinkSync(zipPath); // 刪除 zip
    });
}

downloadAndUnzip().catch(err => {
  console.error('❌ 資料庫處理失敗:', err.message);
});
