const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

// Get all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find().populate("reviews");
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a book by ID
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("reviews");
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new book
router.post("/", async (req, res) => {
  try {
    const newBook = new Book(req.body);
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
