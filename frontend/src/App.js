import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import BookDetail from "./pages/BookDetail";
import Filterbook from "./pages/Filterbook"

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book/:id" element={<BookDetail />} />
        <Route path="/search" element={<Filterbook/>}/>

      </Routes>
    </Router>
  );
};

export default App;
