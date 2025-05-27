const express = require('express');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const deviceRoutes = require('./routes/deviceRoutes');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
};

const pool = mysql.createPool(dbConfig);

app.use((req, res, next) => {
  req.db = pool;
  next();
});

app.use(express.static(path.join(__dirname, 'project-root', 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'project-root', 'public', 'index.html'));
});

app.use('/', deviceRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
