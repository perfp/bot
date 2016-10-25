var builder = require('botbuilder');
var http = require('http');
var ruterclient = require('./ruterclient');
var dateformat = require('dateformat');
var realtimeFrom = require('./intents/realtime-from');
var ensureHome = require('./intents/travel-home');
var travelFromTo = require('./intents/from-to');
var findPlaceDialog = require('./dialogs/findPlace');


module.exports = function (connector) {

    var bot = new builder.UniversalBot(connector);

    var intents = new builder.IntentDialog();
    
    /////////////////////////////////////////////
    // Finn reise fra - til 
    /////////////////////////////////////////////
    intents.matches(/fra\s+(.*)\s+til\s+(.*)\s*/, function(session, args){        
        session.dialogData.travelFrom = args.matched[1];
        session.dialogData.travelTo = args.matched[2];
        session.beginDialog('/from-to', session.dialogData);
    });

    /////////////////////////////////////////////
    // Finn avganger fra
    /////////////////////////////////////////////
    intents.matches(/fra\s+(.*)/, function(session, args){ 
        session.beginDialog('/realtime-from', {travelFrom: args.matched[1]})
    });
    
    /////////////////////////////////////////////
    // Finn reise hjem
    /////////////////////////////////////////////
    intents.matches(/hjem/, '/travel-home');

    /////////////////////////////////////////////
    // Hilse pent
    /////////////////////////////////////////////
    intents.matches(/hei|hallo|heisann|god dag/, function(session,args, next){
        session.send("Hei. Hva kan jeg hjelpe deg med?");
    });

    /////////////////////////////////////////////
    // Infrastruktur og hjelpefunksjoner
    /////////////////////////////////////////////
    intents.matches(/nodeversion/, function(session, args, next){        
        session.send(`Node version: ${process.version}`);
        next();
    });

    intents.matches(/throw/, function(session, args, next){
        console.log(`Forcing exception: ${session.message.text}`);
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

    bot.dialog ('/', intents);

    realtimeFrom.configure(bot, builder);
    ensureHome.configure(bot, builder);
    travelFromTo.configure(bot, builder);

    findPlaceDialog.register(bot, builder);
}