import React from "react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="bg-background min-h-screen flex">
            {children}
        </main>
    );
}
