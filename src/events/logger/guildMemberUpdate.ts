import { GuildMember, TextChannel, userMention } from 'discord.js';

import config from '../../../config';
import { ExtendedClient } from '../../interfaces/Client';

module.exports = {
    name: 'guildMemberUpdate',
    async execute(
        oldMember: GuildMember,
        newMember: GuildMember,
        client: ExtendedClient,
    ) {
        if (oldMember.nickname !== newMember.nickname) {
            const nicknameChannel = (await client.channels.fetch(
                config.logger.channels.nickname,
            )) as TextChannel | null;

            if (oldMember.nickname && newMember.nickname) {
                nicknameChannel?.send(
                    `${userMention(oldMember.id)} changed nickname from **${
                        oldMember.nickname
                    }** to **${newMember.nickname}** in **${
                        oldMember.guild.name
                    }**`,
                );
            } else if (!oldMember.nickname && newMember.nickname) {
                nicknameChannel?.send(
                    `${userMention(oldMember.id)} set nickname to **${
                        newMember.nickname
                    }** in **${oldMember.guild.name}**`,
                );
            } else {
                nicknameChannel?.send(
                    `${userMention(oldMember.id)} reset nickname in **${
                        oldMember.guild.name
                    }**`,
                );
            }
        }
    },
};
