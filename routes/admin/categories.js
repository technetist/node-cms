const Category = require('../../models/Category');
const Post = require('../../models/Post');
const express = require('express');
const router = express.Router();

router.all('/*', (req, res, next) => {
  req.app.locals.layout = 'admin';
  next();
});

router.get('/', (req, res) => {
  Category.find().then(categories => {
    res.render('admin/categories/index', {categories: categories});
  }).catch(err => {
    console.log(err.message)
  });
});

router.post('/create', (req, res) => {
  const newCategory = Category({
    name: req.body.categoryName
  });
  newCategory.save().then(category => {
    Category.find().then(categories => {
      res.redirect('/admin/categories/');
    }).catch(err => {
      console.log(err.message)
    });
  });
});

router.put('/edit/:id', (req, res) => {
  Category.findOne({_id: req.params.id}).then(category => {
    category.name = req.body.name;
    category.save().then(updatedCategory => {
      res.status(200);
      res.send('Success');
    }).catch(err => console.log((err)));
  }).catch(err => {
    console.log(err.message);
  });
});

router.delete('/delete/:id', (req, res) => {
  Category.findOne({_id: req.params.id}).then(category => {
    category.remove().then(removedCategory => {
      res.status(200);
      res.send('Success');
    }).catch(err => console.log((err)));
  }).catch(err => {
    console.log(err.message);
  });
});


module.exports = router;
