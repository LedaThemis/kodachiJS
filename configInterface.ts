export type AvailablePlugins =
    | 'bank'
    | 'birthday'
    | 'info'
    | 'logger'
    | 'pin'
    | 'welcome';

export interface configInterface {
    admins: string[];
    plugins: AvailablePlugins[];

    birthday: {
        channels: string[];
        log: string;
    };
    welcome: {
        guilds: {
            [key: string]: {
                message: string;
                attachment_url: string;
                channel: string;
            };
        };
    };
    logger: {
        users: string[];
        channels: {
            voice: string;
            activity: string;
            status: string;
            nickname: string;
            username: string;
        };
        cmd_channel: string;
    };
    pins: {
        [guildId: string]: {
            pinsChannel: string;
        };
    };
    currency: {
        defaultBalance: number;
    };
    errors: {
        birthday: {
            ENTRY_ALREADY_EXISTS: Error;
            NO_ENTRY_EXISTS: Error;
        };

        bank: {
            USER_NO_ACCOUNT: Error;
            USER_ALREADY_REGISTERED: Error;
            BOTS_CANT_HAVE_ACCOUNT: Error;
        };

        pins: {
            NO_PINS_CHANNEL_CONFIGURED: Error;
        };

        _generic: {
            DATABASE: Error;
        };
    };
}
