import { REST } from '@discordjs/rest';
import { RESTPostAPIApplicationCommandsJSONBody, Routes } from 'discord.js';
import dotenv from 'dotenv';

import { loadPlugins } from './loaders/plugin';

dotenv.config();

const { TOKEN, clientId } = process.env;

const applicationCommands: RESTPostAPIApplicationCommandsJSONBody[] = [];

const guildsCommands: {
    [guildId: string]: RESTPostAPIApplicationCommandsJSONBody[];
} = {};

const plugins = loadPlugins();

for (const plugin of plugins) {
    plugin.commands.forEach((command) => {
        if (command.guilds) {
            for (const guildId of command.guilds) {
                if (!guildsCommands[guildId]) {
                    guildsCommands[guildId] = [];
                }

                guildsCommands[guildId].push(command.data.toJSON());
            }
        } else {
            applicationCommands.push(command.data.toJSON());
        }
    });
}

const rest = new REST({ version: '10' }).setToken(TOKEN!);

for (const guildId in guildsCommands) {
    rest.put(Routes.applicationGuildCommands(clientId!, guildId!), {
        body: guildsCommands[guildId],
    })
        .then(() =>
            console.log(`Successfully registered guild(${guildId}) commands.`),
        )
        .catch(console.error);
}

rest.put(Routes.applicationCommands(clientId!), { body: applicationCommands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);
