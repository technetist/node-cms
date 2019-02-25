const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const User = require('../../models/User');
const Category = require('../../models/Category');
const Comment = require('../../models/Comment');
const {userAuthenticated} = require('../../helpers/auth-helpers');

router.all('/*', (req, res, next) => {
  req.app.locals.layout = 'admin';
  next();
});

router.get('/', userAuthenticated, (req, res) => {
  Post.count({}).then(postCount => {
    Comment.find({})
      .sort({$natural: 1})
      .limit(4)
      .populate({path: 'post', model: 'posts', populate: {path: 'user', model: 'users'}})
      .populate('user')
      .then(comments => {
        Comment.count({}).then(commentCount => {
          Category.count({}).then(categoryCount => {
            User.count({}).then(userCount => {
              const aggregatorOpts = [{
                $group: {
                  _id: "$joined",
                  count: {$sum: 1}
                }
              },
                {
                  $sort: {_id: 1}
                }
              ];
              User.aggregate(aggregatorOpts).then(userRegistrations => {
                res.render('admin/dashboard', {
                  postCount: postCount,
                  commentCount: commentCount,
                  categoryCount: categoryCount,
                  userCount: userCount,
                  userRegistrations: JSON.stringify(userRegistrations),
                  comments: comments,
                  now: Date.now()
                });
              });
            }).catch(err => console.log(err));
          }).catch(err => console.log(err));
        }).catch(err => console.log(err));
      }).catch(err => console.log(err));
  }).catch(err => console.log(err));
});

module.exports = router;
