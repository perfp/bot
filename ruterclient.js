var http  = require('http');
var utf8 = require('utf8');

class RuterClient {
    constructor(){
        this.options = { host: 'reisapi.ruter.no' };
    }

    findPlace (name, callback) {
        this.options.path = "/Place/GetPlaces?id=" + utf8.encode(name);
        var response = "";
        var result = [];
        http.get(this.options, function (res) {
            console.log('Got response %s', res.statusCode);

            res.on('data', function (chunk)  {
                response += chunk;
            });
            res.on('end', function ()  {
                result = JSON.parse(response);
                var i = 1;
                let stops = result.map(function(value){
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

    getDepartures (place, callback){
        this.options.path = "/StopVisit/GetDepartures/" + place;
        //?datetime={datetime}&transporttypes={transporttypes}&linenames={linenames}
        var response = "";
        var result = [];

        http.get(this.options, function(res){
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

    findTrip (travelFrom, travelTo, callback){
        this.options.path = "/Travel/GetTravels?fromPlace=" + travelFrom + "&toPlace=" + travelTo + "&isafter=true";

        var response = "";
        var result = [];

        http.get(this.options, function(res){
            res.on('data', function (chunk){
                response += chunk;
            })
            res.on('end', function(){
                result = JSON.parse(response);
                var departures = result.TravelProposals.slice(0,8).map(function(item){
                    var travel = {
                            'departureTime': createDateWithLocalTimeZone(item.DepartureTime),
                            'arrivalTime': createDateWithLocalTimeZone(item.ArrivalTime),
                            'itinerary':  []
                    };
                    item.Stages.forEach(function(element) {
                        this.itinerary.push({
                            'line': element.LineName,
                            'departureTime': createDateWithLocalTimeZone( element.DepartureTime),
                            'travelFrom': element.DepartureStop.Name,
                            'travelTo': element.ArrivalStop.Name,
                            'travelTime': element.TravelTime
                        });
                    }, travel);

                    return travel;                    
                });

                callback(departures);
            });
        });
    }

    createDateWithLocalTimeZone(datestring){
        var date = new Date(datestring);
        date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
        return roundToMinute(date);
    }
    
    roundToMinute(date){
        var timeUnit = 1000 * 60; // 1 minutt
        return new Date(Math.round(date.getTime() / timeUnit) * timeUnit);    
    }
}

module.exports = new RuterClient();