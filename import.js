const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const csv = require('csv-parser');

const db = new sqlite3.Database('devices.db');

// CSV 欄位格式：serial,production_date,shipment_part_serial
fs.createReadStream('data.csv')
  .pipe(csv())
  .on('data', (row) => {
    db.run(
      `INSERT OR REPLACE INTO devices (serial, production_date, shipment_part_serial, modem_model, modem_shipment_date) VALUES (?, ?, ?, ?, ?)`,
      [row.serial, row.production_date, row.shipment_part_serial, row.modem_model, row.modem_shipment_date],
      (err) => {
        if (err) console.error(`Insert error for ${row.serial}:`, err.message);
      }
    );
  })
  .on('end', () => {
    console.log('✅ 匯入完成！');
    db.close();
  });
