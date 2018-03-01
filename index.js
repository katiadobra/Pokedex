var express = require('express');
var app = express();

app.use(express.static('./client'));

app.get('*',function (req,res) {
  res.sendFile('./index.html');
});

app.listen(5000);
