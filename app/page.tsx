import MobileMenu from "./components/MobileMenu";
import FloatingDock from "./components/FloatingDock";
import AIChat from "./components/AIChat";
import AnalyticsTracker from "./components/Tracker";
import BentoGrid from "./components/bento/BentoGrid";

export default function Home() {
  return (
    <main className="relative w-full min-h-screen overflow-x-hidden">
      <AnalyticsTracker />

      {/* Floating overlays, fixed to viewport */}
      <MobileMenu />
      <AIChat />
      <div className="hidden md:block">
        <FloatingDock />
      </div>

      <div className="w-full pb-32">
        <BentoGrid />
      </div>
    </main>
  );
}
