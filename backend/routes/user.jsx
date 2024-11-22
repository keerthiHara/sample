const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Example route for user login
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  // Replace this with actual user validation from the database
  if (email === "admin@test.com" && password === "admin123") {
    const token = jwt.sign({ email, isAdmin: true }, "secret_key");
    return res.json({ token, user: { name: "Admin", isAdmin: true } });
  } else if (email === "user@test.com" && password === "user123") {
    const token = jwt.sign({ email, isAdmin: false }, "secret_key");
    return res.json({ token, user: { name: "User", isAdmin: false } });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});

module.exports = router;
