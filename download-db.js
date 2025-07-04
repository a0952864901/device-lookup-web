// download-db.js
const fs = require('fs');
const unzipper = require('unzipper');
const path = require('path');

// 資料庫壓縮檔的 GitHub Release 下載網址
const url = 'https://github.com/a0952864901/device-lookup-web/releases/download/v1.1.0/cm_events_cm1_2.zip';

const zipPath = path.join(__dirname, 'public/data/cm_events_cm1_2.zip');
const extractDir = path.join(__dirname, 'public/data');

(async () => {
  try {
    console.log('⬇️  開始下載資料庫 ZIP...');

    // ✅ 確保 public/data 資料夾存在
    fs.mkdirSync(extractDir, { recursive: true });

    const res = await fetch(url);
    if (!res.ok) throw new Error(`下載失敗：${res.statusText}`);

    // ✅ 改寫 res.body.pipe 改成 async iterable 寫入檔案
    const fileStream = fs.createWriteStream(zipPath);
    for await (const chunk of res.body) {
      fileStream.write(chunk);
    }
    fileStream.end();

    fileStream.on('finish', () => {
      console.log('📦 解壓縮資料庫...');
      fs.createReadStream(zipPath)
        .pipe(unzipper.Extract({ path: extractDir }))
        .on('close', () => {
          console.log('✅ 資料庫下載並解壓完成');
          fs.unlinkSync(zipPath); // ⬅️ 移除 zip
        })
        .on('error', (err) => {
          console.error('❌ 解壓縮錯誤:', err);
        });
    });

    fileStream.on('error', (err) => {
      console.error('❌ 寫入 ZIP 檔案錯誤:', err);
    });
  } catch (err) {
    console.error('❌ 資料庫處理失敗:', err.message);
  }
})();
// just add some comment