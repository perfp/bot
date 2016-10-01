var builder = require('botbuilder');
var http = require('http');
var ruterclient = require('./ruterclient');
var dateformat = require('dateformat');

module.exports = function (connector) {

    var bot = new builder.UniversalBot(connector);

    bot.dialog('/', [function (session){
                        builder.Prompts.text(session, 'Hei. Hvor vil du reise fra?');
                    }, 
                    function (session, results, next){
                        ruterclient.findPlace(results.response, function(result){
                            var stops =  result.reduce(function(list,item){
                                list[item.number] = { name: item.name, id: item.id};
                                return list;
                            }, {});
                            session.dialogData.stops = stops;

                            var response = '';
                            for (var stop in stops){
                                response += stop + ": " + stops[stop].name + ", \r\n";
                            }
                            session.send('Jeg fant følgende: %s', response);
                            next();                        
                        });
                    },
                    function (session){
                        builder.Prompts.text(session, "Velg et stoppested ved å skrive inn nummeret foran navnet.")
                    },
                    function (session, results, next){                        
                        var stop = session.dialogData.stops[results.response];
                        //session.send('Du har valgt følgende: %s : %s', results.response, stop.name);          
                        ruterclient.getDepartures(stop.id, function(departures){
                            var response = 'Dette er de neste avgangene fra ' + stop.name + ':\r\n';
                            departures.forEach(function(d){    
                                response += dateformat(d.departureTime, 'HH:MM') + ': ' + d.line + '-' + d.destination + '\r\n';
                            });

                            session.send(response);
                            next();
                        })          
                    },]
    );

}