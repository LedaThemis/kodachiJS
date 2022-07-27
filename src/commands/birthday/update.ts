import { ChatInputCommandInteraction } from 'discord.js';

import { updateEntry } from '../../lib/Birthday';

module.exports = {
    async execute(interaction: ChatInputCommandInteraction) {
        const input = {
            user_id: interaction.options.getString('user_id'),
            month: interaction.options.getInteger('month'),
            day: interaction.options.getInteger('day'),
        };

        await interaction.deferReply();
        try {
            await updateEntry(input.user_id!, input.month!, input.day!);
            await interaction.editReply('Successfully updated birthday entry.');
        } catch (error) {
            await interaction.editReply(String(error));
        }
    },
};
