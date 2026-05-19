import { createServer } from "./server/createServer.js";
import { env } from "./config/env.js";
const app = await createServer();
try {
    await app.listen({
        host: env.host,
        port: env.port
    });
}
catch (error) {
    app.log.error({ error }, "server failed to start");
    process.exit(1);
}
