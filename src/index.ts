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
import { EventType } from './interfaces/Events';

dotenv.config();

const client: ExtendedClient = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

// COMMANDS
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

// EVENTS
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith('.ts'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event: EventType = require(filePath);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

client.login(process.env.TOKEN);
