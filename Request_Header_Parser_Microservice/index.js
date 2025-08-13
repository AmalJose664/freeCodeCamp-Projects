
require('dotenv').config();
var express = require('express');
var app = express();

var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 })); 

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/api/whoami', function (req, res) {
  
   let ipAddr = req.headers['x-forwarded-for']
   let language = req.headers['accept-language']
   let software = req.headers['user-agent']
   console.log(req.headers, "===\n",ipAddr, language, software)
   
   console.log(Math.random()*1000)
  res.json({ ipaddress: ipAddr, language, software });

   
});


app.get('/api/hello', function (req, res) {
   
  res.json({ greeting: 'hello API' });
;
});


var listener = app.listen(process.env.PORT || 3000, function () {
console.log('Your app is listening on port ' + listener.address().port);
});
