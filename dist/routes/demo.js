import { readFile } from "node:fs/promises";
const demoFiles = {
    "/": {
        path: new URL("../../public/index.html", import.meta.url),
        contentType: "text/html; charset=utf-8"
    },
    "/assets/app.js": {
        path: new URL("../../public/app.js", import.meta.url),
        contentType: "application/javascript; charset=utf-8"
    },
    "/assets/styles.css": {
        path: new URL("../../public/styles.css", import.meta.url),
        contentType: "text/css; charset=utf-8"
    }
};
export async function registerDemoRoutes(app) {
    for (const [routePath, file] of Object.entries(demoFiles)) {
        app.get(routePath, async (_, reply) => {
            const body = await readFile(file.path, "utf8");
            reply.type(file.contentType);
            return body;
        });
    }
}
