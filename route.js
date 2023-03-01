const express = require("express");
const router = express.Router()
const { blank, getStatus, create } = require("./controller");


router.get("/", blank);
router.get("/status/:id", getStatus);
router.get("/create/:url", create);


module.exports = router