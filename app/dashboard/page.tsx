"use client";

import StreamView from '@/components/ui/StreamView';
import { useSession } from 'next-auth/react';

export default function MusicQueue() {
  const { data: session , status } = useSession<any>();

  if (status === "loading") return <p>Loading...</p>; 

  return (
    <div>
      <StreamView createrid={session?.user?.id} />
    </div>
  );
}
