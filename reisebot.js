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
    intents.matches(/throw/, function(session, args, next){
        const i = 1;
        i = 2;
        next();
    });
    intents.matches(/reset/, function(session, args, next){
        session.userData = {};
        session.dialogData = {};
        session.send("Session data cleared.");
        next();
    });

    intents.matches(/hei/, function(session,args, next){
        session.send("Hei. Hva kan jeg hjelpe deg med?");
    });



    bot.dialog ('/', intents);
    realtimeFrom.configure(bot);
    ensureHome.configure(bot, builder);
    travelFromTo.configure(bot, builder);
    
    

}