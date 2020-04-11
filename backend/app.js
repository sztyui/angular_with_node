const express = require('express');
const bodyParser = require('body-parser');
const Post = require('./models/post');

const app = express();

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
    content: req.body.title
  });

  console.log(post);
  res.status(201).json({
    message: 'Post added succesfully!'
  });
});
// MongoDB user: isti pass: q6HDnipb0CtQpaU1
app.get('/api/posts', (req, res, next) => {
  const posts = [
    {id: 'alksdf987', title: 'First server-side post', content: 'This is coming from the server'},
    {id: 'alk987kajhs', title: 'Second server-side post', content: 'This is coming from the server!'},
    {id: 'iddqdidkfa', title: 'Third server-side post', content: 'This is coming from the server!'}
  ]
  return res.status(200).json({
    message: "Posts fetched succesfully!",
    posts: posts
  });
});

module.exports = app;
