import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

module.exports = {
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply(
            `Server name: ${interaction.guild?.name}\nTotal members: ${interaction.guild?.memberCount}`,
        );
    },
};
