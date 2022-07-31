import { Activity, Presence, TextChannel, userMention } from 'discord.js';

import config from '../../../config';
import { ExtendedClient } from '../../interfaces/Client';
import { CacheType } from '../../interfaces/Events';

module.exports = {
    name: 'presenceUpdate',
    async execute(
        oldPresence: Presence | undefined,
        newPresence: Presence,
        client: ExtendedClient,
        cache: CacheType,
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

        const areDifferentActivities = (
            oldActivities: Activity[] | undefined,
            newActivities: Activity[],
        ) => {
            return (
                !oldActivities ||
                oldActivities!.length !== newActivities.length ||
                newActivities.some(
                    (activity, index) =>
                        !activity.equals(oldActivities![index]),
                )
            );
        };

        const user = newPresence.member;
        const cachedStatus = cache.status[user!.id];
        if (config.logger.users.includes(user!.id)) {
            const statusChannel = (await client.channels.fetch(
                config.logger.channels.status,
            )) as TextChannel | null;

            if (cachedStatus) {
                if (cachedStatus !== newPresence.status) {
                    // Cache status
                    cache.status[user!.id] = newPresence.status;

                    statusChannel?.send(
                        `${userMention(
                            user?.id!,
                        )} Changed status from ${getDevices(cachedStatus)}${
                            statusEmojis[oldPresence!.status]
                        } to ${getDevices(newPresence)}${
                            statusEmojis[newPresence.status]
                        }`,
                    );
                }
            } else {
                // Cache status
                cache.status[user!.id] = newPresence.status;

                statusChannel?.send(
                    `${userMention(user?.id!)} Changed status to ${getDevices(
                        newPresence,
                    )}${statusEmojis[newPresence.status]}`,
                );
            }

            const cachedActivities = cache.activities[user!.id];
            if (
                areDifferentActivities(cachedActivities, newPresence.activities)
            ) {
                // Cache activities
                cache.activities[user!.id] = newPresence.activities;

                const activityChannel = (await client.channels.fetch(
                    config.logger.channels.activity,
                )) as TextChannel | null;

                activityChannel?.send(
                    `${getDevices(newPresence)}${userMention(
                        user!.id,
                    )} Changed Activity to \n${parseActivities(newPresence)}`,
                );
            }
        }
    },
};
