const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const OktaJwtVerifier = require("@okta/jwt-verifier");

const app = express();
const port = process.env.PORT || 3000;

// Okta JWT Verifier
const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: "https://dev-30654601.okta.com/oauth2/default",
});

// Authentication middleware
const authenticationRequired = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const match = authHeader.match(/Bearer (.+)/);

  if (!match) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const accessToken = match[1];
    await oktaJwtVerifier.verifyAccessToken(accessToken, "api://default");
    next();
  } catch (err) {
    return res.status(401).send(err.message);
  }
};

// CORS configuration
const corsOptions = {
  origin: "http://localhost:4200",
  optionsSuccessStatus: 200,
};

// Enable CORS for all routes
app.use(cors(corsOptions));
// Parse JSON bodies
app.use(express.json());
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Database configuration
const dbConfig = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "RootPass!",
  database: "race_card_db",
};

// Multer configuration for file uploads
const upload = multer({ dest: "backend/uploads/" });

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

// Helper function to format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
}

// Function to handle file upload (placeholder for future S3 integration)
async function handleFileUpload(file) {
  // TODO: Replace this with S3 upload logic when ready
  console.log("File received:", file.originalname);
  // For now, we'll just return the original filename
  return file.originalname;
}

// API endpoint to insert a record
app.post(
  "/api/insertRecord",
  authenticationRequired,
  upload.single("file"),
  async (req, res) => {
    let connection;
    try {
      connection = await getConnection();

      console.log("Request body:", req.body);
      console.log("File:", req.file);

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

      // Handle file upload (prepared for future S3 integration)
      const filePath = req.file ? await handleFileUpload(req.file) : "";

      // Format the date
      const formattedRaceDate = formatDate(raceDate);

      // Insert record into database
      const [result] = await connection.execute(
        "INSERT INTO race_card_db.rick_tool_records (product_code, folder, track_id, race_date, race_number, day_evening, country, stage, track_type, file_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          productCode,
          folder,
          bdsCode,
          formattedRaceDate,
          raceNumber,
          dayEvening,
          country,
          stage,
          trackType,
          filePath,
        ]
      );

      res.json({
        message: "Record inserted successfully",
        id: result.insertId,
      });
    } catch (error) {
      console.error("Error inserting record:", error);
      res.status(500).json({
        error: "An error occurred while inserting the record",
        details: error.message,
      });
    } finally {
      if (connection) await connection.end();
    }
  }
);

// Test route to check if the server is running
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
