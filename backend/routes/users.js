const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken"); // Import the jwt module for token generation
const User = require("../models/User"); // Assuming you have a User model for database interaction

// Get user profile
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Update user profile
router.put("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Example route for user login
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  // Replace this with actual user validation from the database
  if (email === "admin@test.com" && password === "admin123") {
    const token = jwt.sign({ email, isAdmin: true }, "secret_key", { expiresIn: "1h" }); // Added expiration time for better security
    return res.json({ token, user: { name: "Admin", isAdmin: true } });
  } else if (email === "user@test.com" && password === "user123") {
    const token = jwt.sign({ email, isAdmin: false }, "secret_key", { expiresIn: "1h" }); // Added expiration time for better security
    return res.json({ token, user: { name: "User", isAdmin: false } });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});

module.exports = router;
