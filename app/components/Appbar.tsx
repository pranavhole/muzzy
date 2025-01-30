"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export function Appbar() {
    const { data: session, status } = useSession();
    const [error, setError] = useState<string | null>(null);

    const handleUpvote = async () => {
        setError(null);
        try {
            const response = await fetch("/api/Streams/upvote", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    StreamId: "a2addcb4-4d22-4e2c-843b-351f74d83ba6" 
                }),
                credentials: "include" // Important for session cookies
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to upvote");
            }

            const data = await response.json();
            console.log("Upvote successful:", data);
        } catch (err) {
            console.error("Upvote error:", err);
            setError(err instanceof Error ? err.message : "Failed to upvote");
        }
    };

    return (
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold">SoundWave</span>
            </div>
            
            <div className="flex items-center gap-4">
                {error && (
                    <div className="text-red-500 text-sm">
                        Error: {error}
                    </div>
                )}

                {session?.user ? (
                    <>
                        <button
                            onClick={handleUpvote}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-full transition-colors"
                        >
                            Upvote
                        </button>
                        <button
                            onClick={() => signOut()}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            href="/login"
                            className="hover:text-purple-300 transition-colors px-4 py-2"
                        >
                            Sign In
                        </Link>
                        <button
                            onClick={() => signIn("google")}
                            className="bg-purple-500 hover:bg-purple-600 px-6 py-2 rounded-full transition-colors"
                        >
                            Get Started
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}