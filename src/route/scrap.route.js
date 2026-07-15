const express = require("express");
const auth = require("../middleware/auth");
const { getScrapList, addScrap, deleteScrap } = require("../controller/scrap.controller");

const router = new express.Router();

router.get("/list", auth, getScrapList);
router.post("/add", auth, addScrap);
router.delete("/delete/:id", auth, deleteScrap);

module.exports = router;
