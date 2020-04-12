const express = require("express");

const Post = require('../models/post');

const router = express.Router();

router.post("", (req, res, next) => {
  const post = Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added succesfully!',
      postId: createdPost._id
    });
  });
});

router.put("/:id", (req, res, next) => {
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({_id: req.params.id}, post)
    .then(post => {
      res.status(201).json({
        message: "Post modified successfully",
        postId: post.id
      });
    }).catch(err => {
      console.log(err);
      res.status(404).json({
        message: 'No post found like this.',
        postId: req.params.id
      });
  });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({message: 'Post not found!'});
      }
    })
});

router.get('', (req, res, next) => {
  Post.find()
    .then(posts => {
      return res.status(201).json(
        {
          message: "Posts fetched successfully",
          posts: posts
        }
      )
    })
    .catch((e) => {
      console.log("Something unnecessary encountered.");
      return res.status(404).json({
        message: "Failed due to posts loading."
      });
    });
});

router.delete('/:id', (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then(result => {
    res.status(200).json({message: "Post deleted"});
  });
});

module.exports = router;
