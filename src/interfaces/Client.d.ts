import { Client } from 'discord.js';

export interface ExtendedClient extends Client {
    commands?: Collection<string, CommandType>;
}
