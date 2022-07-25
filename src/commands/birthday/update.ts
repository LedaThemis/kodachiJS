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

        if (!userExists) {
            await interaction.reply({
                content: 'This `user_id` does not have a birthday entry.',
                ephemeral: true,
            });
        } else {
            Birthday.findOneAndUpdate(
                { user_id: input.user_id },
                input,
                {},
                async (err) => {
                    if (err) {
                        await interaction.reply({
                            content:
                                'An error occurred while updating entry in database.',
                            ephemeral: true,
                        });
                    } else {
                        await interaction.reply(
                            'Successfully updated birthday entry.',
                        );
                    }
                },
            );
        }
    },
};
