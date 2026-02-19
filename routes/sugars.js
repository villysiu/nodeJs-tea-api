const express = require("express");
const router = express.Router();
const Menuitem = require("../models/Menuitem");

router.get("/", (req, res) => {
  const sugarEnum = Menuitem.schema.path("sugar").enumValues;

  res.json(sugarEnum);
});

module.exports = router;
