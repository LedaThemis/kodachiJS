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
}
