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
    },

    getDepartures: function(place, callback){
        options.path = "/StopVisit/GetDepartures/" + place;
        //?datetime={datetime}&transporttypes={transporttypes}&linenames={linenames}
        var response = "";
        var result = [];

        http.get(options, function(res){
            res.on('data', function (chunk){
                response += chunk;
            })
            res.on('end', function(){
                result = JSON.parse(response);
                var departures = result.slice(0,8).map(function(item){
                    return {
                        'line': item.MonitoredVehicleJourney.LineRef,
                        'destination': item.MonitoredVehicleJourney.MonitoredCall.DestinationDisplay,
                        'departureTime': roundToMinute(new Date(item.MonitoredVehicleJourney.MonitoredCall.ExpectedDepartureTime)),
                        'platform': item.MonitoredVehicleJourney.MonitoredCall.DeparturePlatformName
                    }
                });
                callback(departures);
            });
        });
        
    }
}

function roundToMinute(date){
    var timeUnit = 1000 * 60; // 1 minutt
    return new Date(Math.round(date.getTime() / timeUnit) * timeUnit);    
}