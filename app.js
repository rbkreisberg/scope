/**
 * Module dependencies.
 */

var express = require('express');
var pg = require('pg');

var app = express();

// Configuration

app.enable('trust proxy');
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(__dirname + '../source/dist/'));

app.configure('development', function() {
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});

// Routes
app.get('/', function(req, res) {
  res.render('index', {});
});

app.get('/variants', function(req, res) {
  RetrieveVariants(req.body, res);
});

var connString = require('./database.json').connectString;

// RetrieveVariants

function RetrieveVariants(bounds, res) {

  pg.connect(connString, function(err, client) {

    var sql = 'SELECT label, chr, start, stop, test, score, info from variant_tests_090913 order by score asc limit 300';

    client.query(sql, function(err, result) {

      console.log('Rows: ' + result.rows.length);
      var featureCollection = new FeatureCollection();

      for (i = 0; i < result.rows.length; i++) {
        console.log(result.rows[i]);
        featureCollection.features[i] = result.rows[i];
      }

      res.send(featureCollection);
    });
  });
}

// GeoJSON Feature Collection

function FeatureCollection() {
  this.type = 'variants';
  this.features = new Array();
}

var server = app.listen(3000);
console.log("Express server listening on port %d in %s mode", server.address().port, app.settings.env);