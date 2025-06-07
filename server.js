const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000; // 支援 Render 需要的動態 PORT

// 靜態檔案支援
app.use(express.static(path.join(__dirname)));

// 建立資料庫連線
const db = new sqlite3.Database('./devices.db');

// 查詢 API
app.get('/search', (req, res) => {
  const serial = req.query.serial;

  // ✅ 基本驗證（限制長度、格式）
  if (!serial) {
    return res.json({ error: '請輸入序號' });
  }

  if (serial.length > 20 || !/^[a-zA-Z0-9_-]+$/.test(serial)) {
    return res.json({ error: '請符合所要求的格式' });
  }

  const query = `SELECT * FROM devices WHERE serial = ?`;
  db.get(query, [serial], (err, row) => {
    if (err) {
      console.error('查詢錯誤：', err.message);
      return res.json({ error: '資料庫錯誤' });
    }
    if (!row) {
      return res.json({ error: '查無資料' });
    }
    res.json(row);
  });
});

// 啟動伺服器
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});