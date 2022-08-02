import { SlashCommandBuilder } from 'discord.js';

/**
 * Generic command type
 */
export interface CommandType {
    data: SlashCommandBuilder;
    /**
     * function to execute on command call
     */
    execute: Function;
    needsAdmin?: boolean;
    /**
     * list of guilds the command is allowed in
     */
    guilds?: string[];
}

/**
 * Generic subcommand type
 */
export interface SubCommandType {
    execute: Function;
}
