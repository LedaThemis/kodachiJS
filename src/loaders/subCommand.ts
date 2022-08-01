import path from 'path';

import { SubCommandType } from '../interfaces/Commands';

/**
 * Loads subcommand
 * @param directoryPath path of command's directory
 * @param commandName name of command
 * @param subCommandName name of sub command
 * @returns subCommand
 */
const loadSubCommand = (
    directoryPath: string,
    commandName: string,
    subCommandName: string,
): SubCommandType => {
    const subCommandPath = path.join(
        directoryPath,
        'subcommands',
        subCommandName,
    );

    return require(subCommandPath);
};

export { loadSubCommand };
