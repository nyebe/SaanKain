"use client";

import React from 'react';

import Image from 'next/image';

type LoadingScreenProps = {
    visible?: boolean;
    theme?: "dark" | "light";
};

export default function LoadingScreen({
    visible = true,
    theme = "dark",
}: LoadingScreenProps) {
    if (!visible) return null;

    return (
        <div
            className={`loading-screen ${theme === "dark" ? "loading-dark" : "loading-light"}`}
            aria-hidden={!visible}
        >
            <div className="loading-content">
                {/* background pattern handled by CSS ::before for dense tiled triangles */}

                <div className="loading-logo" role="img" aria-label="SaanKain">
                    <Image src="/app-logo/192x192.png" alt="SaanKain" width={140} height={140} priority />
                </div>
            </div>
        </div>
    );
}
