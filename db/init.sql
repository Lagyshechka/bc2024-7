CREATE DATABASE IF NOT EXISTS inventory;
USE inventory;

CREATE TABLE devices (
                         id INT AUTO_INCREMENT PRIMARY KEY,
                         device_name VARCHAR(255) NOT NULL,
                         serial_number VARCHAR(255) NOT NULL UNIQUE,
                         user_id INTEGER
);

CREATE TABLE users (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        name TEXT NOT NULL
);