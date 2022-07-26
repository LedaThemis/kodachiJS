import { Presence, TextChannel } from 'discord.js';

import config from '../../../config';
import { ExtendedClient } from '../../interfaces/Client';

module.exports = {
    name: 'presenceUpdate',
    async execute(
        oldPresence: Presence | undefined,
        newPresence: Presence,
        client: ExtendedClient,
    ) {
        const statusEmojis = {
            online: '\u{1F7E2}',
            idle: '\u{1F7E0}',
            dnd: '\u{1F534}',
            offline: '\u{26AB}',
            invisible: '\u{26AB}',
        };

        const devicesEmojis = {
            desktop: '\u{1F5A5}',
            web: '\u{1F310}',
            mobile: '\u{1F4F1}',
        };

        const getDevices = (presence: Presence) => {
            let result = '';
            if (presence.clientStatus?.desktop) {
                result += devicesEmojis['desktop'];
            }
            if (presence.clientStatus?.web) {
                result += devicesEmojis['web'];
            }
            if (presence.clientStatus?.mobile) {
                result += devicesEmojis['mobile'];
            }

            return result;
        };

        const parseActivities = (presence: Presence) => {
            const { activities } = presence;

            const result = activities
                .map(
                    (activity) =>
                        `Name: **${activity.name}**\nState: **${activity.state}**`,
                )
                .join('\n');

            return result ? result : '**None**';
        };

        const user = newPresence.member;
        if (config.logger.users.includes(user!.id)) {
            const statusChannel = (await client.channels.fetch(
                config.logger.channels.status,
            )) as TextChannel | null;
            if (oldPresence) {
                if (oldPresence.status !== newPresence.status) {
                    statusChannel?.send(
                        `<@${user?.id}> Changed status from ${getDevices(
                            oldPresence,
                        )}${statusEmojis[oldPresence.status]} to ${getDevices(
                            newPresence,
                        )}${statusEmojis[newPresence.status]}`,
                    );
                }
            } else {
                statusChannel?.send(
                    `<@${user?.id}> Changed status to ${getDevices(
                        newPresence,
                    )}${statusEmojis[newPresence.status]}`,
                );
            }

            const activityChannel = (await client.channels.fetch(
                config.logger.channels.activity,
            )) as TextChannel | null;

            activityChannel?.send(
                `${getDevices(newPresence)}<@${
                    user!.id
                }> Changed Activity to \n${parseActivities(newPresence)}`,
            );
        }
    },
};
