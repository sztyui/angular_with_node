const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();
const dbConnectionString = `mongodb+srv://isti:${process.env.MONGO_PASSWORD}@cluster0-dejvz.mongodb.net/node-angular?retryWrites=true&w=majority`
console.log(dbConnectionString);
mongoose.connect(dbConnectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>{
    console.log('Connected to the database!');
  },
  () => {
    console.log('Database connection failed!');
  });

app.use((bodyParser.json()));
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next)=>{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(createdPost => {
    console.log(createdPost);
    res.status(201).json({
      message: 'Post added succesfully!',
      postId: createdPost._id
    });
  });
});

app.get('/api/posts', (req, res, next) => {
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
      console.log("Something unnecessary happened.");
      return res.status(404).json({
        message: "Failed due to posts loading."
      });
    });
});

app.delete('/api/posts/:id', (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({message: "Post deleted"});
  });
});

module.exports = app;
