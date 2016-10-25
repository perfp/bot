var ruterclient = require("../ruterclient");
var dateformat = require('dateformat');

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
            session.beginDialog('/findPlace', args.response);        
        },
        function (session, results, next){                        
            var stop = results.response;
            session.send('Finner reise fra: %s til: %s',  stop.name, session.userData.home.name);          
            ruterclient.findTrip(stop.id, session.userData.home.id).then(function(departures){
                var response = 'Dette er de neste avgangene fra ' + stop.name + ':\n\n';
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
            

        }]);

        bot.dialog('/profile', [
            function(session, args, next){
                builder.Prompts.text(session, "Hvor bor du?");                
            }, 
            function(session, args, next){
                session.beginDialog('/findPlace', args.response);
            },
            function(session, args, next){
                console.log('Home: ' + args.response);
                session.userData.home = args.response;
                next();
            }
            
        ]);

    }
}
 