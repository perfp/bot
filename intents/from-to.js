module.exports = {
    configure: function(bot){
        bot.dialog('/from-to', [
            function (session, args, next){
                session.dialogData = args;
                session.send("Finner reise fra %s til %s", session.dialogData.travelFrom, session.dialogData.travelTo);                            
                next();
        }]);
    }
}