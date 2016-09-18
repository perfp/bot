var reisebot = require('./reisebot');
var builder = require('botbuilder');
var connector = new builder.ConsoleConnector().listen();

var reisebot = reisebot(connector);