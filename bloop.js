var express = require('express');
var app = express();

app.get('/', function(req, res) {
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
    res.send('Hello World');
});

app.get('/json', function(req, res) {
    res.json({foo: 23, bar: "this is bar", baz: [1, 2, 3]});
});

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
