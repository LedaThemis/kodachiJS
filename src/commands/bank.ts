import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import path from 'path';

import { loadSubCommand } from '../loaders/subCommand';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bank')
        .setDescription('Various bank utilities')
        .addSubcommand((subCommand) =>
            subCommand
                .setName('register')
                .setDescription('Register user')
                .addUserOption((option) =>
                    option
                        .setName('user')
                        .setDescription('user')
                        .setRequired(false),
                ),
        )
        .addSubcommand((subCommand) =>
            subCommand
                .setName('balance')
                .setDescription('Get user balance')
                .addUserOption((option) =>
                    option
                        .setName('user')
                        .setDescription('user')
                        .setRequired(false),
                ),
        )
        .addSubcommand((subCommand) =>
            subCommand.setName('top').setDescription('Get leaderboard'),
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        const subCommand = loadSubCommand(
            __dirname,
            path.parse(__filename).name,
            interaction.options.getSubcommand(),
        );

        await subCommand.execute(interaction);
    },
};
