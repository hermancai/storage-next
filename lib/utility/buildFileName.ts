export default function buildFileName(oldName: string, newName: string) {
    return (
        newName + oldName.substring(oldName.lastIndexOf("."), oldName.length)
    );
}
