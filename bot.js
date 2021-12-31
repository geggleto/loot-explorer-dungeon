const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const commandBus = require('./src/Infrastructure/CommandBus');
const EventBus = require('./src/Infrastructure/EventBus');

if (! process.env.DISCORD_KEY) {
    console.error('DISCORD KEY MISSING');
    process.exit();
}

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', message => {
    let command = message.content.split(' ');

    if (command[0][0] === '!') {
        commandBus.handle(message, command, EventBus, command.splice(1));
    }
});

client.login(process.env.DISCORD_KEY);