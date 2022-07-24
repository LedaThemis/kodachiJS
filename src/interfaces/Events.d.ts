export interface EventType {
    name: string;
    once?: boolean;
    execute: Function;
}
