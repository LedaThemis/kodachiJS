import { ChatInputCommandInteraction } from 'discord.js';

module.exports = {
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply('Pong!');
    },
};
