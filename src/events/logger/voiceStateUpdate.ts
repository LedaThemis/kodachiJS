import {
    TextChannel,
    VoiceState,
    channelMention,
    userMention,
} from 'discord.js';

import config from '../../../config';
import { ExtendedClient } from '../../interfaces/Client';

module.exports = {
    name: 'voiceStateUpdate',
    async execute(
        oldState: VoiceState,
        newState: VoiceState,
        client: ExtendedClient,
    ) {
        if (oldState.channelId !== newState.channelId) {
            const voiceStateChannel = (await client.channels.fetch(
                config.logger.channels.voice,
            )) as TextChannel | null;

            if (oldState.channelId && newState.channelId) {
                voiceStateChannel?.send(
                    `\u{1F7E8} ${userMention(
                        oldState.member?.id!,
                    )} switched from ${channelMention(
                        oldState.channelId,
                    )} to ${channelMention(newState.channelId)}`,
                );
            } else if (!oldState.channelId && newState.channelId) {
                voiceStateChannel?.send(
                    `\u{1F7E9} ${userMention(
                        newState.member?.id!,
                    )} joined ${channelMention(newState.channelId)}`,
                );
            } else {
                voiceStateChannel?.send(
                    `\u{1F7E5} ${userMention(
                        oldState.member?.id!,
                    )} left ${channelMention(oldState.channelId!)}`,
                );
            }
        }
    },
};
