import { SlashCommandBuilder } from 'discord.js';

/**
 * Generic command type
 */
export interface CommandType {
    data: SlashCommandBuilder;
    execute: Function;
    needsAdmin?: boolean;
}

/**
 * Generic subcommand type
 */
export interface SubCommandType {
    execute: Function;
}
