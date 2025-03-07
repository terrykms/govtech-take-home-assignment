const db = require("../config/db");

const uploadUsers = async (encodedcsv) => {
  // decode URI-encoded csv
  try {
    const decodedcsv = decodeURIComponent(encodedcsv);
    const lines = decodedcsv.split("\n");
    const data = lines.map((line) =>
      line.split(",").map((entry) => entry.trim())
    );

    const header = data[0];

    // checking for invalid header row
    if (
      header.length !== 2 ||
      header[0].toLowerCase() !== "name" ||
      header[1].toLowerCase() !== "salary"
    ) {
      throw new Error("Invalid header row.");
    }
    // checking for csv file with empty rows (apart from header)
    if (data.length === 1) {
      throw new Error("No data present in csv file.");
    }

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
        const row = await db.getP(selectQuery, [name]);

        // update salary for matching name
        if (row) await db.runP(updateQuery, [salary, name]);
        // insert new entry (name, salary)
        else await db.runP(insertQuery, [name, salary]);
      } catch (err) {
        await db.runP("ROLLBACK"); // undo all inserts/updates
        return { status: 400, success: 0, error: err.message };
      }
    }
    await db.runP("COMMIT"); // finalize and commit commands into database
    return {
      status: 200,
      success: 1,
      message: "Successfully uploaded csv data into database.",
    };
  } catch (err) {
    return {
      status: 400,
      success: 0,
      error: err.message,
    };
  }
};

module.exports = uploadUsers;
