/**
 * Generic event type
 */
export interface EventType {
    name: string;
    once?: boolean;
    execute: Function;
}
