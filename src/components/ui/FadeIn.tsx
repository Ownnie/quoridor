"use client";

import { useEffect, useState } from "react";

export function FadeIn({ children, ms = 300 }: { children: React.ReactNode; ms?: number }) {
    const [show, setShow] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setShow(true), 10);
        return () => clearTimeout(t);
    }, []);
    return (
        <div
            style={{ transition: `opacity ${ms}ms ease` }}
            className={show ? "opacity-100" : "opacity-0"}
        >
            {children}
        </div>
    );
}
