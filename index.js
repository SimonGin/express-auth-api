const express = require("express");
const app = express();
const PORT = 4000;

app
  .get("/profile", (req, res) => {
    res.status(200).json("Welcome, your app is working well");
  })
  .post("/register", (req, res) => {
    res.status(200).json("Welcome, your app is working well");
  })
  .post("/login", (req, res) => {
    res.status(200).json("Welcome, your app is working well");
  });

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;
