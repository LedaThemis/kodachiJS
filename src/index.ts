import {
    Client,
    Collection,
    GatewayIntentBits,
    TextChannel,
    userMention,
} from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';
import mongoose from 'mongoose';
import path from 'path';
import { Agent, setGlobalDispatcher } from 'undici';

import config from '../config';
import { ExtendedClient } from './interfaces/Client';
import { CacheType, EventType } from './interfaces/Events';
import { loadPlugins } from './loaders/plugin';
import { birthdayTask } from './tasks/birthday';

dotenv.config();

// Edit agent timeout
setGlobalDispatcher(new Agent({ connect: { timeout: 60_000 } }));

const client: ExtendedClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

// DB
mongoose.connect(process.env.MONGODB_URI!);
const db = mongoose.connection;
db.on('connected', () => console.log('INFO | Succesfully connected to DB'));
db.on(
    'error',
    console.error.bind(console, 'ERROR | MongoDB connection error:'),
);

// CACHE
const CACHE_OBJECT: CacheType = {
    status: {},
    activities: {},
};

// PLUGINS
client.commands = new Collection();

const plugins = loadPlugins();

plugins.forEach((plugin) => {
    // Add plugin commands
    plugin.commands.forEach((command) => {
        client.commands?.set(command.data.name, command);
    });

    // Add plugin events
    plugin.events.forEach((event) => {
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else if (event.cache) {
            client.on(event.name, (...args) =>
                event.execute(...args, client, CACHE_OBJECT),
            );
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    });
});

// EVENTS
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith('.ts') || file.endsWith('.js'));

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
        for (const channelId in config.birthday.channels) {
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
                        channel.send(`${userMention(user_id)} Happy Birthday!`);
                }
            }
        }

        const logChannel = client.channels.cache.get(config.birthday.log) as
            | TextChannel
            | undefined;

        for (const user_id in result) {
            logChannel?.send(`${userMention(user_id)} Happy Birthday!`);
        }
    }
}).start();

client.login(process.env.TOKEN);
