// File: backend/db.js

const mysql = require("mysql2/promise");

const dbConfig = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "", // Add your password here if you have one
  database: "Local Write DB", // Replace with your actual database name
};

async function getConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log("Connected to the database successfully.");
    return connection;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
}

module.exports = { getConnection };
