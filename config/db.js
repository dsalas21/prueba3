const mysql = require('mysql2/promise');
require('dotenv').config();
const port = 46785;

async function initializeConnection() {
    try {
        const connection = await mysql.createConnection({
            host: "roundhouse.proxy.rlwy.net", 
            user: "root",
            port: port, 
            password: "dPLNXWMXwxFnffTPjiFNjjOVNgZbLQor", 
            database: "railway"
        });
        console.log("Connected to MySQL database");
        return connection;
    } catch (err) {
        console.error("Error connecting to the database:", err);
        throw err;
    }
}

module.exports = initializeConnection;