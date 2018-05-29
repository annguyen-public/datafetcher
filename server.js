var express = require('express');
var app = express();
const db_name = 'nine_db';
var http = require('http');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://nineuser:123@ds133550.mlab.com:33550/" + db_name;

function getCollectionNewest(collection, skip) {
  return new Promise(function(resolve, reject) {
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db(db_name);
      var mysort = { timestamp: -1 };
      dbo.collection(collection).find().limit(6).skip(skip).sort(mysort).toArray(function(err, result) {
        if (err)
          reject(err);
        else
          resolve(result);
        db.close();
      });
    });
  }); 
}

app.get('/getNewest/:collection/:skip', function (req, res) {
  getCollectionNewest(req.params.collection, parseInt(req.params.skip)).then(function(result) {
      res.end(JSON.stringify(result));
  }, function(err) {
      console.log(err);
  });	
});

var myInt = setInterval(function () {
  var http = require('http');
  var options = {
    host: 'https://ninegagcraper.herokuapp.com',
    port: 80,
    path: '/'
  };

  http.get(options, function(res) {
    console.log("Got response: " + res.statusCode);

    res.on("data", function(chunk) {
      console.log("BODY: " + chunk);
    });
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
}, 1000);


var port = process.env.PORT || 3000;

var server = app.listen(port, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
