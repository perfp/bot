var builder = require('botbuilder');
var http = require('http');
var ruterclient = require('./ruterclient');
var dateformat = require('dateformat');
var realtimeFrom = require('./intents/realtime-from');
var ensureHome = require('./intents/travel-home');
var travelFromTo = require('./intents/from-to');


module.exports = function (connector) {

    var bot = new builder.UniversalBot(connector);

    var intents = new builder.IntentDialog();

    
    intents.matches(/fra(.*)til(.*)/, function(session, args){        
        session.dialogData.travelFrom = args.matched[1];
        session.dialogData.travelTo = args.matched[2];
        session.beginDialog('/from-to', session.dialogData);
    });

    intents.matches(/fra(.*)/, function(session, args){ 
        session.dialogData.travelFrom = args.matched[1];       
        session.beginDialog('/realtime-from')
    });
    
    intents.matches(/hjem/, '/travel-home')
    intents.matches(/fra\s(.+)/, '/realtime-from');
    intents.matches(/throw/, function(){
        const i = 1;
        i = 2;
    })

    bot.dialog ('/', intents);
    realtimeFrom.configure(bot);
    ensureHome.configure(bot, builder);
    travelFromTo.configure(bot, builder);
    
    

}