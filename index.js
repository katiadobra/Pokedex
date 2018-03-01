var express = require('express');
var app = express();

app.use(express.static('./client'));

app.get('*',function (req,res) {
  res.sendFile('./index.html');
});

var PORT = process.env.PORT || 5000;

app.listen(PORT);
