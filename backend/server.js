const express = require("express");
const mysql = require("mysql2/promise");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Database connection
const dbConfig = {
  host: "localhost",
  port: 3306,
  user: "root",
  database: "Local_Write_DB",
};

// API endpoint to handle file upload and data insertion
app.post("/insert", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const {
    productCode,
    folder,
    trackId,
    raceDate,
    raceNumber,
    dayEvening,
    country,
    stage,
    trackType,
  } = req.body;

  const filePath = req.file.path;

  try {
    const connection = await mysql.createConnection(dbConfig);

    const query = `INSERT INTO your_table_name 
      (product_code, folder, track_id, race_date, race_number, day_evening, country, stage, track_type, file_path) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const [results] = await connection.execute(query, [
      productCode,
      folder,
      trackId,
      raceDate,
      raceNumber,
      dayEvening,
      country,
      stage,
      trackType,
      filePath,
    ]);

    await connection.end();

    res.status(200).send("Record inserted successfully");
  } catch (error) {
    console.error("Error inserting record:", error);
    res.status(500).send("Error inserting record");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
