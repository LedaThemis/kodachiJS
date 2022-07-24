import {
    Client,
    Collection,
    GatewayIntentBits,
    SlashCommandBuilder,
} from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

import { ExtendedClient } from './interfaces/Client';
import { CommandType } from './interfaces/Commands';

dotenv.config();

const client: ExtendedClient = new Client({
    intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith('.ts'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command: CommandType = require(filePath);

    client.commands.set(command.data.name, command);
}

client.on('ready', () => {
    console.log('Ready!');
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands?.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true,
        });
    }
});

client.login(process.env.TOKEN);
