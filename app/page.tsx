import MobileMenu from "./components/MobileMenu";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import FloatingDock from "./components/FloatingDock";
import Projects from "./components/Projects";
import About from "./components/About";
import Contact from "./components/Contact";
import AIChat from "./components/AIChat";
import AnalyticsTracker from "./components/Tracker";
import GradualBlur from "./components/GradualBlur";

export default function Home() {
  return (
    <main className="h-[100svh] w-full overflow-hidden p-0 md:px-4 md:pt-4 md:pb-[95px] lg:px-6 lg:pt-6 lg:pb-[100px] flex items-center justify-center">
      <AnalyticsTracker />

      {/* Global Glass Container */}
      <div className="w-full max-w-[1600px] h-full relative overflow-hidden rounded-none md:rounded-[2.5rem] bg-white/10 backdrop-blur-3xl border-none md:border border-white/10 shadow-none md:shadow-2xl">

        {/* Absolute floating elements bound to container */}
        <MobileMenu />
        <AIChat />

        {/* Scrollable Content Area */}
        <div className="h-full w-full overflow-y-auto overflow-x-hidden custom-scrollbar pb-16 scroll-smooth">
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Contact />
        </div>

        {/* Blur the bottom of this specific container (fixed in place) */}
        <GradualBlur
          target="parent"
          position="bottom"
          height="6rem"
          strength={0.9}
          divCount={4}
          curve="bezier"
          exponential={true}
          opacity={0.7}
         
        />
      </div>

      {/* Floating elements remain completely outside */}
      <div className="hidden md:block">
        <FloatingDock />
      </div>
    </main>
  );
}
