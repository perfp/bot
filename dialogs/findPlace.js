var ruterclient = require('../ruterclient');

module.exports = {
        register: function(bot, builder){
            bot.dialog('/findPlace', [
                function(session, args, next){
                    console.log(`FindPlace: ${args}`);
                    ruterclient.findPlace(args).then(function(result){
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
                    session.endDialogWithResult({'response': stop});                                  
                }
            ]);
    }
}