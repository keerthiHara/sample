const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  rating: { type: Number, required: true },
});

module.exports = mongoose.model("Review", reviewSchema);
