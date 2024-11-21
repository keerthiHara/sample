import React, { useState, useEffect } from "react";
import axios from "axios";
import BookCard from "../components/BookCard";

const Filterbook = () => {
  const [books, setBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");

  // Fetch all books when the component loads
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/books");
        setBooks(response.data);
        setAllBooks(response.data); // Keep a copy of all books for filtering
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch books. Please try again.");
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Generate unique options for dropdowns
  const uniqueTitles = [...new Set(allBooks.map((book) => book.title))];
  const uniqueAuthors = [...new Set(allBooks.map((book) => book.author))];

  // Filter books based on selected dropdown values
  useEffect(() => {
    let filteredBooks = allBooks;

    if (selectedTitle) {
      filteredBooks = filteredBooks.filter(
        (book) => book.title === selectedTitle
      );
    }
    if (selectedAuthor) {
      filteredBooks = filteredBooks.filter(
        (book) => book.author === selectedAuthor
      );
    }

    setBooks(filteredBooks);
  }, [selectedTitle, selectedAuthor, allBooks]);

  if (loading) return <p>Loading books...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Search Books</h1>

      <div>
        <label>
          Filter by Title:
          <select
            value={selectedTitle}
            onChange={(e) => setSelectedTitle(e.target.value)}
          >
            <option value="">All Titles</option>
            {uniqueTitles.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
        </label>

        <label>
          Filter by Author:
          <select
            value={selectedAuthor}
            onChange={(e) => setSelectedAuthor(e.target.value)}
          >
            <option value="">All Authors</option>
            {uniqueAuthors.map((author) => (
              <option key={author} value={author}>
                {author}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        {books.length > 0 ? (
          books.map((book) => (
            // <div key={book._id}>
            //   <h2>{book.title}</h2>
            //   <p>{book.author}</p>
            //   <p>{book.description}</p>
            // </div>
            <BookCard key={book._id} book={book} />
          ))
        ) : (
          <p>No books found.</p>
        )}
      </div>
    </div>
  );
};

export default Filterbook;
