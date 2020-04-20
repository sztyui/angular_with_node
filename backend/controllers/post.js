
const Post = require('../models/post');
const checkAuth = require('../middleware/check-auth');


exports.addPost = (req, res, next) => {
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
}

exports.modifyPost = (req, res, next) => {
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
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then((post) => {
      if(post.n > 0){
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
}

exports.getPost = (req, res, next) => {
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
}

exports.getPosts = (req, res, next) => {
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
}

exports.deletePost = (req, res, next) => {
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
}
