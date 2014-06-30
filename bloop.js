var express = require('express');
var path = require('path');
var swig = require('swig');
var _ = require('underscore');
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

var threadpressCollections = [
  {id: 1001, handle: "threadpress.thatjohnmartin", title: "That John Martin"},
  {id: 1002, handle: "threadpress.climbingnerd", title: "Climbing Nerd"},
  {id: 1003, handle: "threadpress.countingoldphotons", title: "Counting Old Photons"},
  {id: 1004, handle: "threadpress.thedish", title: "The Dish"},
];

var postBody1 = "Photo booth vinyl post-ironic stumptown. Vinyl lo-fi kogi ethical 8-bit +1. Cosby sweater put a bird on it Brooklyn \
food truck shabby chic. Mustache banjo bitters, hoodie crucifix synth Godard post-ironic McSweeney's occupy Bushwick cardigan selvage \
small batch. Forage Banksy readymade blog trust fund deep v. Disrupt XOXO DIY beard forage, meggings gluten-free hella Cosby sweater \
literally Austin Pinterest paleo put a bird on it whatever. Tumblr banh mi occupy, food truck typewriter iPhone small batch bespoke trust \
fund Carles Marfa sriracha literally.\n\
\n\
IPhone ethical occupy art party cred. Beard selfies PBR post-ironic chillwave food truck salvia disrupt. Letterpress artisan fap viral \
Shoreditch, next level wayfarers iPhone Tonx quinoa. Letterpress you probably haven't heard of them Neutra Etsy. YOLO yr synth, squid \
cliche gluten-free irony plaid American Apparel leggings cornhole pop-up. Pork belly Austin Schlitz, disrupt deep v ethnic pickled. Roof \
party cray four loko, Pinterest swag umami selvage.\n"

var postBody2 = "Seitan et bitters retro. Laborum mumblecore accusamus, disrupt cred whatever eiusmod blog fashion axe officia. \
Adipisicing polaroid nulla salvia, street art **dreamcatcher** tempor. Seitan kitsch Cosby sweater authentic paleo nulla, Kickstarter banh mi \
bespoke blog voluptate mustache dreamcatcher Banksy next level. Viral sriracha anim, do Cosby sweater forage kale chips authentic \
try-hard cliche street art incididunt bicycle rights 90's. Brunch et flannel, aesthetic kogi drinking vinegar polaroid hashtag sustainable \
YOLO tattooed. Chillwave mlkshk viral, four loko occaecat nulla YOLO ennui ullamco velit dolor Banksy wayfarers."

var postBody3 = "Vice 8-bit try-hard, pug cardigan PBR ethical. PBR&B jean shorts irony vinyl, lo-fi umami Portland letterpress scenester \
typewriter McSweeney's Godard tofu. Normcore XOXO cred pour-over Echo Park, High Life chia ethnic keffiyeh kogi tofu brunch. Tousled \
distillery meh, pop-up tote bag fingerstache hoodie. Gluten-free Etsy yr, twee locavore photo booth raw denim deep v polaroid drinking \
vinegar 90's chillwave cray literally leggings. Gastropub Banksy American Apparel pour-over blog chia. Small batch gastropub four loko yr \
forage cray pork belly."

var firstPagePosts = [
  {id: 2001, title: 'Climbing Avalanch Gulch on Shasta', tags: ['climbing', 'alpine', 'california', 'threadpress.post_status:published'],
    created: '2014-06-20', markup: postBody1},
  {id: 2002, title: 'Swift, a new language from Apple', tags: ['tech', 'languages', 'swift', 'threadpress.post_status:published'],
    created: '2014-06-19', markup: postBody2},
  {id: 2003, title: 'Red Rocks, NV', tags: ['climbing', 'sport-climbing', 'nevada', 'threadpress.post_status:published'],
    created: '2014-06-16', markup: postBody3},
  {id: 2004, title: 'New 12a in Pinnacles', tags: ['climbing', 'sport-climbing', 'california', 'threadpress.post_status:published'],
    created: '2014-06-11', markup: postBody1},
  {id: 2005, title: 'Apple announces CloudKit', tags: ['tech', 'threadpress.post_status:published'],
    created: '2014-06-03', markup: postBody2},
];

var collectionRoot = 'threadpress.';

app.get('/collection', function(req, res) {
  // Search for a collection.
  var collections = [];
  if (req.query.handle == collectionRoot + '*') {
    collections = threadpressCollections;
  }
  res.json({status: 'ok', collections: collections});
});

app.get('/collection/handle/:handle', function(req, res) {
  // Get a collection.  
  var collection = null;
  if (req.params.handle.substr(0, collectionRoot.length) == collectionRoot) {
    collection = _.find(threadpressCollections, function(c) { return c.handle == req.params.handle; });
  }
  if (collection == null) {
    res.json({status: 'error', message: 'Not found'});
  }
  else {
    res.json({status: 'ok', collection: collection});
  }
});

app.get('/thread/collection/:handle', function(req, res) {
  // Get a thread.
  var thread = {'posts': firstPagePosts};
  res.json({status: 'ok', thread: thread});
});

var port = Number(process.env.PORT || 5000);
var server = app.listen(port, function() {
  console.log('Listening on port %d', server.address().port);
});
