import { PropsWithChildren } from "react";

export default function FoldersLayout({ children }: PropsWithChildren) {
    return <div className="p-4 sm:p-8">{children}</div>;
}
