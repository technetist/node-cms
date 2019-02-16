const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const upload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');

const {select, generateTime} = require('./helpers/handlebars-helpers');

const home = require('./routes/home/main');
const admin = require('./routes/admin/main');
const posts = require('./routes/admin/posts');
const generate = require('./routes/admin/generate');

const app = express();
const port = process.env.PORT || 9999;

mongoose.connect('mongodb://localhost:27017/cms', {useNewUrlParser: true}).then((db)=>{
  console.log('mongo connected');
}).catch(error=>console.log(error));

app.engine('handlebars', exphbs({defaultLayout: 'home', helpers: {select: select, generateTime: generateTime}}));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));

app.use(upload());

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(methodOverride('_method'));

app.use(session({
  secret: 'AdrienCodes2412',
  resave: true,
  saveUninitialized:true
}));

app.use(flash());

app.use((req, res, next)=>{
  res.locals.success_message = req.flash('success_message');
  next();
});

app.use('/', home);
app.use('/admin', admin);
app.use('/admin/posts', posts);
app.use('/admin/generate', generate);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

