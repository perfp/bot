var restify = require('restify');
var builder = require('botbuilder');

// Setup server 
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log("%s listening to %s", server.name, server.url);
})

// Create bot 
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

server.post('/', function(req, res, next){
    res.send("Bot running");
    next();
});


server.get('/', function(req, res, next){
    res.send("Bot running");
    next();
});

bot.dialog('/', function(session){
    session.send('Hello. world');
});

