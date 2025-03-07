const express = require("express");
const getUsers = require("../controllers/users.controllers");

const router = express.Router();

router.get("/users", async (req, res) => {
  const { status, results, error } = await getUsers(req.query);

  if (error) {
    res.status(status).send({ error });
  } else {
    res.status(status).json({ results });
  }
});

module.exports = router;
