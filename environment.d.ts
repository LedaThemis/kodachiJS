declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string;
            clientId: string;
            guildId: string;
            MONGODB_URI: string;
        }
    }
}

export {};
