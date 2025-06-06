# 🗓️ Event Management System

A full-featured web application for managing and displaying upcoming and past events. Built using **Node.js**, **Express**, **EJS**, **MySQL**, and **Bootstrap**.

<br>

## ✨ Features

- 🔐 Admin login system (session-based)
- 📅 Add, edit, delete upcoming events
- 📜 View past events automatically (auto-update logic included)
- 🔎 Public pages to view upcoming and past events
- 📂 Admin dashboard with sidebar navigation
- 🧠 Auto-update logic: Moves events to "past" based on date and time

<br>

## 🚀 Technologies Used

- **Backend:** Node.js, Express.js
- **Frontend:** HTML, CSS (Bootstrap), EJS
- **Database:** MySQL
- **Session Management:** express-session

<br>

## 🔑 Admin Routes Protection

All admin routes are protected using a `requireAdmin` middleware:
```js
function requireAdmin(req, res, next) {
  if (!req.session || req.session.role !== "admin") {
    return res.send("Access Denied! Session not initialized.");
  }
  next();
}
```

<br>

# 🧪 How to Run
1. Clone the repository:
``` 
git clone https://github.com/Mubeen-Channa/Event-Management-Web-App

cd your-repo-name 
```

2. Install dependencies:
``` 
npm install
```

3. Configure .env or DB connection in db.js.

4. Run the server:
``` 
node server.js
```

5. Open in browser:
``` 
http://localhost:3000
```

<br>

Let me know if you'd like to add deployment steps (e.g., for Vercel, Render, or cPanel) or database schema instructions!
