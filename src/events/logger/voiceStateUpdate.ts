import { TextChannel, VoiceState } from 'discord.js';

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
                    `\u{1F7E8} <@${oldState.member?.id}> switched from <#${oldState.channelId}> to <#${newState.channelId}>`,
                );
            } else if (!oldState.channelId && newState.channelId) {
                voiceStateChannel?.send(
                    `\u{1F7E9} <@${newState.member?.id}> joined <#${newState.channelId}>`,
                );
            } else {
                voiceStateChannel?.send(
                    `\u{1F7E5} <@${oldState.member?.id}> left <#${oldState.channelId}>`,
                );
            }
        }
    },
};
