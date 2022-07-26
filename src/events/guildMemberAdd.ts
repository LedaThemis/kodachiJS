import { GuildMember, TextChannel } from 'discord.js';

import config from '../../config';
import { ExtendedClient } from '../interfaces/Client';

module.exports = {
    name: 'guildMemberAdd',
    async execute(member: GuildMember, client: ExtendedClient) {
        const guildConfig = config.welcome.guilds[member.guild.id];

        const welcomeChannel = client.channels.cache.get(
            guildConfig.channel,
        ) as TextChannel | undefined;

        const processMessage = (message: string) => {
            const userMention = `<@${member.id}>`;
            return message.replace(/<@USER_MENTION>/g, userMention);
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
