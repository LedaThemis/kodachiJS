import { GuildMember } from 'discord.js';

import { ExtendedClient } from '../interfaces/Client';

module.exports = {
    name: 'guildMemberAdd',
    async execute(member: GuildMember, client: ExtendedClient) {
        console.log(`${member.displayName} joined to ${member.guild.name}`);
    },
};
