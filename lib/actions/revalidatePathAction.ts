"use server";

import { revalidatePath } from "next/cache";

// For client-side mutations
export default async function revalidatePathAction(path: string) {
    revalidatePath(path);
}
