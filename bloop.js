var express = require('express');
var path = require('path');
var swig = require('swig');
var app = express();

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'static')));

app.get('/', function(req, res) {
  // Returns a list of all active routes.
  var routes = [];
  for (var layer in app._router.stack) {
    if (app._router.stack[layer].route) {
      var route = app._router.stack[layer].route;
      for (var method in route.methods) {
        routes.push({method: method, path: route.path})
      }
    }
  }
  res.render('index', {routes: routes});
});

app.get('/hello', function(req, res) {
  // A little bit of text.
  res.send('Hello, world.');
});

app.get('/json', function(req, res) {
  // A little bit of JSON.
  res.json({foo: 23, bar: "this is bar", baz: [1, 2, 3]});
});

//
// Methods for a fake YDSP Mobile backend
//

app.get('/ydsp/login', function(req, res) {
  // Simple login method.
  console.log('Attemping YDSP login.');
  if (req.query.username == 'jmartin') {
    res.json({status: 'ok', message: 'Signed in user ' + req.query.username});
  }
  else {
    res.json({status: 'error', message: 'Unknown username or password'});
  }
});

var insertionOrders = [
  {id: 0, name: "A Summer of Movies", advertiser: "Netflix", status: 'active', percentGoal: 0.82},
  {id: 1, name: "Toyota EV Future March", advertiser: "Toyota", status: 'active', percentGoal: 0.73},
  {id: 2, name: "Return to Microsoft Office 2014", advertiser: "Microsoft", status: 'active', percentGoal: 0.05},
  {id: 3, name: "Frends & Family Plans Kevin Durant", advertiser: "Verizon", status: 'active', percentGoal: 0.21},
  {id: 4, name: "Pantene Pro V Summer Promo", advertiser: "Proctor & Gamble", status: 'active', percentGoal: 0.67},
  {id: 5, name: "Netflix Dusk to dawn - Norway", advertiser: "Netflix", status: 'active', percentGoal: 0.63},
  {id: 6, name: "MS Xbox KRS", advertiser: "Microsoft", status: 'active', percentGoal: 0.69},
  {id: 7, name: "MS Xbox One California Release", advertiser: "Microsoft", status: 'active', percentGoal: 0.99},
  {id: 8, name: "Nike World Cup Phase 2 2014 - UK", advertiser: "Nike", status: 'active', percentGoal: 0.23},
  {id: 9, name: "Nike World Cup Phase 2 2014 - Asia", advertiser: "Nike", status: 'active', percentGoal: 0.33},
  {id: 9, name: "Nike World Cup Phase 2 2014 - US", advertiser: "Nike", status: 'active', percentGoal: 0.31}
];

app.get('/ydsp/insertion_orders', function(req, res) {
  // Returns YDSP-like insertion order records.
  console.log('Getting insertion orders.');
  res.json({status: 'ok', insertionOrders: insertionOrders});
});

//
// Methods for a fake Threadstore
//

app.get('/collection', function(req, res) {
  // Collection get/search.
  
  var collections = [];
  
  if (req.query.handle == 'threadpress.*') {
    collections = [
      {handle: "threadpress.thatjohnmartin", title: "That John Martin"},
      {handle: "threadpress.climbingnerd", title: "Climbing Nerd"}
    ];
  }
  
  res.json({status: 'ok', collections: collections});
});

var port = Number(process.env.PORT || 5000);
var server = app.listen(port, function() {
  console.log('Listening on port %d', server.address().port);
});
