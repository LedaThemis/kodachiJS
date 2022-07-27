import { ChatInputCommandInteraction } from 'discord.js';

import { getEntries } from '../../lib/Birthday';

module.exports = {
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        try {
            const entries = await getEntries();
            // Sort by month and day
            entries.sort((a, b) => {
                if (a.month === b.month) {
                    return a.day - b.day;
                } else {
                    return a.month - b.month;
                }
            });

            // Craft response content
            const values = await Promise.all(
                entries.map(async ({ user_id, month, day }, index) => {
                    const user = await interaction.client.users.fetch(user_id);

                    let user_text = '';

                    if (user) {
                        user_text = `${user.username}#${user.discriminator} (\`${user_id}\`)`;
                    } else {
                        user_text = `\`${user_id}\``;
                    }

                    const zeroPaddedDay = String(day).padStart(2, '0');
                    const zeroPaddedMonth = String(month).padStart(2, '0');
                    const order: number = index + 1;

                    return `${order}. ${user_text} born ${zeroPaddedMonth}/${zeroPaddedDay}`;
                }),
            );

            const response =
                'Birthday Table:\n\nFormat: mm/dd\n\n' + values.join('\n');

            await interaction.editReply(response);
        } catch (error) {
            await interaction.editReply(String(error));
        }
    },
};
