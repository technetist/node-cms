const express = require('express');
const router = express.Router();
const {userAuthenticated} = require('../../helpers/auth-helpers');

router.all('/*', (req, res, next) => {
  req.app.locals.layout = 'admin';
  next();
});

router.get('/', userAuthenticated, (req, res)=>{
  res.render('admin/dashboard');
});

module.exports = router;
