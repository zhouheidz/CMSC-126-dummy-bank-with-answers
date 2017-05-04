const express = require('express');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const consolidate = require('consolidate');

const app = express();

app.engine('html', consolidate.nunjucks);
app.set('views', './views');

app.use(bodyparser.urlencoded());
app.use(cookieparser());

app.use('/static', express.static('./static'));

app.get('/', function(req, res) {
	res.render('index.html');
});

app.listen(3000, function() {
	console.log('Server is now running at port 3000');
});
