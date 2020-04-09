const express = require('express');

const app = express();


app.use('/api/posts', (req, res, next) => {
  const posts = [
    {id: 'alksdf987', title: 'first server-side post', content: 'This is coming from the server'},
    {id: 'alk987kajhs', title: 'second server-side post', content: 'This is coming from the server!'}
  ]
  return res.status(200).json({
    message: "Posts fetched succesfully!",
    posts: posts
  });
});

module.exports = app;
