import fs from 'fs';
import path from 'path';

import config from '../../config';
import { AvailablePlugins } from '../../configInterface';
import { CommandType } from '../interfaces/Commands';
import { EventType } from '../interfaces/Events';
import { PluginType } from '../interfaces/Plugin';

/**
 * @returns plugins directory path
 */
const getPluginsPath = () => path.join(__dirname, '..', 'plugins');

/**
 * @returns list of currently enabled plugins' names
 */
const getPluginsNames = () => {
    const pluginsPath = getPluginsPath();

    return fs
        .readdirSync(pluginsPath, { withFileTypes: true })
        .filter((dir) => dir.isDirectory())
        .map((dir) => dir.name)
        .filter((dirName) => {
            const dn = dirName as AvailablePlugins;
            return config.plugins.includes(dn);
        });
};

/**
 * @param name plugin's name
 * @returns plugin's path
 */
const getPluginPath = (name: string) =>
    path.join(__dirname, '..', 'plugins', name);

/**
 * @param name plugin's name
 * @returns list of plugin's commands paths
 */
const getPluginCommandsPaths = (name: string) => {
    const pluginCommandsPath = path.join(getPluginPath(name), 'commands');

    if (!fs.existsSync(pluginCommandsPath)) return [];

    const pluginCommandsPaths = fs
        .readdirSync(pluginCommandsPath)
        .filter(
            (fileName) => fileName.endsWith('.ts') || fileName.endsWith('.js'),
        )
        .map((commandName) => path.join(pluginCommandsPath, commandName));

    return pluginCommandsPaths;
};

/**
 * @param name plugin's name
 * @returns list of plugin's commands
 */
const loadPluginCommands = (name: string) => {
    return getPluginCommandsPaths(name).map((pluginCommandPath) => {
        const pluginCommand: CommandType = require(pluginCommandPath);
        return pluginCommand;
    });
};

/**
 * @param name plugin's name
 * @returns list of plugin's events paths
 */
const getPluginEventsPaths = (name: string) => {
    const pluginEventsPath = path.join(getPluginPath(name), 'events');

    if (!fs.existsSync(pluginEventsPath)) return [];

    const pluginEventsPaths = fs
        .readdirSync(pluginEventsPath)
        .filter(
            (fileName) => fileName.endsWith('.ts') || fileName.endsWith('.js'),
        )
        .map((eventName) => path.join(pluginEventsPath, eventName));

    return pluginEventsPaths;
};

/**
 * @param name plugin's name
 * @returns list of plugin's events
 */
const loadPluginEvents = (name: string) => {
    return getPluginEventsPaths(name).map((pluginEventPath) => {
        const pluginEvent: EventType = require(pluginEventPath);
        return pluginEvent;
    });
};

const loadPluginTasks = (name: string) => [];

/**
 * @param name plugin's name
 * @returns plugin with loaded commands, events, tasks
 */
const loadPlugin = (name: string): PluginType => {
    return {
        commands: loadPluginCommands(name),
        events: loadPluginEvents(name),
        tasks: loadPluginTasks(name),
    };
};

/**
 * @returns all currently enabled plugins
 */
const loadPlugins = () => getPluginsNames().map(loadPlugin);

export { loadPlugins };
