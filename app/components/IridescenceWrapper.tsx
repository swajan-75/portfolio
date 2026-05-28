"use client";
import dynamic from 'next/dynamic';

const Iridescence = dynamic(() => import('./Iridescence'), { ssr: false });

export default function IridescenceWrapper() {
  return (
    <Iridescence
      color={[0.502, 0.6, 0.8]}
      mouseReact={true}
      amplitude={0.1}
      speed={1.0}
    />
  );
}
