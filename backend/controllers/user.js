const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require('../models/user');

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(result => {
          result.password = "created";
          res.status(201).json({
            message: "User created",
            result: result
          })
        })
        .catch(err => {
          res.status(500).json({
              message: "Invalid authentication credentials!"
            });
        });
    });
}

exports.userLogin =  (req, res, next) => {
  let foundUser;
  User.findOne({
    email: req.body.email
  }).then(user => {
    if (!user){
      return res.status(404).json({
        message: "Authentication failed"
      });
    }
    foundUser = user;
    return bcrypt.compare(req.body.password, user.password);
  })
  .then(result => {
    if(!result){
      return res.status(404).json({
        message: "Authentication failed"
      });
    }
    const token = jwt.sign(
      {email: foundUser.email, userId: foundUser._id},
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: foundUser._id
    })
  })
  .catch(err => {
    res.status(404).json({
      message: "Invalid authentication credentials"
    });
  });
}
