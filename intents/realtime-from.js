
module.exports = {
    configure: function(bot){
        bot.dialog('/realtime-from', [function (session, args, next){
                            console.log('args: ' + JSON.stringify(args));
                            session.dialogData.travelFrom = args.matched[1];   
                            console.log(session.dialogData.travelFrom);
                            next();
                        }, 
                        function (session, results, next){

                            var from = session.dialogData.travelFrom;
                            ruterclient.findPlace(travelFrom, function(result){
                                var stops =  result.reduce(function(list,item){
                                    list[item.number] = { name: item.name, id: item.id};
                                    return list;
                                }, {});
                                session.dialogData.stops = stops;

                                var response = '';
                                for (var stop in stops){
                                    response += stop + ": " + stops[stop].name + ", \n\n";
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