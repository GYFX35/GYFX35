const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const path = require('path');

async function openDb() {
    const db = await open({
        filename: path.join(__dirname, 'database.db'),
        driver: sqlite3.Database
    });

    await db.exec(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )`);

    return db;
}

module.exports = openDb;
