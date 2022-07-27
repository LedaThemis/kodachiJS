import { ChatInputCommandInteraction } from 'discord.js';

import { deleteEntry } from '../../lib/Birthday';

module.exports = {
    async execute(interaction: ChatInputCommandInteraction) {
        const input = {
            user_id: interaction.options.getString('user_id'),
        };

        await interaction.deferReply();
        try {
            await deleteEntry(input.user_id!);
            await interaction.editReply('Successfully deleted birthday entry.');
        } catch (error) {
            await interaction.editReply(String(error));
        }
    },
};
