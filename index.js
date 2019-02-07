const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const home = require('./routes/home/main');
const admin = require('./routes/admin/main');
const app = express();
const port = process.env.PORT || 9999;

app.engine('handlebars', exphbs({defaultLayout: 'home'}));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', home);
app.use('/admin', admin);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

