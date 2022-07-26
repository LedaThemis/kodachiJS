import {
    ChatInputCommandInteraction,
    GuildMember,
    TextChannel,
    User,
} from 'discord.js';

import config from '../../../config';
import { ExtendedClient } from '../../interfaces/Client';

module.exports = {
    async execute(
        interaction: ChatInputCommandInteraction,
        client: ExtendedClient,
    ) {
        let user = interaction.options.getUser('user');

        if (!user) {
            user = interaction.user;
        }

        const guildConfig = config.welcome.guilds[interaction.guild!.id];

        const processMessage = (message: string) => {
            const userMention = `<@${user?.id}>`;
            return message.replace(/<@USER_MENTION>/g, userMention);
        };

        const processedMessage = processMessage(guildConfig.message);

        if (guildConfig.attachment_url) {
            await interaction
                .reply({
                    content: processedMessage,
                    files: [guildConfig.attachment_url],
                })
                .catch((err) => console.error(err));
        } else {
            await interaction.reply({
                content: processedMessage,
            });
        }
    },
};
