const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const blogRoutes = require("./routes/blogRoutes");
const { connect } = require("http2");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/blogs", blogRoutes);
connect.db

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
