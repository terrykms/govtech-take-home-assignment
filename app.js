const express = require("express");
const { initializeDb } = require("./database/init");
const users = require("./routes/users.routes");
const upload = require("./routes/upload.routes");

const app = express();
const port = 3000;

const startServer = async () => {
  try {
    await initializeDb();

    app.use(express.urlencoded({ extended: true }));

    app.use("/api", users);
    app.use("/api", upload);

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    console.error("Error initializing database:", err);
    process.exit(1);
  }
};

startServer();
