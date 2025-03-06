const db = require("../database/db");

const getUsers = async (query) => {
  let { min, max, offset, limit, sort } = query;
  // checks for params
  if (
    sort &&
    sort.toLowerCase().valueOf() !== "name".valueOf() &&
    sort.toLowerCase().valueOf() !== "salary".valueOf()
  ) {
    return {
      status: 400,
      error:
        "Invalid params for 'sort'. Accepted values are 'name' and 'salary'.",
    };
  }

  min = min ? parseFloat(min) : 0.0;
  max = max ? parseFloat(max) : 4000.0;
  offset = offset ? parseInt(offset) : undefined;
  limit = limit ? parseInt(limit) : undefined;
  sort = sort ? sort.toLowerCase() : undefined;

  let sql = "SELECT name, salary FROM users WHERE salary >= ? AND salary <= ?";
  const conditions = [min, max];

  if (sort) {
    sql += ` ORDER BY ${sort} ASC`;
  }
  if (limit) {
    sql += " LIMIT ?";
    conditions.push(limit);
  }
  if (offset) {
    sql += " OFFSET ?";
    conditions.push(offset);
  }
  try {
    const results = await db.allP(sql, conditions);
    return {
      status: 200,
      results,
    };
  } catch (err) {
    return {
      status: 500,
      error: "Failed to retrieve users",
    };
  }
};

const uploadUsers = async (encodedcsv) => {
  // decode URI-encoded csv
  const decodedcsv = decodeURIComponent(encodedcsv);
  const lines = decodedcsv.split("\n");
  const data = lines.map((line) =>
    line.split(",").map((entry) => entry.trim())
  );

  let hasErr = false;
  let message = "";

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");
    const sql = `INSERT INTO users (name, salary) VALUES (?, ?)`;
    for (let i = 1; i < data.length; i++) {
      try {
        let [name, salary] = data[i];

        if (!name) {
          hasErr = true;
          throw new Error("Invalid name.");
        }

        if (!salary || isNaN(Number(salary))) {
          hasErr = true;
          throw new Error("Invalid salary.");
        }

        salary = parseFloat(salary);

        if (salary < 0) continue; // skipped

        db.run(sql, [name, salary]);
      } catch (err) {
        db.run("ROLLBACK");
        hasErr = true;
        message = err.message;
        break;
      }
    }
    if (!hasErr) {
      db.run("COMMIT");
    }
  });
  if (hasErr) {
    return { status: 400, success: 0, message };
  }
  message = "Successfully uploaded csv data into database.";
  return { status: 200, success: 1, message };
};

module.exports = {
  getUsers,
  uploadUsers,
};
