import AIChat from "./components/AIChat";
import AnalyticsTracker from "./components/Tracker";
import BentoGrid from "./components/bento/BentoGrid";

export default function Home() {
  return (
    <main className="relative w-full min-h-screen overflow-x-hidden">
      <AnalyticsTracker />

      {/* Floating overlays, fixed to viewport (dock + mobile menu live in the root layout) */}
      <AIChat />

      <div className="w-full pb-32">
        <BentoGrid />
      </div>
    </main>
  );
}
