
var ruterclient = require('../ruterclient');
var builder = require('botbuilder');
var dateformat = require('dateformat');

module.exports = {
    configure: function(bot){
        bot.dialog('/realtime-from', [                            
                        function (session, args, next){
                            var travelFrom = args.travelFrom;
                            ruterclient.findPlace(travelFrom).then(function(result){
                                var stops =  result.reduce(function(list,item){
                                    list[item.number] = { name: item.name, id: item.id};
                                    return list;
                                }, {});
                                session.dialogData.stops = stops;

                                var response = '';
                                for (var stop in stops){
                                    response += stop + ": " + stops[stop].name + ", \n\n";
                                }
                                session.send('Jeg fant følgende: \n\n%s', response);
                                next();                        
                            });
                        },
                        function (session){
                            builder.Prompts.text(session, "Velg et stoppested ved å skrive inn nummeret foran navnet.")
                        },
                        function (session, results, next){                        
                            var stop = session.dialogData.stops[results.response];
                            ruterclient.getDepartures(stop.id, function(departures){
                                var response = 'Dette er de neste avgangene fra ' + stop.name + ':\n\n';
                                departures.forEach(function(d){    
                                    response += dateformat(d.departureTime, 'HH:MM') + ': ' + d.line + '-' + d.destination + '\n\n';
                                });

                                session.send(response);
                                next();
                            })          
                        },]
        );
    }
};