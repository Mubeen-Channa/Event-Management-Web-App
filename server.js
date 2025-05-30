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


// Admin Route
app.get("/admin", (req, res) => {
  res.render("login");
})


// Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  
  const query = "SELECT * FROM admins WHERE username = ? AND password = ?";
  connection.query(query, [username, password], (err, results) => {
      if (err) {
          console.error("Database error:", err);
          res.send("Error logging in");
          return;
      }

      if (results.length > 0) {
          req.session.role = "admin"; 
          res.redirect("/dashboard");
      } else {
          res.send('<script>alert("Invalid Credentials"); window.location.href="/admin";</script>');
      }
  });
});


// Home Route
app.get("/", (req, res) => {
  res.redirect("/events");
});


// Eventa show only user Route
app.get("/events", (req, res) => {
  let query = `SELECT * FROM events WHERE status = 'upcoming';`
 
  connection.query(query, (err, events) => {
    if (err) {
      console.error("Error fetching events: " + err.message);
      return res.status(500).send("Database Error");
    }
    res.render("public_events", { events });
  });
});


// Past Events (Happened)
app.get("/past-events", (req, res) => {
  let query = `SELECT * FROM events WHERE status = 'past';`

  connection.query(query, (err, events) => {
    if (err) {
      console.error("Error fetching past events: " + err.message);
      return res.status(500).send("Database Error");
    }
    res.render("public_past_events", { events });
  });
});


// New Event Alert
app.get("/scottish-event", (req, res) => {
  res.render("Scottish_weekend"); 
});


// Dashboard Route
app.get("/dashboard", (req, res) => {

  if (!req.session) {
    return res.send("Access Denied! Session not initialized.");
  }

  const query = `
    SELECT 
      (SELECT COUNT(*) FROM events WHERE status = 'upcoming') AS upcoming_events,
      (SELECT COUNT(*) FROM events WHERE status = 'past') AS past_events;
  `;

  connection.query(query, (err, results) => {
    if (err) throw err;

    const { upcoming_events, past_events } = results[0];

    res.render("dashboard", { upcoming_events, past_events, session: req.session });
  });
});


// Saved Events
app.get("/events/saved", (req, res) => {
  try {
    let query = `SELECT @seq := @seq + 1 AS seq_no, e.*  
             FROM (SELECT * FROM events WHERE status = 'upcoming') AS e,  
             (SELECT @seq := 0) AS seq_table  
             ORDER BY e.id;`;

    connection.query(query, (err, events) => {
      if (err) {
        throw err;
      } else {
        res.render("events_saved", { events });
      }
    });
  } catch (error) {
    res.send(`Error: ${error}`);
  }
});


// Past Events
app.get("/events/past", (req, res) => {
  try {
    let query = `SELECT @seq := @seq + 1 AS seq_no, e.*  
             FROM (SELECT * FROM events WHERE status = 'past') AS e,  
             (SELECT @seq := 0) AS seq_table  
             ORDER BY e.id;`;
             
    connection.query(query, (err, events) => {
      if (err) {
        throw err;
      } else {
        res.render("events_saved", { events });
      }
    });
  } catch (error) {
    res.send(`Error: ${error}`);
  }
});


// Route to Event Form
app.get("/events/new", (req, res) => {
  res.render("new_event");
});



// Event Form Handling 
app.post("/events/create", (req, res) => {
  const { eventTitle, eventDate, openingTime, closingTime, websiteUrl, facebookUrl } = req.body;

  const query = `INSERT INTO events (title, event_date, opening_time, closing_time, website_url, facebook_url) 
               VALUES ('${eventTitle}', '${eventDate}', '${openingTime}', '${closingTime}', '${websiteUrl}', '${facebookUrl}')`;

  connection.query(query, (err, result) => {
    if (err) {
      console.error("Error inserting event: " + err.message);
      return res.status(500).send("Database Error");
    }
    res.send('<script>alert("Event Added Successfully"); window.location.href="/events/new";</script>');
  });
});


// Events Setting Route
app.get("/settings", requireAdmin, (req, res) => res.render("settings"));


// Edit Event
app.get("/events/:id/edit", (req, res) => {
  let query = `SELECT * FROM events WHERE id = ?`;
  connection.query(query, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).send("Database Error: " + err);
    }
    if (results.length === 0) {
      return res.status(404).send("Event not found");
    }
    res.render("edit_event", { event: results[0] }); 
  });
});


// Update Event 
app.patch("/events/:id", (req, res) => {
  let { title, eventDate, openingTime, closingTime } = req.body;
  let query = `UPDATE events SET title = ?, event_date = ?, opening_time = ?, closing_time = ? WHERE id = ?`;

  connection.query(query, [title, eventDate, openingTime, closingTime, req.params.id], (err, result) => {
    if (err) {
      return res.status(500).send("Database Error: " + err);
    }
    res.redirect("/events/saved");
  });
});


// Server
app.listen(port, () => {
  console.log(`Server: http://localhost:3000/`);
});