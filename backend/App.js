const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");



const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/books", require("./routes/books"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/users", require("./routes/users"));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
