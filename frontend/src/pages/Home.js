import React, { useEffect, useState } from "react";
import Axios from "axios";
import BookCard from "../components/BookCard";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); // State to track if the user is an admin
  const [newBookTitle, setNewBookTitle] = useState("");
  const [newBookAuthor, setNewBookAuthor] = useState("");
  const [newBookDescription, setNewBookDescription] = useState("");
  const [showAddForm, setShowAddForm] = useState(false); // State to toggle Add Book form visibility

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await Axios.get("http://localhost:5000/api/books");
        setBooks(response.data); 
      } catch (err) {
        console.error("Error fetching books:", err);
        // Improved error handling
        if (err.response) {
          setError(`Error: ${err.response.status} - ${err.response.data.message}`);
        } else if (err.request) {
          setError("No response received from the server. Please check your network.");
        } else {
          setError("An error occurred while fetching books.");
        }
      } finally {
        setLoading(false); // Ensure loading is stopped
      }
    };

    fetchBooks();

    // Check if the user is logged in and if the user is an admin
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData && userData.isAdmin) {
      setIsAdmin(true); 
    }
  }, []);

  // Function to handle adding a new book
  const handleAddBook = async (e) => {
    e.preventDefault();

    const newBook = {
      title: newBookTitle,
      author: newBookAuthor,
      description: newBookDescription,
    };

    try {
      const response = await Axios.post("http://localhost:5000/api/books", newBook);
      
      setBooks((prevBooks) => [...prevBooks, response.data]);
      // Clear the form fields
      setNewBookTitle("");
      setNewBookAuthor("");
      setNewBookDescription("");
      setShowAddForm(false); // Hide the form after submission
      alert("Book added successfully!");
    } catch (err) {
      console.error("Error adding book:", err);
      setError("There was an error adding the book. Please try again.");
    }
  };

  if (loading) return <p>Loading books...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Featured Books</h1>

      {/* Add Book Button (visible only for admins) */}
      {isAdmin && !showAddForm && (
        <button onClick={() => setShowAddForm(true)}>Add Book</button>
      )}

      {/* Add Book Form (visible when showAddForm is true) */}
      {isAdmin && showAddForm && (
        <div>
          <h2>Add a New Book</h2>
          <form onSubmit={handleAddBook}>
            <div>
              <label>Title</label>
              <input
                type="text"
                value={newBookTitle}
                onChange={(e) => setNewBookTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Author</label>
              <input
                type="text"
                value={newBookAuthor}
                onChange={(e) => setNewBookAuthor(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Description</label>
              <textarea
                value={newBookDescription}
                onChange={(e) => setNewBookDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <button type="submit">Add Book</button>
          </form>
        </div>
      )}

      {/* Display list of books */}
      <div>
        {books.length === 0 ? (
          <p>No books available.</p>
        ) : (
          books.map((book) => (
            <div key={book._id}>
              <BookCard book={book} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
