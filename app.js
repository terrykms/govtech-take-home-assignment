const express = require("express");
const { initializeDb } = require("./database/init");
const users = require("./routes/users.routes");
const upload = require("./routes/upload.routes");

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

initializeDb();

app.use("/api", users);
app.use("/api", upload);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
