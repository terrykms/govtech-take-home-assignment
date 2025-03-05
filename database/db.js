const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database/database.sqlite", (err) => {
  if (err) {
    console.error("Error opening database", err);
  } else {
    console.log("Database opened successfully");
  }
});

// db.serialize(() => {
//   db.run(
//     `CREATE TABLE IF NOT EXISTS users (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     name TEXT,
//     salary NUMERIC
//     )`
//   );
//   db.run(`INSERT INTO users (name, salary) VALUES (?, ?)`, ["Alex", 3000.0]);
//   db.run(`INSERT INTO users (name, salary) VALUES (?, ?)`, ["Bryan", 3500.0]);
// });

module.exports = db;
