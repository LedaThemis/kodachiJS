import { TextChannel, User } from 'discord.js';

import config from '../../../config';
import { ExtendedClient } from '../../interfaces/Client';

module.exports = {
    name: 'userUpdate',
    async execute(oldUser: User, newUser: User, client: ExtendedClient) {
        if (oldUser.tag !== newUser.tag) {
            const userChannel = (await client.channels.fetch(
                config.logger.channels.username,
            )) as TextChannel | null;

            userChannel?.send(
                `<@${oldUser.id}> changed username from ${oldUser.tag} to ${newUser.tag}`,
            );
        }
    },
};
