const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const upload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const {mongoDbUrl} = require('./config/database');

const {select, generateTime, condenseText, toJSON} = require('./helpers/handlebars-helpers');

const home = require('./routes/home/main');
const comments = require('./routes/home/comments');
const adminComments = require('./routes/admin/comments');
const admin = require('./routes/admin/main');
const posts = require('./routes/admin/posts');
const generate = require('./routes/admin/generate');
const categories = require('./routes/admin/categories');

const app = express();
const port = process.env.PORT || 9999;

mongoose.connect(mongoDbUrl, {useNewUrlParser: true}).then((db) => {
  console.log('mongo connected');
}).catch(error => console.log(error));


app.use(session({
  secret: 'AdrienCodes2412',
  resave: true,
  saveUninitialized: true
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.loggedInUser = req.user || null;
  res.locals.success_message = req.flash('success_message');
  res.locals.error = req.flash('error');
  next();
});

app.engine('handlebars', exphbs({
  defaultLayout: 'home',
  helpers: {select: select, generateTime: generateTime, condenseText: condenseText, toJSON: toJSON}
}));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));

app.use(upload());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(methodOverride('_method'));

app.use('/', home);
app.use('/comments', comments);
app.use('/admin', admin);
app.use('/admin/posts', posts);
app.use('/admin/generate', generate);
app.use('/admin/categories', categories);
app.use('/admin/comments', adminComments);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

