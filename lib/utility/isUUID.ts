export default function isUUID(input: unknown) {
    if (typeof input !== "string") return false;

    const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(input)) return false;

    return true;
}
