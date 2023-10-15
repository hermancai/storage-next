"use client";

import useRedirectIfAuthorized from "@/hooks/useRedirectIfAuthorized";
import { useState } from "react";

export default function LandingPage() {
    const [loading, setLoading] = useState(true);
    useRedirectIfAuthorized(setLoading);

    if (loading) {
        return <div>LOADING</div>;
    }

    return <div>Landing page</div>;
}
