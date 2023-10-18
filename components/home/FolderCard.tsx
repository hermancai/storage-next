import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Dispatch, SetStateAction } from "react";
import Link from "next/link";

type FolderType = {
    name: string;
    id: string;
};

type FolderCardType = {
    folder: FolderType;
    setNestedFolders: Dispatch<SetStateAction<FolderType[]>>;
};

export default function FolderCard({
    folder,
    setNestedFolders,
}: FolderCardType) {
    const supabase = createClientComponentClient();

    const deleteFolder = async () => {
        const { error } = await supabase
            .from("folder")
            .delete()
            .eq("id", folder.id);
        if (error) {
            return console.log(error);
        }
        setNestedFolders((prevState) =>
            prevState.filter((entry) => entry.id !== folder.id)
        );
    };

    return (
        <div>
            <Link href={`/home/folder/${folder.id}`}>{folder.name}</Link>
            <button onClick={deleteFolder}>DELETE FOLDER</button>
        </div>
    );
}