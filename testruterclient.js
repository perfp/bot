
var ruterclient = require('./ruterclient');

var result = ruterclient.findPlace('Tøyen', function(result){
    console.log("Result: %s", result.length);

    result.forEach(function(item){
        console.log('Name: ' + item.name);
    });
});
