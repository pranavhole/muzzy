"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export function Appbar() {

const session = useSession();
console.log(session.data?.user);
    return <div>
        <div className="flex justify-between">
            <div>
                Mussa
            </div>
            <div>
            {session.data?.user && <button
                    className="m-2 p-2 bg-blue-400"
                    onClick={() => { signOut(); }}
                >
                    LogOut
                </button>}

                {!session.data?.user && <button
                    className="m-2 p-2 bg-blue-400"
                    onClick={() => { signIn("google"); }}
                >
                    Sign In
                </button>}
            </div>
        </div>
    </div>

}