import React, { useEffect, useState } from "react";
import Axios from "axios";
import BookCard from "../components/BookCard";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  // const [newProfileImage, setNewProfileImage] = useState(null); // For profile image upload
  const [newBook, setNewBook] = useState({ title: "", author: "" }); // For adding new books

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

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profileImage", file);
  
      // Send the file to the backend
      Axios.post("http://localhost:5000/api/users/upload-profile-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((response) => {
          // Update the state with the new profile image URL
          setUserData((prev) => ({ ...prev, profileImage: response.data.profileImage }));
        })
        .catch((err) => {
          console.error("Error uploading profile image:", err);
          alert("Error uploading image. Please try again.");
        });
    }
  };
  
  

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.post("http://localhost:5000/api/books", newBook);
      setBooks((prevBooks) => [...prevBooks, response.data]);
      setShowAddForm(false);
    } catch (err) {
      console.error("Error adding book:", err);
    }
  };

  const handleBookChange = (e) => {
    setNewBook({ ...newBook, [e.target.name]: e.target.value });
  };

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
            src={userData?.profileImage || "default-profile.png"} // Use default profile image if no user image
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

            {/* Profile Image Update */}
            <div>
              <label htmlFor="profileImageUpload" style={{ cursor: "pointer", color: "#007bff" }}>
                Update Profile Picture
              </label>
              <input
                type="file"
                id="profileImageUpload"
                style={{ display: "none" }}
                onChange={handleProfileImageChange}
              />
            </div>
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
          <form onSubmit={handleAddBook}>
            <label>Title: </label>
            <input
              type="text"
              name="title"
              value={newBook.title}
              onChange={handleBookChange}
              placeholder="Book Title"
              required
            />
            <br />
            <label>Author: </label>
            <input
              type="text"
              name="author"
              value={newBook.author}
              onChange={handleBookChange}
              placeholder="Author"
              required
            />
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
