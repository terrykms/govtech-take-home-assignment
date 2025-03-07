const express = require("express");
const uploadUsers = require("../controllers/upload.controllers");
const router = express.Router();

router.post("/upload", async (req, res) => {
  const encodedcsv = req.body.file;

  // empty csv content
  if (!encodedcsv) {
    res.status(400).send({ success: 0, error: "Empty csv content." });
    return;
  }
  const { status, success, message, error } = await uploadUsers(encodedcsv);
  res.status(status).send({ success, message, error });
});

module.exports = router;
