const db = require("../config/db");

const uploadUsers = async (encodedcsv) => {
  // decode URI-encoded csv
  try {
    const decodedcsv = decodeURIComponent(encodedcsv);
    const lines = decodedcsv.split("\n");
    const data = lines.map((line) =>
      line.split(",").map((entry) => entry.trim())
    );
    const selectQuery = `SELECT name FROM users WHERE name = ?`;
    const insertQuery = `INSERT INTO users (name, salary) VALUES (?, ?)`;
    const updateQuery = `UPDATE users SET salary = ? WHERE name = ?`;

    await db.runP("BEGIN TRANSACTION");
    for (let i = 1; i < data.length; i++) {
      try {
        if (data[i].length !== 2) {
          throw new Error(
            `Incorrect number of columns - got ${data[i].length} instead of 2.`
          );
        }

        let [name, salary] = data[i];

        if (!name) throw new Error("Empty name field");

        if (!salary || isNaN(Number(salary)))
          throw new Error(`Invalid salary (${salary}).`);

        salary = parseFloat(salary);

        if (salary < 0) continue; // skipped

        // check if name exists in database
        const { row, err } = await db.getP(selectQuery, [name]);

        if (err) throw new Error(err.message);

        if (row) await db.runP(updateQuery, [salary, name]);
        else await db.runP(insertQuery, [name, salary]);
      } catch (err) {
        await db.runP("ROLLBACK");
        return { status: 400, success: 0, message: err.message };
      }
    }
    await db.runP("COMMIT");
    return {
      status: 200,
      success: 1,
      message: "Successfully uploaded csv data into database.",
    };
  } catch (err) {
    return {
      status: 400,
      success: 0,
      message: err.message,
    };
  }
};

module.exports = uploadUsers;
