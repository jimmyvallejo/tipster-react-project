var express = require('express');
var router = express.Router();

const User = require('../models/User');
const Tip = require('../models/tip');
const Comment = require("../models/comment")

/* GET users listing. */

router.get("/all-tips", (req, res, next) => {
    Tip.find()
      .sort({ createdAt: -1 })
      .populate('comments')
      .then((foundTips) => {
        res.json(foundTips);
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  });


  router.post('/add-tip', (req, res, next) => {
            let newTip = {
                picture: req.body.image,
                owner: req.body.owner,
                ownerpicture: req.body.ownerpicture,
                text: req.body.text,
                likes: [],
                comments: [],
                category: req.body.category,
                location: req.body.location,
                ownerId : req.body.ownerId
            };

            Tip.create(newTip)
                .then((createdTip) => {
                    User.findByIdAndUpdate(req.body.ownerId, {
                        $push: { tips: createdTip._id }
                    }, { new: true })
                        .then((updatedUser) => {
                            res.json(updatedUser);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                })
                .catch((err) => {
                    console.log(err);
                });
        });

router.post('/add-comment', (req, res, next) => {
    let newComment = {
        owner: req.body.owner,
        ownerpicture: req.body.picture,
        text: req.body.text,
        likes: req.body.likes,
    };
    Comment.create(newComment)
        .then((newComment) => {
            Tip.findByIdAndUpdate(req.body.id, {
                $push: { comments: newComment._id }
            }, { new: true })
                .then((updatedTip) => {
                    res.json(updatedTip);
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err);
        });
});

router.post('/add-like', (req, res, next) => {
    const userId = req.body.userId;
    const tipId = req.body.tipId;

    Tip.findById(tipId)
      .then((tip) => {
        if (!tip) {
          return res.status(404).json({ message: "Tip not found" });
        }
        if (tip.likes.includes(userId)) {
          return res.status(400).json({ message: "User has already liked this tip" });
        }

   
        Tip.findByIdAndUpdate(tipId, {
          $addToSet: { likes: userId }
        }, { new: true })
          .then((updatedTip) => {
            res.json(updatedTip);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ message: "Internal server error" });
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
      });
});



router.get('/tip-detail/:id', (req, res, next) => {
    const id = req.params.id;
    Tip.findById(id)
      .populate('comments')
      .then((foundTip) => {
          res.json(foundTip)
      })
      .catch((err) => {
          console.log(err)
      })
  });


  

module.exports = router;