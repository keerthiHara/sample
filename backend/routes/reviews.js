const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const Book = require("../models/Book");

router.post("/", async (req, res) => {
  try {
    const { user, book, content, rating } = req.body;

    // Create and save the new review
    const newReview = new Review({ user, book, content, rating });
    const savedReview = await newReview.save();

    // Find the book and update the ratings
    const bookToUpdate = await Book.findById(book).populate("reviews");
    if (!bookToUpdate) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Recalculate the average rating
    bookToUpdate.reviews.push(savedReview._id); // Add new review to book
    await bookToUpdate.save(); // Save updated book with the new review

    const allReviews = await Review.find({ book: bookToUpdate._id });
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / allReviews.length;

    bookToUpdate.ratings = averageRating; // Update the average rating
    await bookToUpdate.save();

    res.status(201).json(savedReview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
