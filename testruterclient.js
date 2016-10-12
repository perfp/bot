
var ruterclient = require('./ruterclient');

if (process.argv.length <= 2)
{   
    console.log('findPlace or stopvisit');
}

if (process.argv[2] == 'findPlace'){
    var result = ruterclient.findPlace('Tøyen', function(result){
        console.log("Result: %s", result.length);

        result.forEach(function(item){
            console.log('Name: ' + JSON.stringify(item));
        });
    });
}


if (process.argv[2] == 'stopVisit'){
    var resutl = ruterclient.getDepartures('3010600', function(result){
         result.forEach(function(item){
            console.log('Name: ' + JSON.stringify(item));
        });
    });
}   