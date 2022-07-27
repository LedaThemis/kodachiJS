export interface configInterface {
    admins: string[];
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
    currency: {
        defaultBalance: number;
    };
    errors: {
        bank: {
            USER_NO_ACCOUNT: Error;
            USER_ALREADY_REGISTERED: Error;
            BOTS_CANT_HAVE_ACCOUNT: Error;
        };
    };
}
