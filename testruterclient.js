
var ruterclient = require('./ruterclient');

if (process.argv.length <= 2)
{   
    console.log('findPlace or stopvisit or fromTo');
}

if (process.argv[2] == 'findPlace'){
    var result = ruterclient.findPlace(process.argv[3] || 'Tøyen').then(function(result){
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

if (process.argv[2] == 'fromTo'){
    var resutl = ruterclient.findTrip(process.argv[3] || '3010200', process.argv[4] || '3010600').then(function(result){
         result.forEach(function(item){
            console.log(JSON.stringify(item));
        });
    });
}   
