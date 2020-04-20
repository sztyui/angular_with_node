const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

routes = [
  {prefix: "/api/posts", route: require('./routes/posts')},
  {prefix: "/api/user", route: require('./routes/user')}
]

const app = express();
const dbConnectionString = `mongodb+srv://isti:${process.env.MONGO_ATLAS_PW}@cluster0-dejvz.mongodb.net/node-angular`
mongoose.connect(dbConnectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>{
    console.log('Connected to the database!');
  },
  () => {
    console.log('Database connection failed!');
  });

app.use((bodyParser.json()));
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next)=>{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

// app.use("/api/posts", postsRoutes);
// app.use("/users", userRoutes);

routes.map(route => {
  app.use(route.prefix, route.route);
})

module.exports = app;
