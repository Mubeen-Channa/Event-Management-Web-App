const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const moment = require("moment");
const session = require("express-session");

const app = express();
const port = 3000;


// middleware to parse incoming form data.
app.use(express.urlencoded({ extended: true }));

// Method Override Middleware
app.use(methodOverride("_method"));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Parse form data
app.use(bodyParser.urlencoded({ extended: true }));


// Set up the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));


// MySql Connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mysql123",
  database: "events_db",
});


// Home Route
app.get("/", (req, res) => {
  res.redirect("/events");
});


// Server
app.listen(port, () => {
  console.log(`Server: http://localhost:3000/`);
});