// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// const BookDetail = () => {
//   const { id } = useParams();
//   const [book, setBook] = useState(null);

//   useEffect(() => {
//     fetch(`http://localhost:5000/api/books/${id}`)
//       .then((res) => res.json())
//       .then((data) => setBook(data));
//   }, [id]);

//   return book ? (
//     <div>
//       <h2>{book.title}</h2>
//       <p>{book.author}</p>
//       <p>{book.description}</p>
//     </div>
//   ) : (
//     <p>Loading...</p>
//   );
// };

// export default BookDetail;
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReviewContent, setNewReviewContent] = useState(""); // Define newReviewContent
  const [newReviewRating, setNewReviewRating] = useState(1); // Define newReviewRating

  useEffect(() => {
    // Fetch book details
    fetch(`http://localhost:5000/api/books/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setBook(data);
        setReviews(data.reviews || []); // Ensure reviews are set
      });
  }, [id]);

  // Function to handle review submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    const reviewData = {
      user: "648a1b3c2b4312d4e5280a2d", // Replace with logged-in user ID
      book: id, // Current book ID
      content: newReviewContent,
      rating: newReviewRating,
    };

    try {
      const response = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        const newReview = await response.json();
        setReviews((prevReviews) => [...prevReviews, newReview]);
        setNewReviewContent(""); // Reset the form
        setNewReviewRating(1);
      } else {
        const error = await response.json();
        console.error("Error adding review:", error.error);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return book ? (
    <div>
      <h2>{book.title}</h2>
      <p>Author: {book.author}</p>
      <p>Description: {book.description}</p>

      <h3>Reviews:</h3>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review._id}>
            <p>{review.content}</p>
            <p>Rating: {review.rating}</p>
          </div>
        ))
      ) : (
        <p>No reviews yet.</p>
      )}

      <h3>Add a Review:</h3>
      <form onSubmit={handleReviewSubmit}>
        <textarea
          placeholder="Write your review here"
          value={newReviewContent}
          onChange={(e) => setNewReviewContent(e.target.value)} // Update newReviewContent
        ></textarea>
        <br />
        <label>
          Rating:
          <select
            value={newReviewRating}
            onChange={(e) => setNewReviewRating(Number(e.target.value))} // Update newReviewRating
          >
            {[1, 2, 3, 4, 5].map((rating) => (
              <option key={rating} value={rating}>
                {rating}
              </option>
            ))}
          </select>
        </label>
        <br />
        <button type="submit">Submit Review</button>
      </form>
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default BookDetail;

