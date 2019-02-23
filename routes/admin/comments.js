const Comment = require('../../models/Comment');
const Post = require('../../models/Post');
const express = require('express');
const router = express.Router();
const {userAuthenticated} = require('../../helpers/auth-helpers');

router.all('/*', userAuthenticated, (req, res, next) => {
  req.app.locals.layout = 'admin';
  next();
});

router.get('/', (req, res) => {
  Comment.find().populate('user')
    .then(comments => {
      res.render('admin/comments/index', {comments: comments});
    }).catch(err => {
    console.log(err.message)
  });
});

router.delete('/:id', (req, res) => {
  Comment.findOne({_id: req.params.id}).then(comment => {
    comment.remove().then(removedComment => {
      Post.findOneAndUpdate({comments: req.params.id}, {$pull: {comments: req.params.id}}, (err, data) => {
        if (err) console.log(err);
        res.redirect('/admin/comments')
      });
    }).catch(err => console.log((err)));
  }).catch(err => {
    console.log(err.message);
  });
});

router.patch('/:id', (req, res) => {
  Comment.findOne({_id: req.params.id}).then(comment => {
    comment.approval = req.body.approveComment;
    comment.save().then(updatedComment => {
      res.status(200);
      return res.send('success');
    }).catch(err => console.log((err)));
  }).catch(err => console.log((err)));
});

module.exports = router;
