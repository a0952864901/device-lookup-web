DROP TABLE IF EXISTS devices;

CREATE TABLE devices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  serial TEXT UNIQUE NOT NULL,
  production_date TEXT,
  shipment_part_serial TEXT
);

INSERT INTO devices (serial, production_date, shipment_part_serial)
VALUES 
  ('A123456', '2024-12-01', 'P987654'),
  ('B654321', '2025-01-15', 'P123456');