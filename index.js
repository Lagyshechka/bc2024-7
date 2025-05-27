const express = require('express');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const deviceRoutes = require('./routes/deviceRoutes');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
};

app.use((req, res, next) => {
    req.db = mysql.createPool(dbConfig);
    next();
});

// Роути
app.use('/', deviceRoutes);

// Запуск сервера
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});