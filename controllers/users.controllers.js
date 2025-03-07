const db = require("../config/db");

const getUsers = async (query) => {
  let { min, max, offset, limit, sort } = query;

  // checks for params
  for (const [key, value] of Object.entries(query)) {
    if (key === "sort") {
      if (
        !value ||
        value.toLowerCase() === "name" ||
        value.toLowerCase() === "salary"
      ) {
        // valid params for "sort"
        continue;
      }
      return {
        status: 400,
        error:
          "Invalid params for 'sort'. Accepted values are 'name' and 'salary'.",
      };
    } else {
      if (!value || !isNaN(Number(value))) continue; // valid params
      return {
        status: 400,
        error: `Invalid params for '${key}'.`,
      };
    }
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

module.exports = getUsers;
