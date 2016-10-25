'use strict';
var http  = require('http');
var utf8 = require('utf8');
var moment = require('moment');

class RuterClient {
    constructor(){
        this.options = { host: 'reisapi.ruter.no' };   
    }
  
    findPlace (name) {
        let parent = this; 
        this.options.path = "/Place/GetPlaces?id=" + utf8.encode(name).replace(/\s/g, '+');
        console.log(this.options.path);
        
        return new Promise(function(resolve, reject){
            getHttp(parent.options).then(function (response)  {
                let result = JSON.parse(response);
                // console.log(result);
                var i = 1;
                let stops = result
                    .slice(0,5)
                    .map(function(value) {
                    return {
                        number: i++,
                        name: value.Name,
                        id: value.ID
                    };
                });
                resolve(stops);
            });
        });
    }

    getDepartures (place, callback){
        let parent = this;
        this.options.path = "/StopVisit/GetDepartures/" + place;
        console.log(this.options.path);
        //?datetime={datetime}&transporttypes={transporttypes}&linenames={linenames}
        var response = "";
        var result = [];

       getHttp(this.options).then(function(response){
            result = JSON.parse(response);
            var departures = result.slice(0,3).map(function(item){
                return {
                    'line': item.MonitoredVehicleJourney.LineRef,
                    'destination': item.MonitoredVehicleJourney.MonitoredCall.DestinationDisplay,
                    'departureTime': roundToMinute(new Date(item.MonitoredVehicleJourney.MonitoredCall.ExpectedDepartureTime)),
                    'platform': item.MonitoredVehicleJourney.MonitoredCall.DeparturePlatformName
                }
            });
            callback(departures);
        });
    }

    findTrip (travelFrom, travelTo, callback){
        let parent = this;
        this.options.path = "/Travel/GetTravels?fromPlace=" + travelFrom + "&toPlace=" + travelTo + "&isafter=true";

        return new Promise(function(resolve, reject){            
            var result = [];
            getHttp(parent.options).then(function(response){
                result = JSON.parse(response);
                
                var departures = result.TravelProposals.slice(0,8).map(function(item){
                    var travel = {
                            'departureTime': createDateWithLocalTimeZone(item.DepartureTime),
                            'arrivalTime': createDateWithLocalTimeZone(item.ArrivalTime),
                            'itinerary':  []
                    };
                    item.Stages.forEach(function(element) {
                        //console.log(element);
                        if (element.Transportation === 0){
                            // Walking
                            this.itinerary.push({
                                'type': 'Gå',
                                'departureTime': createDateWithLocalTimeZone(element.DepartureTime),
                                'travelTime': element.WalkingTime 
                            });
                        } 

                        if (element.Transportation === 8){
                            this.itinerary.push({
                                'type': 'T-bane',
                                'line': element.LineName,
                                'departureTime': createDateWithLocalTimeZone( element.DepartureTime),
                                'travelFrom': element.DepartureStop.Name,
                                'travelTo': element.ArrivalStop.Name,
                                'travelTime': element.TravelTime
                            });
                        }

                        if (element.Transportation === 6){
                            this.itinerary.push({
                                'type': 'Tog',
                                'line': element.LineName,
                                'departureTime': createDateWithLocalTimeZone( element.DepartureTime),
                                'travelFrom': element.DepartureStop.Name,
                                'travelTo': element.ArrivalStop.Name,
                                'travelTime': element.TravelTime
                            });
                        }

                        if (element.Transportation === 2){
                            this.itinerary.push({
                                'type': 'Buss',
                                'line': element.LineName,
                                'departureTime': createDateWithLocalTimeZone( element.DepartureTime),
                                'travelFrom': element.DepartureStop.Name,
                                'travelTo': element.ArrivalStop.Name,
                                'travelTime': element.TravelTime
                            });
                        }
                    }, travel);

                    return travel;                    
                });

                resolve(departures);
            });
        });
    }
}

function getHttp(options){
    let log = false;
    return new Promise(function(resolve, reject){
        http.get(options, function(res){
            if (log) console.log(`Got response ${res.statusCode}`);
            let response = "";
            res.on('data', function (chunk){
                response += chunk;
            })
            res.on('end', function(){
                if (log) console.log(`Response: ${response}`);
                resolve(response);
            });
        });
    });
}

function createDateWithLocalTimeZone(datestring){
    var date = new Date(datestring);
    date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
    return roundToMinute(date);
}

function roundToMinute(date){
    var timeUnit = 1000 * 60; // 1 minutt
    return new Date(Math.round(date.getTime() / timeUnit) * timeUnit);    
}

module.exports = new RuterClient();