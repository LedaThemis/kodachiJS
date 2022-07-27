import { ChatInputCommandInteraction } from 'discord.js';

import config from '../../../config';
import { getBalance } from '../../lib/Profile';

const { errors } = config;

module.exports = {
    async execute(interaction: ChatInputCommandInteraction) {
        const input = {
            user: interaction.options.getUser('user'),
        };

        if (!input.user) {
            input.user = interaction.user;
        }

        if (input.user.bot) {
            await interaction.reply({
                content: String(errors.bank.BOTS_CANT_HAVE_ACCOUNT),
                ephemeral: true,
            });
            return;
        }

        await interaction.deferReply();
        try {
            const userBalance = await getBalance(input.user!.id);
            await interaction.editReply(
                `<@${input.user.id}> has ${userBalance}$`,
            );
        } catch (error) {
            await interaction.editReply(String(error));
        }
    },
};
