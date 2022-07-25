import { Client, Collection } from 'discord.js';

import { CommandType } from './Commands';

/**
 * Client type with commands collection
 */
export interface ExtendedClient extends Client {
    commands?: Collection<string, CommandType>;
}
