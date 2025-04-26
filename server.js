const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const moment = require("moment");
const session = require("express-session");

const app = express();
const port = 3000;


// Home Route
app.get("/", (req, res) => {
  res.send("Welcome To Event Management Application");
});

// Server
app.listen(port, () => {
  console.log(`Server: http://localhost:3000/`);
});