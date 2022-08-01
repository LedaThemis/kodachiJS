/**
 * Status/Presence cache type
 */
export interface CacheType {
    status: {
        [key: string]: PresenceStatus;
    };
    activities: {
        [key: string]: Activity[];
    };
}

/**
 * Generic event type
 */
export interface EventType {
    name: string;
    once?: boolean;
    cache?: boolean;
    execute: Function;
}
