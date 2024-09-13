// File: backend/server.js

const express = require("express");
const mysql = require("mysql2/promise");
const multer = require("multer");
const path = require("path");
const AWS = require("aws-sdk");
const fs = require("fs").promises;

const app = express();
const port = process.env.PORT || 3000;

// Database configuration
const dbConfig = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "", // Add your password here if you have one
  database: "race_card_db", // Replace with your actual database name
};

// Multer configuration for file uploads
const upload = multer({ dest: "backend/uploads/" });

// AWS S3 configuration (placeholder)
// AWS.config.update({ region: 'your-region' });
// const s3 = new AWS.S3();

// Database connection function
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

// S3 upload function (placeholder)
async function uploadFileToS3(filePath, bucketName, key) {
  // This is a placeholder function. Implement actual S3 upload logic here.
  console.log(`Simulating upload of ${filePath} to ${bucketName}/${key}`);
  return `https://${bucketName}.s3.amazonaws.com/${key}`;
}

// API endpoint to insert a record
app.post("/api/insertRecord", upload.single("file"), async (req, res) => {
  let connection;
  try {
    connection = await getConnection();

    const {
      productCode,
      folder,
      bdsCode,
      raceDate,
      raceNumber,
      dayEvening,
      country,
      stage,
      trackType,
    } = req.body;

    // Simulate S3 upload (replace with actual S3 upload later)
    // const file = req.file;
    // const s3Url = await uploadFileToS3(
    //   file.path,
    //   "your-bucket-name",
    //   `${folder}/${file.filename}`
    // );

    // Insert record into database
    // const [result] = await connection.execute(
    //   "INSERT INTO bris_migration_v5.bds_available_products (product_code, folder, track_id, race_date, race_number, day_evening, country, stage, track_type, file_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    //   [
    //     productCode,
    //     folder,
    //     bdsCode,
    //     raceDate,
    //     raceNumber,
    //     dayEvening,
    //     country,
    //     stage,
    //     trackType,
    //     s3Url,
    //   ]
    // );
    const [result] = await connection.execute(
      "INSERT INTO race_card_db.rick_tool_records (product_code, folder, track_id, race_date, race_number, day_evening, country, stage, track_type, file_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        productCode,
        folder,
        bdsCode,
        raceDate,
        raceNumber,
        dayEvening,
        country,
        stage,
        trackType,
        s3Url,
      ]
    );

    // Clean up the temporary file
    await fs.unlink(file.path);

    res.json({ message: "Record inserted successfully", id: result.insertId });
  } catch (error) {
    console.error("Error inserting record:", error);
    res
      .status(500)
      .json({ error: "An error occurred while inserting the record" });
  } finally {
    if (connection) connection.end();
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
