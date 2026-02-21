import Hero from "./components/Hero";
import Skills from "./components/Skills";
import FloatingDock from "./components/FloatingDock";
import Projects from "./components/Projects";
import About from "./components/About";
import Contact from "./components/Contact";
import ThemeToggle from "./components/ThemeToggle";

export default function Home() {
  return (
   <>
   <ThemeToggle />
   <Hero />
   <About/>
   <Skills />
   <FloatingDock />
   <Projects />
   
   <Contact />
   </>
  );
}
