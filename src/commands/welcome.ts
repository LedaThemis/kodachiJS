import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import path from 'path';

import { ExtendedClient } from '../interfaces/Client';
import { SubCommandType } from '../interfaces/Commands';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('welcome')
        .setDescription('Various commands related to welcome')
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
        const subCommandName = interaction.options.getSubcommand();
        const subCommandPath = path.join(
            __dirname,
            path.parse(__filename).name,
            subCommandName + '.ts',
        );

        const subCommand: SubCommandType = require(subCommandPath);

        await subCommand.execute(interaction, client);
    },
};
