const express = require("express");
const { logIn, createPostCard } = require("../controllers/authControllers");
const verifyToken = require("../middleware/authMiddleware");
const multer = require("multer");
const upload = require("../middleware/multer");

const router = express.Router();

router.post("/login", multer().none(), logIn);

router.post("/create-postcard", verifyToken, upload.single('file'), createPostCard);

module.exports = router;
