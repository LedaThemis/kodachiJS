import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Replies with server details')
        .setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply(
            `Server name: ${interaction.guild?.name}\nTotal members: ${interaction.guild?.memberCount}`,
        );
    },
};
