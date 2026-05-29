"use client";
import RotatingText from './RotatingText';

const texts = [
  "components!",             
  "apps!",      
  "websites!",    
  "APIs!",       
  "solutions!"     
];

export default function TerminalText() {
  return (
    <div className="font-sans text-white text-2xl sm:text-4xl md:text-5xl font-bold mt-2 h-[48px] sm:h-[56px] flex items-center justify-center w-full">
      <div className="flex items-center justify-center whitespace-nowrap flex-nowrap">
        <span className="mr-3">Creative</span>
        
        <RotatingText
          texts={texts}
          mainClassName="px-2 sm:px-3 bg-purple-500 text-white overflow-hidden py-0.5 sm:py-1 rounded-lg"
          staggerFrom={"last"}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-120%" }}
          staggerDuration={0.025}
          splitLevelClassName="overflow-hidden"
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          rotationInterval={3000}
          animatePresenceMode="popLayout"
        />
      </div>
    </div>
  );
}
