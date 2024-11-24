const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const app = express();

// Enable Cross-Origin Request (if needed)
app.use(cors());

// Set up the storage engine for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Store files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Create a unique file name
  }
});

// Initialize Multer with the storage configuration
const upload = multer({ storage });

// Ensure the 'uploads' directory exists
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Image upload route
app.post("/api/users/upload-profile-image", upload.single("profileImage"), (req, res) => {
  if (req.file) {
    // Send back the path to the uploaded image
    res.json({ profileImage: `/uploads/${req.file.filename}` });
  } else {
    res.status(400).send("No file uploaded.");
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
