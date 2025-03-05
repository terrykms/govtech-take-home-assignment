const express = require("express");
const db = require("./database/db");
const app = express();
const port = 3000;

app.get("/users", (req, res) => {
  db.all("SELECT * FROM users", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Failed to retrieve data." });
    }
    res.json(rows);
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
