const fs = require('fs'),
			path = require('path'),
			config = require('./resources/config.js'),
			{ CommandoClient } = require('discord.js-commando'),
			client = new CommandoClient({
				commandPrefix: config.prefix,
				owner: config.owner,
				invite: config.discord,
			});

// Bind config to client
client.config = config;

// Get Registries
const getCategories = async () => (
	await new Promise((resolve, reject) => {
		fs.readdir(`${__dirname}/commands`, (err, files) => {
			if (err) return reject();
			resolve(files);
		});
	})
);

const getCategoryData = async () => {
	const categories = await getCategories();
	const getCommandFile = (path) => new Promise((resolve, reject) => {
		fs.access(file, (err, data) => {
			if (err) return reject();
			if (!data) return reject();
			fs.readFile(file, { encoding: 'utf8' }, (err, data) => {
				if (err) return reject();
				resolve(data);
			});
		});
	});
	return categories.map(filename => ``);
};

const getRegistries = () => (
	[
		{
			name: 'registerDefaultTypes'
		},
		{
			name: 'registerGroups',
			args: [
				[
					'events', 'Events'
				]
			]
		},
		{
			name: 'registerDefaultGroups'
		},
		{
			name: 'registerCommandsIn',
			args: [
				`${__dirname}/commands`
			]
		}
	]
);

getRegistries().forEach(({ name, args }) => {
	const fn = client.registry[name];
	if (typeof name !== 'function') return;
	if (!args) return fn();
	fn(...args);
});

// Login
client.login(process.env.TOKEN);