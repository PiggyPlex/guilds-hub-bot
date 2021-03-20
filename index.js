const dotenv = require('dotenv'),
			config = require('./resources/config.js'),
			{ CommandoClient } = require('discord.js-commando'),
			client = new CommandoClient({
				commandPrefix: config.prefix,
				owner: config.owner,
				invite: config.discord,
			});

// Init .env
dotenv.config();

// Bind config to client
client.config = config;

// Init bot
require('./bot.js')(client);

// Login
client.login(process.env.TOKEN);