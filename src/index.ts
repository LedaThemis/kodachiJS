import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

client.on('ready', () => {
    console.log('Ready!');
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) {
        return;
    }

    const { commandName, options } = interaction;

    if (commandName === 'ping') {
        interaction.reply('Pong!');
    }
});

client.login(process.env.TOKEN);
