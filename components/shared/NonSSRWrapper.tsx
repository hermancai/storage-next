import dynamic from "next/dynamic";
import { PropsWithChildren } from "react";

// Browser extensions such as LastPass inject HTML
// This causes hydration errors because the client UI
//     does not match the server

function NonSSRWrapper({ children }: PropsWithChildren) {
    return <>{children}</>;
}

export default dynamic(() => Promise.resolve(NonSSRWrapper), { ssr: false });
