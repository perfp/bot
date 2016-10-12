var ruterclient = require("../ruterclient");

module.exports = {
    configure: function(bot, builder){
        bot.dialog('/travel-home', [function (session, args, next){
            if (!session.userData.home){                         
                session.beginDialog('/profile');
            } else {
                next();
            }
        }, 
        function (session, args, next){
            session.send("Finner reise til " + session.userData.home.name);
            next();
        },
        function (session, args, next){
            builder.Prompts.text(session, "Hvor er du nå?");
        },
        function(session, args, next){
                ruterclient.findPlace(args.response, function(result){
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
                builder.Prompts.text(session, "Velg nærmeste stoppested ved å skrive inn nummeret foran navnet.")
            },
            function (session, results, next){                        
                var stop = session.dialogData.stops[results.response];
                session.send('Finner reise fra: %s til: %s',  stop.name, session.userData.home.name);          
                // ruterclient.getDepartures(stop.id, function(departures){
                //     var response = 'Dette er de neste avgangene fra ' + stop.name + ':\n\n';
                //     departures.forEach(function(d){    
                //         response += dateformat(d.departureTime, 'HH:MM') + ': ' + d.line + '-' + d.destination + '\n\n';
                //     });

                //     session.send(response);
                //     next();
                // })          
            }]);

        bot.dialog('/profile', [
            function(session, args, next){
                console.log("profile");
                builder.Prompts.text(session, "Hvor bor du?");
                
            }, 
            function(session, args, next){
                ruterclient.findPlace(args.response, function(result){
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
                builder.Prompts.text(session, "Velg nærmeste stoppested ved å skrive inn nummeret foran navnet.")
            },
            function (session, results, next){                        
                var stop = session.dialogData.stops[results.response];
                session.send('Du har valgt følgende: %s : %s', results.response, stop.name);
                session.userData.home = stop;
                session.endDialog();                                  
            }
        ]);
    }
}
 