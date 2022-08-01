import {
    Client,
    Collection,
    GatewayIntentBits,
    TextChannel,
    userMention,
} from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';
import mongoose, { plugin } from 'mongoose';
import path from 'path';
import { Agent, setGlobalDispatcher } from 'undici';

import config from '../config';
import { ExtendedClient } from './interfaces/Client';
import { CommandType } from './interfaces/Commands';
import { CacheType, EventType } from './interfaces/Events';
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
const pluginsPath = path.join(__dirname, 'plugins');
const pluginsDirs = fs
    .readdirSync(pluginsPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

const pluginsCommands = pluginsDirs.map((dirName) => {
    {
        const commandsPath = path.join(
            __dirname,
            'plugins',
            dirName,
            'commands',
        );

        const commandsFiles = fs
            .readdirSync(commandsPath)
            .filter((fileName) => fileName.endsWith('.ts'))
            .map((fileName) =>
                path.join(__dirname, 'plugins', dirName, 'commands', fileName),
            );

        return commandsFiles;
    }
});

for (const filePath of pluginsCommands.flat()) {
    const command: CommandType = require(filePath);

    client.commands.set(command.data.name, command);
}

const pluginsEvents = pluginsDirs.map((dirName) => {
    {
        const commandsPath = path.join(__dirname, 'plugins', dirName, 'events');

        const eventsFiles = fs
            .readdirSync(commandsPath)
            .filter((fileName) => fileName.endsWith('.ts'))
            .map((fileName) =>
                path.join(__dirname, 'plugins', dirName, 'events', fileName),
            );

        return eventsFiles;
    }
});

for (const filePath of pluginsEvents.flat()) {
    const event: EventType = require(filePath);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else if (event.cache) {
        client.on(event.name, (...args) =>
            event.execute(...args, client, CACHE_OBJECT),
        );
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
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
