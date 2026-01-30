import Hero from "./components/Hero";
import Skills from "./components/Skills";
import FloatingDock from "./components/FloatingDock";
import Projects from "./components/Projects";
import About from "./components/About";
import Contact from "./components/Contact";

export default function Home() {
  return (
   <>
   <Hero />
   <About/>
   <Skills />
   <FloatingDock />
   <Projects />
   
   <Contact />
   </>
  );
}
