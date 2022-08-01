import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import path from 'path';

import { ExtendedClient } from '../interfaces/Client';
import { loadSubCommand } from '../loaders/subCommand';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Various commands related to welcome')
        .setDMPermission(false)
        .addSubcommand((subCommand) =>
            subCommand.setName('ping').setDescription('Replies with Pong!'),
        )
        .addSubcommand((subCommand) =>
            subCommand
                .setName('user')
                .setDescription('Replies with user details'),
        )
        .addSubcommand((subCommand) =>
            subCommand
                .setName('server')
                .setDescription('Replies with server details'),
        ),
    async execute(
        interaction: ChatInputCommandInteraction,
        client: ExtendedClient,
    ) {
        const subCommand = loadSubCommand(
            __dirname,
            path.parse(__filename).name,
            interaction.options.getSubcommand(),
        );

        await subCommand.execute(interaction, client);
    },
};
