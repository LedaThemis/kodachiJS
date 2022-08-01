import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

module.exports = {
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply(
            `Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`,
        );
    },
};
