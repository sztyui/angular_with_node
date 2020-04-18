const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require('../models/user');

const router = express.Router();

router.post("/signup", (req, res, next) => {
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
            error: err
          });
        });
    });

});

router.post("/login", (req, res, next) => {
  let foundUser;
  User.findOne({
    email: req.body.email
  }).then(user => {
    if (!user){
      return res.status(404).json({
        message: "Auth failed"
      });
    }
    foundUser = user;
    return bcrypt.compare(req.body.password, user.password);
  })
  .then(result => {
    if(!result){
      return res.status(404).json({
        message: "Auth failed"
      });
    }
    const token = jwt.sign(
      {email: foundUser.email, userId: foundUser._id},
      'eg_a_napmelegtol_a_kopar_szik_sarja_tikkadt_szocskenyajak_legelesznek_rajta',
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
      message: "Auth failed"
    });
  });
});

module.exports = router;
