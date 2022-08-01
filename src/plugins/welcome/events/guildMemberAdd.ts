import { GuildMember, TextChannel, userMention } from 'discord.js';

import config from '../../../../config';
import { ExtendedClient } from '../../../interfaces/Client';

module.exports = {
    name: 'guildMemberAdd',
    async execute(member: GuildMember, client: ExtendedClient) {
        const guildConfig = config.welcome.guilds[member.guild.id];

        const welcomeChannel = client.channels.cache.get(
            guildConfig.channel,
        ) as TextChannel | undefined;

        const processMessage = (message: string) => {
            return message.replace(
                /<@USER_MENTION>/g,
                userMention(member?.id!),
            );
        };

        const processedMessage = processMessage(guildConfig.message);

        if (guildConfig.attachment_url) {
            welcomeChannel?.send({
                content: processedMessage,
                files: [guildConfig.attachment_url],
            });
        } else {
            welcomeChannel?.send({
                content: processedMessage,
            });
        }
    },
};
