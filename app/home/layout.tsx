export const dynamic = "force-dynamic";

import { PropsWithChildren } from "react";

export default function FoldersLayout({ children }: PropsWithChildren) {
    return (
        <div className="p-4 sm:p-8 bg-zinc-800 h-max flex-1">{children}</div>
    );
}
