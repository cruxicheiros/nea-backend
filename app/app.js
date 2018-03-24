const express = require('express');
const exphbs  = require('express-handlebars');


let app = express();
let rest_api = require('./api');
let main_site = require('./site');

app.use('/api', rest_api);
app.use('/', main_site);


app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.listen(8080);