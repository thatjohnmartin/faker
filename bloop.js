var express = require('express');
var app = express();

app.get('/hello', function(req, res){
    res.send('Hello World');
});

app.get('/json', function(req, res){
    res.send({foo: 23, bar: "this is bar", baz: [1, 2, 3]});
});

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
