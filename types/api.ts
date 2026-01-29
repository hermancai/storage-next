export type GeneralSuccess = {
    ok: true;
};

export type GeneralError = {
    ok: false;
    error: string;
};

export type GeneralResponse = GeneralSuccess | GeneralError;

export type PresignedUrlSuccess = GeneralSuccess & {
    presignedUrl: string;
    fields: Record<string, string>;
    s3_id: string;
};

export type PresignedUrlResponse = PresignedUrlSuccess | GeneralError;

export type ImageUrlSuccess = GeneralSuccess & {
    signedUrl: string;
};

export type ImageUrlResponse = ImageUrlSuccess | GeneralError;

export type SupabaseImageRow = {
    s3_id: string;
    name: string;
    created_at: string;
};

export type InsertImageSupabaseSuccess = GeneralSuccess & {
    s3_id: string;
    created_at: string;
};

export type InsertImageSupabaseResponse =
    | InsertImageSupabaseSuccess
    | GeneralError;

export type CreateFolderSuccess = GeneralSuccess & {
    id: string;
    name: string;
};

export type CreateFolderResponse = CreateFolderSuccess | GeneralError;

export type ImageWithUrl = SupabaseImageRow & {
    signedUrl: string;
};
