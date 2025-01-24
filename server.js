const express = require("express");

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