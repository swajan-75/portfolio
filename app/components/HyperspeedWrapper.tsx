"use client";

import dynamic from 'next/dynamic';

const Hyperspeed = dynamic(() => import('./Hyperspeed'), { ssr: false });

export default function HyperspeedWrapper() {
  return <Hyperspeed />;
}
