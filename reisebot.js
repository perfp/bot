var builder = require('botbuilder');
var http = require('http');
var ruterclient = require('./ruterclient');
var dateformat = require('dateformat');
var realtimeFrom = require('./intents/realtime-from');
var ensureHome = require('./intents/travel-home');

module.exports = function (connector) {

    var bot = new builder.UniversalBot(connector);

    var intents = new builder.IntentDialog();

    intents.matches(/fra(.*)/, function(session, args){        
        session.send('Fra: '  + args.matched[1]);
    });
    
    intents.matches(/fra(.*)til(.*)/, function(session, args){        
        session.send('Fra: '  + args.matched[1] + ' - Til: ' + args.matched[2]);
    });
    
    intents.matches(/hjem/, '/travel-home')
    intents.matches(/fra\s(.+)/, '/realtime-from');

    bot.dialog ('/', intents);
    realtimeFrom.configure(bot);
    ensureHome.configure(bot, builder);
    

}