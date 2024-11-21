const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const Book = require("../models/Book");

// Get reviews for a book
router.get("/:bookId", async (req, res) => {
  const reviews = await Review.find({ book: req.params.bookId }).populate("user");
  res.json(reviews);
});

// Add a review
// router.post("/", async (req, res) => {
//   const review = new Review(req.body);
//   await review.save();
//   res.status(201).json(review);
// });
// router.post("/reviews", (req, res) => {
//   const newReview = new Review(req.body);
//   newReview.save((err, review) => {
//     if (err) return res.status(500).send(err);
//     Book.findByIdAndUpdate(
//       req.body.book,
//       { $push: { reviews: review._id } }, // Add review ID to book's reviews
//       { new: true },
//       (err) => {
//         if (err) return res.status(500).send(err);
//         res.json(review);
//       }
//     );
//   });
// });
router.post("/reviews", async (req, res) => {
  try {
    const { user, book, content, rating } = req.body;

    // Validate user and book as ObjectIds
    if (!mongoose.Types.ObjectId.isValid(user) || !mongoose.Types.ObjectId.isValid(book)) {
      return res.status(400).json({ error: "Invalid user or book ID." });
    }

    // Create and save review
    const newReview = new Review({ user, book, content, rating });
    const savedReview = await newReview.save();

    // Update the book with the new review ID
    await Book.findByIdAndUpdate(book, { $push: { reviews: savedReview._id } });

    res.status(201).json(savedReview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
