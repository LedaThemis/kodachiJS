import { ExtendedClient } from '../interfaces/Client';

module.exports = {
    name: 'ready',
    once: true,
    execute(client: ExtendedClient) {
        console.log(`INFO | Ready! Logged in as ${client.user?.tag}`);
    },
};
