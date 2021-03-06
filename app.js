var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var swig = require('swig');
var _ = require('underscore');
var app = express();

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'static')));
app.use(bodyParser.json());

// simple logger
app.use(function(req, res, next){
  console.log('%s %s', req.method, req.url);
  next();
});

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
  {id: 10, name: "Nike World Cup Phase 2 2014 - US", advertiser: "Nike", status: 'active', percentGoal: 0.31}
];

var lineItems = [
  {id: 100, name: "Male, 25-34 UK", status: 'active', percentGoal: 0.82},
  {id: 101, name: "Male, 35-54 UK", status: 'active', percentGoal: 0.52},
  {id: 102, name: "Male, US + Canada", status: 'active', percentGoal: 0.07},
  {id: 103, name: "Female, UK", status: 'active', percentGoal: 0.96}
];

app.get('/ydsp/insertionorders', function(req, res) {
  // Returns YDSP-like insertion order records.
  res.json({status: 'ok', insertionOrders: insertionOrders});
});

app.get('/ydsp/insertionorders/:id', function(req, res) {
  // Returns a single YDSP-like insertion order.
  res.json({status: 'ok', insertionOrder: _.find(insertionOrders, function(i) { return i.id == parseInt(req.params.id); })});
});

app.get('/ydsp/insertionorders/:id/lineitems', function(req, res) {
  // Returns a list of line item records for the given insertion order.
  res.json({status: 'ok', lineItems: lineItems});
});

//
// Methods for a fake Threadstore
//

var threadpressCollections = [
  {id: 1001, name: "threadpress.thatjohnmartin", title: "That John Martin"},
  {id: 1002, name: "threadpress.climbingnerd", title: "Climbing Nerd"},
  {id: 1003, name: "threadpress.countingoldphotons", title: "Counting Old Photons"},
  {id: 1004, name: "threadpress.thedish", title: "The Dish"},
];

var postBody1 = "Photo booth vinyl post-ironic stumptown. Vinyl lo-fi kogi ethical 8-bit +1. Cosby sweater put a bird on it Brooklyn \
food truck shabby chic.\n\
> Mustache banjo bitters, hoodie crucifix synth Godard post-ironic McSweeney's occupy Bushwick cardigan selvage small batch. \n\
\n\
Forage Banksy readymade blog trust fund deep v. Disrupt XOXO DIY beard forage, meggings gluten-free hella Cosby sweater \
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
typewriter McSweeney's Godard tofu. Normcore XOXO cred pour-over Echo Park, High Life chia ethnic keffiyeh kogi tofu brunch.\n\
\n\
![On the approach](https://farm4.staticflickr.com/3821/8797578824_1d875da666.jpg)\n\
\n\
Tousled distillery meh, pop-up tote bag fingerstache hoodie. Gluten-free Etsy yr, twee locavore photo booth raw denim deep v \
polaroid drinking vinegar 90's chillwave cray literally leggings. Gastropub Banksy American Apparel pour-over blog chia. Small \
batch gastropub four loko yr forage cray pork belly."

var postBody4 = "Kickstarter project for a terrific documentary feature film, from directors Jake Schumacher and Jedidiah Hurt:\n\
\n\
> App creation has become the new art form for our generation. This is the story of the cultural phenomenon that \n\
> touches all our lives. \n\
\n\
I sat for an interview with them while I was in San Francisco for WWDC last month, but I’m not promoting their Kickstarter\n\
because I’m in the cast. I sat for the interview because Jake and Jed are making a great movie, and I’m promoting their Kickstarter\n\
because I want this to be a huge success for them.\n\
\n\
If you have any interest in apps as an art form and a new mass market medium of pop culture, you should back this film. I think\n\
it’s going to be great."

var firstPagePosts = [
  {id: 2001, title: 'Climbing Avalanche Gulch on Shasta', tags: ['climbing', 'alpine', 'california', 'threadpress.post_status:published'],
    created: '2014-06-20', markup: postBody1},
  {id: 2002, title: 'Swift, a new language from Apple', tags: ['tech', 'languages', 'swift', 'threadpress.post_status:published'],
    created: '2014-06-19', markup: postBody2},
  {id: 2002, title: 'App: The Human Story', tags: ['tech', 'languages', 'swift', 'threadpress.post_status:published'],
    created: '2014-06-19', markup: postBody4},
  {id: 2003, title: 'Red Rocks, NV', tags: ['climbing', 'sport-climbing', 'nevada', 'threadpress.post_status:published'],
    created: '2014-06-16', markup: postBody3},
  {id: 2004, title: 'New 12a in Pinnacles', tags: ['climbing', 'sport-climbing', 'california', 'threadpress.post_status:published'],
    created: '2014-06-11', markup: postBody1},
  {id: 2005, title: 'Apple announces CloudKit', tags: ['tech', 'threadpress.post_status:published'],
    created: '2014-06-03', markup: postBody2},
];

var nextPostId = 3000;

var collectionRoot = 'threadpress.';

app.get('/collection/name/:name', function(req, res) {
  // Get a collection.
  var collection = null;
  if (req.params.name.substr(0, collectionRoot.length) == collectionRoot) {
    collection = _.find(threadpressCollections, function(c) { return c.name == req.params.name; });
  }
  if (collection == null) {
    res.json({status: 'error', message: 'Not found'});
  }
  else {
    res.json({status: 'ok', collection: collection});
  }
});

app.post('/collection/search', function(req, res) {
  // Search for a collection.
  var collections = [];
  var query = req.param('query');
  if (query) {
    if (query._name && query._name['$regex'] && query._name['$regex'] == '^threadpress\..*') {
      collections = threadpressCollections;
    }
  }
  res.json({status: 'ok', collections: collections});
});

app.post('/post/search', function(req, res) {
  // Get a thread.
  var thread = {'posts': firstPagePosts};
  res.json({status: 'ok', thread: thread});
});

app.put('/post/collection/:name/type/:type/', function(req, res) {
  // Add a new post.
  firstPagePosts.unshift({
    id: nextPostId++,
    title: req.body.title,
    markup: req.body.markup,
    tags: req.body.tags,
    created: '2014-07-07'
  });
  res.json({status: 'ok'});
});

var port = Number(process.env.PORT || 5000);
var server = app.listen(port, function() {
  console.log('Listening on port %d', server.address().port);
});
