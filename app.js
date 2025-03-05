const express = require("express");
const { getUsers } = require("./helpers/helpers");

const app = express();
const port = 3000;

app.get("/users", async (req, res) => {
  const { status, results, error } = await getUsers(req.query);

  if (error) {
    res.status(status).send({ error });
  } else {
    res.status(status).json({ results });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
