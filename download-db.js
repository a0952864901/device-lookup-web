const fs = require('fs');
const https = require('https');
const unzipper = require('unzipper');

// GitHub Release 下載連結（你的）
const url = 'https://github.com/a0952864901/device-lookup-web/releases/download/v1.1.0/cm_events_cm1_2.zip';

// 下載並解壓縮至 ./public/data 資料夾
https.get(url, (res) => {
  if (res.statusCode !== 200) {
    console.error(`❌ 下載失敗，HTTP 狀態碼：${res.statusCode}`);
    return;
  }

  res
    .pipe(unzipper.Extract({ path: './public/data' }))
    .on('close', () => console.log('✅ 資料庫下載與解壓完成！'))
    .on('error', (err) => console.error('❌ 解壓錯誤：', err));
});
