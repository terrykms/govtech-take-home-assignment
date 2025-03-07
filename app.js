const express = require("express");
const { initializeDb } = require("./database/init");
const users = require("./routes/users.routes");
const upload = require("./routes/upload.routes");

const app = express();

const setupApp = async () => {
  await initializeDb();

  app.use(express.urlencoded({ extended: true }));

  app.use("/api", users);
  app.use("/api", upload);
};

module.exports = { app, setupApp };
