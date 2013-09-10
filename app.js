/**
 * Module dependencies.
 */

var express = require('express');
var pg = require('pg');

var app = express();

// Configuration

app.enable('trust proxy');
app.set("view options", {layout: false});
app.use(express.static(__dirname + '/dist'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

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
  res.render('index.html');
});

app.get('/variants/:table/:target/:test', function(req, res) {
  RetrieveVariants(req.params, res);
});

app.get('/variants/:table/:target/:test/:model', function(req, res) {
  RetrieveVariants(req.params, res);
});

var connString = require('./database.json').connectString;

// RetrieveVariants

function RetrieveVariants(params, res) {

  var table = params.table;
  var target = params.target || "*";
  var test = params.test || "*";
  var model = params.model || "*";

  pg.connect(connString, function(err, client, done) {
    var handleError = function(err) {
      if(!err) return false;
      console.error('Error querying postgres', err);
      done(client);
      res.send(ErrorResponse(err));
      return true;
    };

    var target_where = (target === "*" ? '' : '\' and target_label = \'' + target + '\'');

    var model_where = (model === "*" ? '' : '\' and test_model = \'' + model + '\'');
    var where = ' where test_type = \'' + test + target_where + model_where;

    var sql = 'SELECT chr, start, test_type, test_model, target_label, sample, score from ' + table + 
          where +' order by score asc limit 300';

    console.log('querying: ' + sql);

    var query =  client.query(sql,  function(error, result) {
      if (handleError(error)) return;
      done();
      res.send(QueryResponse(result));
    });
  });
}

// Response Objects

function ErrorResponse(err) {
  return { status : 'error', message : err };
}

function QueryResponse(result) {
  return { status : 'success', results : result.rows };
}

var server = app.listen(3000);
console.log("Express server listening on port %d in %s mode", server.address().port, app.settings.env);