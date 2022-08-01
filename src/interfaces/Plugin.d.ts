import { CommandType } from './Commands';
import { EventType } from './Events';

export interface PluginType {
    commands: CommandType[];
    events: EventType[];
    tasks: any[];
}
