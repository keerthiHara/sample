const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const app = express();
// Get all books
router.get("/", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

// Get a book by ID
router.get("/:id", async (req, res) => {
  const book = await Book.findById(req.params.id).populate("reviews");
  res.json(book);
});

// Add a book (Admin only)
router.post("/", async (req, res) => {
  const book = new Book(req.body);
  await book.save();
  res.status(201).json(book);
});


app.get("/api/books", async (req, res) => {
  try {
    const { title, author } = req.query;
    const query = {};

    if (title) {
      query.title = { $regex: title, $options: "i" }; // Case-insensitive title search
    }
    if (author) {
      query.author = { $regex: author, $options: "i" }; // Case-insensitive author search
    }

    const books = await Book.find(query);
    res.json(books);
  } catch (err) {
    console.error("Error retrieving books:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/books/:id", (req, res) => {
  Book.findById(req.params.id)
    .populate("reviews") // Populate reviews
    .exec((err, book) => {
      if (err) return res.status(500).send(err);
      res.json(book);
    });
});

module.exports = router;
