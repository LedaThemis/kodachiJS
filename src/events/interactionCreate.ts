import { ChatInputCommandInteraction } from 'discord.js';

import { ExtendedClient } from '../interfaces/Client';

module.exports = {
    name: 'interactionCreate',
    async execute(
        interaction: ChatInputCommandInteraction,
        client: ExtendedClient,
    ) {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands?.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'There was an error while executing this command!',
                ephemeral: true,
            });
        }
    },
};
