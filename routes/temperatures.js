const express = require("express");
const router = express.Router();
const Menuitem = require("../models/Menuitem");

router.get("/", (req, res) => {
  const temperatureEnum = Menuitem.schema.path("temperature").enumValues;

  res.json(temperatureEnum);
});

module.exports = router;