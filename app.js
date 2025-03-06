const express = require("express");
const { getUsers, uploadUsers } = require("./helpers/helpers");

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

app.get("/users", async (req, res) => {
  const { status, results, error } = await getUsers(req.query);

  if (error) {
    res.status(status).send({ error });
  } else {
    res.status(status).json({ results });
  }
});

app.post("/upload", async (req, res) => {
  const encodedcsv = req.body.file;

  // empty csv content
  if (!encodedcsv) {
    res.status(400).send({ success: 0, message: "Empty csv content." });
    return;
  }
  const { status, success, message } = await uploadUsers(encodedcsv);
  res.status(status).send({ success, message });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
