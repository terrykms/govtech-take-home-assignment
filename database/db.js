const sqlite3 = require("sqlite3").verbose();
const { promisify } = require("util");
const db = new sqlite3.Database("./database/database.sqlite", (err) => {
  if (err) {
    console.error("Error opening database", err);
  } else {
    console.log("Database opened successfully");
  }
});

db.allP = promisify(db.all).bind(db);
db.runP = promisify(db.run).bind(db);
db.getP = promisify(db.get).bind(db);

module.exports = db;
