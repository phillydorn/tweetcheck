

var express = require('express');
    app = express(),
    server  = require('http').createServer(app),
    request = require ('request'),
    btoa = require('btoa'),
    bodyParser = require ('body-parser');

var token;

    app.use(express.static('./'));


app.get('/tweets', function(req, res) {


    var key = process.env.KEY_SECRET;
    var code = btoa(key);
   console.log(req.url)
   if (req.url.length>7) {
    var maxid =req.url.slice(11);
    console.log('id', maxid);
   }
   var maxIdParam = maxid ? '&max_id='+maxid : '';

  request({
    url: 'https://api.twitter.com/oauth2/token?grant_type=client_credentials',
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + code
    }
  },
  function (err, resp, body) {
    token = JSON.parse(body)['access_token'];
    request({
      url: 'https://api.twitter.com/1.1/search/tweets.json?q=%23smte2015&since:2016-09-16&count=100'+maxIdParam,
      headers: {
        'Authorization': 'Bearer ' + token
      }
    },
      function (err, resp, body) {
        res.status(200).json(body);
      });

  });

})
app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function() { console.log('Node app running on port', app.get('port')) });



exports =module.exports=app;



