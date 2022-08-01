import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import path from 'path';

import { ExtendedClient } from '../../../interfaces/Client';
import { loadSubCommand } from '../../../loaders/subCommand';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('welcome')
        .setDescription('Various commands related to welcome')
        .setDMPermission(false)
        .addSubcommand((subCommand) =>
            subCommand
                .setName('test')
                .setDescription('Test welcome message')
                .addUserOption((option) =>
                    option
                        .setName('user')
                        .setDescription('User to welcome')
                        .setRequired(false),
                ),
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
