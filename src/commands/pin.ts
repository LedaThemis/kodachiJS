import {
    ActionRowBuilder,
    ApplicationCommandType,
    ButtonBuilder,
    ButtonStyle,
    ContextMenuCommandBuilder,
    MessageContextMenuCommandInteraction,
    PermissionFlagsBits,
    TextChannel,
    userMention,
} from 'discord.js';

import config from '../../config';

const { pins, errors } = config;

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Pin Message')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setType(ApplicationCommandType.Message),
    async execute(interaction: MessageContextMenuCommandInteraction) {
        const { targetMessage } = interaction;

        if (
            !pins[targetMessage.guildId!] ||
            !pins[targetMessage.guildId!].pinsChannel
        ) {
            await interaction.reply(
                String(errors.pins.NO_PINS_CHANNEL_CONFIGURED),
            );
            return;
        }

        await interaction.deferReply();

        const pinsChannel = (await interaction.client.channels.fetch(
            pins[targetMessage.guildId!].pinsChannel,
        )) as TextChannel | null;

        const webhooks = await pinsChannel?.fetchWebhooks();
        const webhook = webhooks?.find((wh) => !!wh.token);

        if (!webhook) {
            await pinsChannel
                ?.createWebhook({
                    name: 'pins [kodachi]',
                })
                .catch(console.error);

            await interaction.editReply(
                'Created a webhook for you, try again.',
            );
            return;
        }

        const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel('Jump')
                .setStyle(ButtonStyle.Link)
                .setURL(targetMessage.url),
        );

        await webhook?.send({
            content: targetMessage.content,
            files: targetMessage.attachments.toJSON().map((a) => a.url),
            username: targetMessage.author.username,
            avatarURL: targetMessage.author.avatarURL()!,
            components: [buttonRow],
            allowedMentions: {
                parse: [],
            },
        });

        await interaction.editReply(
            `${userMention(
                interaction.user.id,
            )} pinned a message from this channel. See all pinned messages <#${
                pinsChannel?.id
            }>.`,
        );
    },
};
