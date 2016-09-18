var http  = require('http');
var utf8 = require('utf8');

var options = {
        host: 'reisapi.ruter.no',
    };

module.exports = {
    findPlace: function (name, callback) {
        options.path = "/Place/GetPlaces?id=" + utf8.encode(name);
        var response = "";
        var result = [];
        http.get(options, function (res) {
            console.log('Got response %s', res.statusCode);

            res.on('data', function (chunk)  {
                response += chunk;
            });
            res.on('end', function ()  {
                result = JSON.parse(response);
                var i = 1;
                stops = result.map(function(value){
                    return {
                        number: i++,
                        name: value.Name,
                        id: value.ID
                    };
                });
                callback(stops);
            });
        });
    }
}