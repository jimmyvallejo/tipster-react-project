var express = require('express');
var router = express.Router();
const fileUploader = require('../config/cloudinary.config')
const User = require('../models/User')
const Tip = require('../models/tip')

router.post("/upload", fileUploader.single("imageUrl"), (req, res, next) => {
  // console.log("file is: ", req.file)
 
  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }

  res.json({ fileUrl: req.file.path });
});


router.post('/profile-edit/:username', fileUploader.single("profile_image"), async (req, res, next) => {
  const username = req.params.username;
  let profile_image;


  if (req.file) {
    profile_image = req.file.path;
  } else {
    profile_image = "https://cdn-icons-png.flaticon.com/512/702/702814.png";
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email: req.body.email }, { username: req.body.username }] });

    if (existingUser && existingUser.username !== username) {
      return res.status(400).json({ message: "Email or username already exists" });
    }

    const updatedUser = await User.findOneAndUpdate({ username: username },
      {
        name: req.body.name,
        profile_image: profile_image,
        email: req.body.email,
        username: req.body.username
      },
      { new: true });

    res.json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get('/profile/:username', (req, res) => {
  const username = req.params.username;
  User.findOne({ username })
  .then(user => {
    // Do something with the user data
    res.json(user);
  })
  .catch(error => {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  });
});

router.get('/profile/tips/:username', (req, res) => {
  const owner = req.params.username;
  Tip.find({ owner })
  .sort({ createdAt: -1 })
  .then(tip => {
    // Do something with the user data
    res.json(tip);
  })
  .catch(error => {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  });
});


router.get('/profile/delete/:username', (req, res, next)=> {
  const username = req.params.username;
  User.findOneAndDelete({ username })
  .then((deletedUser) => {
    console.log(deletedUser)
     console.log("User deleted")
  }).catch((err) => {
      console.log(err)
  })
})


module.exports = router;

