import React, { useEffect, useState } from "react";
import Axios from "axios";
import BookCard from "../components/BookCard";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [userData, setUserData] = useState(null); // To store user details
  const [showProfileDropdown, setShowProfileDropdown] = useState(false); // To toggle profile dropdown visibility
  const [showAddForm, setShowAddForm] = useState(false); // For Add Book form visibility

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await Axios.get("http://localhost:5000/api/books");
        setBooks(response.data);
      } catch (err) {
        console.error("Error fetching books:", err);
        if (err.response) {
          setError(`Error: ${err.response.status} - ${err.response.data.message}`);
        } else if (err.request) {
          setError("No response received from the server. Please check your network.");
        } else {
          setError("An error occurred while fetching books.");
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchUserData = async () => {
      const storedUserData = JSON.parse(localStorage.getItem("userData"));
      if (storedUserData) {
        setUserData(storedUserData);

        // Fetch email (if needed) from the backend
        try {
          const response = await Axios.get(`http://localhost:5000/api/users/user/${storedUserData._id}`);
          setUserData((prev) => ({ ...prev, email: response.data.email }));
        } catch (err) {
          console.error("Error fetching user email:", err);
        }

        if (storedUserData.isAdmin) {
          setIsAdmin(true);
        }
      }
    };

    fetchBooks();
    fetchUserData();
  }, []);

  if (loading) return <p>Loading books...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div style={{ position: "relative" }}>
        {/* Profile Icon */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            cursor: "pointer",
          }}
          onClick={() => setShowProfileDropdown(!showProfileDropdown)}
        >
          <img
            src={userData?.profileImage || "default-profile.png"} // Replace with default profile image
            alt="Profile"
            style={{ width: "40px", height: "40px", borderRadius: "50%" }}
          />
        </div>

        {/* Profile Dropdown */}
        {showProfileDropdown && userData && (
          <div
            style={{
              position: "absolute",
              top: "60px",
              right: "10px",
              backgroundColor: "white",
              border: "1px solid #ddd",
              borderRadius: "5px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
              padding: "10px",
            }}
          >
            <p>
              <strong>Name:</strong> {userData.name}
            </p>
            <p>
              <strong>Email:</strong> {userData.email || "Email not available"}
            </p>
          </div>
        )}
      </div>

      <h1>Featured Books</h1>

      {/* Add Book Button for Admin */}
      {isAdmin && (
        <button onClick={() => setShowAddForm(true)}>Add Book</button>
      )}

      {/* Add Book Form */}
      {showAddForm && (
        <div
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            marginTop: "20px",
            borderRadius: "5px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h3>Add a New Book</h3>
          <form>
            <label>Title: </label>
            <input type="text" name="title" placeholder="Book Title" required />
            <br />
            <label>Author: </label>
            <input type="text" name="author" placeholder="Author" required />
            <br />
            <button type="submit">Submit</button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              style={{ marginLeft: "10px" }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

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
