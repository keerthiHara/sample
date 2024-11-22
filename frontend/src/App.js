import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import BookDetail from "./pages/BookDetail";
import FilterBook from "./pages/FilterBook";
import LoginForm from "./components/LoginForm";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/book/:id" element={<BookDetail />} />
        <Route path="/search" element={<FilterBook />} />
        {/* Add a route for /user/dashboard if needed */}
      </Routes>
    </Router>
  );
};

export default App;
