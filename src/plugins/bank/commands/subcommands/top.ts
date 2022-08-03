import { ChatInputCommandInteraction, userMention } from 'discord.js';

import { getBalances } from '../../../../lib/Profile';

module.exports = {
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        try {
            const profiles = await getBalances();
            profiles.sort((a, b) => b.balance! - a.balance!);

            await interaction.guild?.members.fetch();

            profiles.filter((profile) =>
                interaction.guild?.members.cache.has(profile.userId),
            );

            const values = await Promise.all(
                profiles.map(
                    async (profile, index) =>
                        `${index + 1}. ${userMention(profile.userId)} has ${
                            profile.balance
                        }$`,
                ),
            );

            const finalString =
                'Bank Leaderboard:\n\n' + values.join('\n**—————**\n');

            await interaction.editReply(finalString);
        } catch (error) {
            await interaction.editReply(String(error));
        }
    },
};
