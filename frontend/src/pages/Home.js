// import React, { useState, useEffect } from "react";
// import BookCard from "../components/BookCard";

// const Home = () => {
//   const [books, setBooks] = useState([]);

//   useEffect(() => {
//     fetch("/api/books")
//       .then((res) => res.json())
//       .then((data) => setBooks(data));
//   }, []);

//   return (
//     <div>
//       <h2>Featured Books</h2>
//       <div>
//         {books.map((book) => (
//           <BookCard key={book._id} book={book} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Home;
import React, { useEffect, useState } from "react";
import Axios from "axios";
import BookCard from "../components/BookCard";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await Axios.get("http://localhost:5000/api/books");
        console.log("Books fetched successfully:", response.data);
        setBooks(response.data); // Update state with books data
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
  }, []);

  if (loading) return <p>Loading books...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Featured Books</h1>
      <div>
        {books.length === 0 ? (
          <p>No books available.</p>
        ) : (
          books.map((book) => (
            // <div key={book._id}>
            //   <h2>{book.title}</h2>
            //   <p>{book.author}</p>
            //   <p>{book.description}</p>
            // </div>
            <BookCard key={book._id} book={book} />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
