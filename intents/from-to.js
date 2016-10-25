var ruterclient = require('../ruterclient');
var builder = require('botbuilder');
var dateformat = require('dateformat');

module.exports = {
    configure: function(bot){
        bot.dialog('/from-to', [
            function (session, args, next){
                session.dialogData = args;
                session.send("Finner reise fra %s til %s", session.dialogData.travelFrom, session.dialogData.travelTo);
                next();                                            
            },
            function(session){
                session.beginDialog('/findPlace', session.dialogData.travelFrom);
            }, 
            function(session, args){
                session.dialogData.travelFromStop = args.response;
                session.beginDialog('/findPlace', session.dialogData.travelTo);
            },
            function(session, args, next){
                session.dialogData.travelToStop = args.response;
                ruterclient.findTrip(session.dialogData.travelFromStop.id, session.dialogData.travelToStop.id)
                    .then(function(departures){
                            var response = 'Dette er de neste avgangene :\n\n';
                            var n = 1;
                            departures.forEach(function(d){    
                                
                                d.itinerary.forEach(function(i){
                                    response += dateformat(i.departureTime, 'HH:MM') + ': ' + i.type;
                                    if (i.line){
                                        response += ': ' + i.line + ' ' + i.travelFrom + '-' + i.travelTo
                                    }
                                    response += ' => ' ;
                                });
                                response += 'Ankomst ' + dateformat(d.arrivalTime, 'HH:MM') +  '\n\n';
                            });
                    
                    session.send(response);
                    next();                
                });
            }
            
        ]);
    }
}