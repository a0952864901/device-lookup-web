// download-db.js
const fs = require('fs');
const unzipper = require('unzipper');
const path = require('path');

const url = 'https://github.com/a0952864901/device-lookup-web/releases/download/v1.1.0/cm_events_cm1_2.zip';
const zipPath = path.join(__dirname, 'public/data/cm_events_cm1_2.zip');
const extractDir = path.join(__dirname, 'public/data');

(async () => {
  try {
    console.log('⬇️  開始下載資料庫 ZIP...');
    const res = await fetch(url); // ⬅️ 使用 Node.js 22 內建 fetch
    if (!res.ok) throw new Error(`下載失敗：${res.statusText}`);

    const fileStream = fs.createWriteStream(zipPath);
    await new Promise((resolve, reject) => {
      res.body.pipe(fileStream);
      res.body.on('error', reject);
      fileStream.on('finish', resolve);
    });

    console.log('📦 解壓縮資料庫...');
    fs.createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: extractDir }))
      .on('close', () => {
        console.log('✅ 資料庫下載並解壓完成');
        fs.unlinkSync(zipPath); // 刪除 zip
      })
      .on('error', (err) => {
        console.error('❌ 解壓縮錯誤:', err);
      });
  } catch (err) {
    console.error('❌ 資料庫處理失敗:', err.message);
  }
})();