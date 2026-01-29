export type ImageType = {
    s3_id: string;
    name: string;
    signedUrl: string;
    created_at: string;
};

export type FolderType = {
    name: string;
    id: string;
    parent?: string | null;
};
