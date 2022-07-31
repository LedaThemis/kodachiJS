import { Interaction } from 'discord.js';

import config from '../../config';
import { ExtendedClient } from '../interfaces/Client';

module.exports = {
    name: 'interactionCreate',
    async execute(interaction: Interaction, client: ExtendedClient) {
        if (
            interaction.isChatInputCommand() ||
            interaction.isMessageContextMenuCommand()
        ) {
            const command = client.commands?.get(interaction.commandName);

            if (!command) return;

            if (
                command.needsAdmin &&
                !config.admins.includes(interaction.user.id)
            ) {
                await interaction.reply({
                    content: 'You do not have permission to use this command.',
                    ephemeral: true,
                });
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: 'There was an error while executing this command!',
                    ephemeral: true,
                });
            }
        }
    },
};
