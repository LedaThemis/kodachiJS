import { ChatInputCommandInteraction } from 'discord.js';

import Birthday from '../../models/Birthday';

module.exports = {
    async execute(interaction: ChatInputCommandInteraction) {
        const input = {
            user_id: interaction.options.getString('user_id'),
            month: interaction.options.getInteger('month'),
            day: interaction.options.getInteger('day'),
        };

        const userExists = await Birthday.findOne({ user_id: input.user_id });

        if (userExists) {
            await interaction.reply({
                content: 'This `user_id` already has a birthday entry.',
                ephemeral: true,
            });
        } else {
            const birthday = new Birthday({
                ...input,
            });

            birthday.save(async (err) => {
                if (err) {
                    await interaction.reply({
                        content: 'An error occurred while saving to database.',
                        ephemeral: true,
                    });
                    console.error(err.message);
                } else {
                    await interaction.reply(
                        'Succesfully added birthday entry.',
                    );
                }
            });
        }
    },
};
