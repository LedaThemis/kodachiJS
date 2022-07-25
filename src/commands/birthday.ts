import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import path from 'path';

import { SubCommandType } from '../interfaces/Commands';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('birthday')
        .setDescription('Various birthday utilities')
        .addSubcommand((subCommand) =>
            subCommand
                .setName('add')
                .setDescription('Add birthday entry')
                .addStringOption((option) =>
                    option
                        .setName('user_id')
                        .setDescription('ID of user')
                        .setRequired(true),
                )
                .addIntegerOption((option) =>
                    option
                        .setName('month')
                        .setDescription('Birth month')
                        .setRequired(true),
                )
                .addIntegerOption((option) =>
                    option
                        .setName('day')
                        .setDescription('Birth day')
                        .setRequired(true),
                ),
        )
        .addSubcommand((subCommand) =>
            subCommand
                .setName('update')
                .setDescription('Update birthday entry')
                .addStringOption((option) =>
                    option
                        .setName('user_id')
                        .setDescription('ID of user')
                        .setRequired(true),
                )
                .addIntegerOption((option) =>
                    option
                        .setName('month')
                        .setDescription('Birth month')
                        .setRequired(true),
                )
                .addIntegerOption((option) =>
                    option
                        .setName('day')
                        .setDescription('Birth day')
                        .setRequired(true),
                ),
        )
        .addSubcommand((subCommand) =>
            subCommand
                .setName('delete')
                .setDescription('Delete birthday entry')
                .addStringOption((option) =>
                    option
                        .setName('user_id')
                        .setDescription('ID of user')
                        .setRequired(true),
                ),
        )
        .addSubcommand((subCommand) =>
            subCommand.setName('list').setDescription('List birthday entries'),
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        const subCommandName = interaction.options.getSubcommand();
        const subCommandPath = path.join(
            __dirname,
            path.parse(__filename).name,
            subCommandName + '.ts',
        );

        const subCommand: SubCommandType = require(subCommandPath);

        await subCommand.execute(interaction);
    },
    needsAdmin: true,
};
