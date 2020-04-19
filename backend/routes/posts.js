const express = require("express");
const multer = require('multer');

const Post = require('../models/post');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, `${name}-${Date.now()}.${ext}`);
  }
});

router.post("",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const post = Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });
  post.save()
    .then(createdPost => {
      res.status(201).json({
        message: "Post added successfully.",
        post: {
          ...createdPost,
          id: createdPost._id
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Creating a post failed.'
      })
    });
});

router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file){
    let imagePath = req.body.imagePath
    const url = `${req.protocol}://${req.get("host")}`;
    imagePath = `${url}/images/${req.file.filename}` ;
  }
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  console.log(post);
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then((post) => {
      if(post.nModified > 0){
        res.status(201).json({
          message: "Post modified successfully",
          postId: post.id,
        });
      } else {
        res.status(401).json({ message: "Not authorized" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Could not update post.",
      });
    });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: 'Post not found!' });
      }
    })
    .catch(error => {
      return res.status(500).json({message: 'Fetching posts failed!'})
    })
});

router.get('', (req, res, next) => {
  const pageSize = parseInt(req.query.pagesize);
  const currentPage = parseInt(req.query.page);
  const postQuery = Post.find();
  let fetchedPosts;

  if(pageSize && currentPage
    && (!isNaN(pageSize) && !isNaN(currentPage))){
    postQuery.skip(pageSize * (currentPage - 1))
    .limit(pageSize);
  }
  postQuery.then(posts => {
    fetchedPosts = posts;
    return Post.estimatedDocumentCount();
    })
    .then(count => {
      res.status(200).json({
        message: 'Posts fetched successfully',
        posts: fetchedPosts,
        maxPosts: count
      })
    })
    .catch(error => {
      return res.status(500).json({message: 'Fetching posts failed!'})
    })
});

router.delete(
  '/:id',
  checkAuth,
  (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
    console.log(result);
    if(result.deletedCount > 0){
      res.status(200).json({ message: "Post deleted" });
    } else {
      res.status(401).json({ message: "Not authorized" });
    }
  }).catch(error => {
    return res.status(500).json({message: 'Deleting unsuccessfull!'})
  });
});

module.exports = router;
