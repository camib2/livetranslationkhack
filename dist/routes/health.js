export async function registerHealthRoute(app) {
    app.get("/health", async () => {
        return {
            status: "ok",
            timestamp: new Date().toISOString()
        };
    });
}
