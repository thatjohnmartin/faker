var express = require('express');
var app = express();

app.get('/', function(req, res) {
    // Returns a list of all active routes.
    var routes = [];
    for(var verb in app.routes) {
        app.routes[verb].forEach(function(route) {
            var doc = route.callbacks[route.callbacks.length-1].toString().split('\n').filter(function(str) {
                var doc = str.match(/(?:\s\/\/)(.*)/);
                if(doc == null) return false;
                return true;
            }).map(function(doc) {
                return doc.match(/(?:\s\/\/)(.*)/)[1];
            }).join('\n');
            routes.push({method: verb, path: route.path, keys: route.keys, doc: doc});
        });
    }
    res.json(routes);
});

app.get('/hello', function(req, res) {
    // A little bit of text.
    res.send('Hello, world.');
});

app.get('/json', function(req, res) {
    // A little bit of JSON.
    res.json({foo: 23, bar: "this is bar", baz: [1, 2, 3]});
});

app.get('/ydsp/insertion_orders', function(req, res) {
    // Returns YDSP-like insertion order records.
    console.log('Getting insertion orders.');
    res.json({insertion_orders: [
        {id: 0, name: "Hoefler & Co", advertiser: "Typography"},
        {id: 1, name: "Toyota Fall Campaign", advertiser: "Toyota"},
        {id: 2, name: "Microsoft Return to Office", advertiser: "Microsoft"},
        {id: 3, name: "Framily Plans", advertiser: "AT&T"},
        {id: 4, name: "Like a Tiger", advertiser: "Orange Mobile"}
    ]});
});

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
