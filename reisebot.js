var builder = require('botbuilder');
var http = require('http');
var ruterclient = require('./ruterclient');

module.exports = function (connector) {

    var bot = new builder.UniversalBot(connector);

    bot.dialog('/', [function (session){
                        builder.Prompts.text(session, 'Hei. Hvor vil du reise fra?');
                    }, 
                    function (session, results){
                        var stops = ruterclient.findPlace(results.response, function(result){
                            session.send('Jeg fant følgende: %s', result.map(function(item){ return item.number + ': ' + item.name; }).join(', '));
                        });
                        

                    }]
    );

}