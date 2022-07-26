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
}
