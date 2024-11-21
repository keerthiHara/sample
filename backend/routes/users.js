const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Get user profile
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

// Update user profile
router.put("/:id", async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(user);
});

module.exports = router;
