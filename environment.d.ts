declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string;
            clientId: string;
            devGuildId: string;
            MONGODB_URI: string;
        }
    }
}

export {};
