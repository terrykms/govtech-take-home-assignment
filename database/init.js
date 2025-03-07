const db = require("../config/db");

const dummyData = [
  ["Alice", 4500.75],
  ["John", 8000.5],
  ["Eve", 3200.0],
  ["Mark", 5400.2],
  ["Sophia", 6100.0],
  ["James", 7200.3],
  ["Minseo", 9000.1],
  ["Emma", 3500.4],
  ["Lucas", 2700.15],
  ["Olivia", 1500.6],
];

const initializeDb = async () => {
  try {
    await db.runP(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            salary NUMERIC
            )`);
    const rows = await db.allP(`SELECT COUNT(*) as count FROM users LIMIT 10`);
    if (rows[0].count) return;
    for (let i = 0; i < dummyData.length; i++) {
      await db.runP(
        `INSERT INTO users (name, salary) VALUES (?, ?)`,
        dummyData[i]
      );
    }
  } catch (err) {
    console.error("Error initialising database.", err);
  }
};

module.exports = {
  initializeDb,
};
