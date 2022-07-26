import { Client, Collection, GatewayIntentBits, TextChannel } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';
import mongoose from 'mongoose';
import path from 'path';

import { birthday } from '../config.json';
import { ExtendedClient } from './interfaces/Client';
import { CommandType } from './interfaces/Commands';
import { EventType } from './interfaces/Events';
import { birthdayTask } from './tasks/birthday';

dotenv.config();

const client: ExtendedClient = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

// DB
mongoose.connect(process.env.MONGODB_URI!);
const db = mongoose.connection;
db.on('connected', () => console.log('INFO | Succesfully connected to DB'));
db.on(
    'error',
    console.error.bind(console, 'ERROR | MongoDB connection error:'),
);

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

// TASKS
birthdayTask((err, result) => {
    if (err) {
        console.error(err);
    } else {
        for (const channelId in birthday.channels) {
            const channel = client.channels.cache.get(channelId) as
                | TextChannel
                | undefined;

            if (channel) {
                for (const user_id in result) {
                    if (
                        channel.guild.members.cache.find(
                            (member) => member.id === user_id,
                        )
                    )
                        channel.send(`<@${user_id}> Happy Birthday!`);
                }
            }
        }

        const logChannel = client.channels.cache.get(birthday.log) as
            | TextChannel
            | undefined;

        for (const user_id in result) {
            logChannel?.send(`<@${user_id}> Happy Birthday!`);
        }
    }
}).start();

client.login(process.env.TOKEN);
