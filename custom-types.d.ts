type ImageType = {
    s3_id: string;
    name: string;
    presignedUrl: string;
    created_at: string;
};

type FolderType = {
    name: string;
    id: string;
    parent?: string | null;
};

export type { ImageType, FolderType };
