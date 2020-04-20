const express = require("express");
const multer = require("multer");
const file = require('../middleware/file');
const postController = require('../controllers/post');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();


router.post("", checkAuth, file, postController.addPost);
router.put("/:id", checkAuth, file, postController.modifyPost);
router.get("/:id", postController.getPost);
router.get('', postController.getPosts);
router.delete('/:id', checkAuth, postController.deletePost);


module.exports = router;
