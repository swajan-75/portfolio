import MobileMenu from "./components/MobileMenu";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import FloatingDock from "./components/FloatingDock";
import Projects from "./components/Projects";
import About from "./components/About";
import Contact from "./components/Contact";
import AIChat from "./components/AIChat";
import AnalyticsTracker from "./components/Tracker";

export default function Home() {
  return (
   <main>
     <AnalyticsTracker />
     <MobileMenu />
     <Hero />
     <About/>
     <Skills />
     <div className="hidden md:block">
       <FloatingDock />
     </div>
     <Projects />
     <Contact />
     <AIChat />
   </main>
  );
}
