const router = require("express").Router();
const User = require("../models/User.model");


router.get("/users/:id", (req, res, next) => {

    const userId = req.params.id;
  
    User.find({userId})
      .then((users) => {
        console.log("Retrieved User ID ->", users);
        res.status(200).json(users);
      })
      .catch((error) => {
        console.error("Error while retrieving User ID ->", error);
        next(error);
      });
  });

  module.exports = router;