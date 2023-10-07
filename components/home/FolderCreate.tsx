import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";

type FolderType = {
    name: string;
    id: string;
};

type FolderCreateType = {
    currentFolder: string;
    setNestedFolders: Dispatch<SetStateAction<FolderType[]>>;
};

export default function FolderCreate({
    currentFolder,
    setNestedFolders,
}: FolderCreateType) {
    const supabase = createClientComponentClient();

    const folderInputRef = useRef<HTMLInputElement>(null);
    const [folderInput, setFolderInput] = useState("");

    const handleFolderChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFolderInput(e.target.value);
    };

    const createFolder = async () => {
        if (!folderInput) return;

        const { data, error } = await supabase
            .from("folder")
            .insert({ parent: currentFolder, name: folderInput })
            .select("id, name");
        if (error) {
            return console.log(error);
        }
        setNestedFolders((prevState) => [
            ...prevState,
            { name: data[0].name, id: data[0].id },
        ]);
        setFolderInput("");
    };

    return (
        <div>
            <label htmlFor="create-folder">Create Folder</label>
            <input
                ref={folderInputRef}
                id="create-folder"
                type="text"
                value={folderInput}
                onChange={(e) => handleFolderChange(e)}
            />
            <button className="border p-2" onClick={createFolder}>
                CREATE FOLDER
            </button>
        </div>
    );
}
