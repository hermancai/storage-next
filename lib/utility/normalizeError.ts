export function normalizeError(err: unknown): string {
    if (err instanceof Error) {
        return err.message;
    }

    if (typeof err === "string") {
        return err;
    }

    if (typeof err === "object" && err !== null) {
        if ("message" in err) {
            return String(err.message);
        }
    }

    return "Unknown Error";
}
