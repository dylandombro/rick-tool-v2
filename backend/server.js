const express = require("express");
const mysql = require("mysql2/promise");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const ftp = require("basic-ftp");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
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

// FTP configuration
const ftpConfig = {
  host: "your-ftp-host",
  user: "your-ftp-username",
  password: "your-ftp-password",
  secure: true, // set to false if your FTP server doesn't support FTPS
};

async function uploadToFTP(localFilePath, remoteFilePath) {
  const client = new ftp.Client();
  try {
    await client.access(ftpConfig);
    await client.uploadFrom(localFilePath, remoteFilePath);
    return true;
  } catch (err) {
    console.error("FTP upload error:", err);
    return false;
  } finally {
    client.close();
  }
}

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

  const localFilePath = req.file.path;
  const remoteFilePath = `/remote/path/${req.file.filename}`;

  try {
    // Upload file to FTP
    const ftpSuccess = await uploadToFTP(localFilePath, remoteFilePath);
    if (!ftpSuccess) {
      throw new Error("FTP upload failed");
    }

    // Insert record into database
    const connection = await mysql.createConnection(dbConfig);

    const query = `INSERT INTO rick_tool_records 
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
      remoteFilePath,
    ]);

    await connection.end();

    res
      .status(200)
      .send("Record inserted successfully and file uploaded to FTP");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error processing request");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
