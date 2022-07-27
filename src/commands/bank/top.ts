import { ChatInputCommandInteraction } from 'discord.js';

import { getBalances } from '../../lib/Profile';

module.exports = {
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        try {
            const profiles = await getBalances();
            profiles.sort((a, b) => b.balance - a.balance);

            const values = await Promise.all(
                profiles.map(async (profile, index) => {
                    const user = await interaction.client.users.fetch(
                        profile.userId,
                    );

                    return `${index + 1}. <@${user.id}> has ${
                        profile.balance
                    }$`;
                }),
            );

            const finalString =
                'Bank Leaderboard:\n\n' + values.join('\n**—————**\n');

            await interaction.editReply(finalString);
        } catch (error) {
            await interaction.editReply(String(error));
        }
    },
};
