const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = 3000;

// 靜態檔案支援（提供 index.html）
app.use(express.static(path.join(__dirname)));

// 建立資料庫連線
const db = new sqlite3.Database('./devices.db');

// 查詢 API
app.get('/search', (req, res) => {
  const serial = req.query.serial;
  if (!serial) {
    return res.json({ error: '請輸入序號' });
  }

  const query = `SELECT * FROM devices WHERE serial = ?`;
  db.get(query, [serial], (err, row) => {
    if (err) return res.json({ error: '資料庫錯誤' });
    if (!row) return res.json({ error: '查無資料' });
    res.json(row);
  });
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});