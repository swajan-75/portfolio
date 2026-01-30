"use client";
import { useEffect, useState } from "react";

const texts = [
  "Building Android apps...",             
  "Designing scalable REST APIs...",      
  "Developing full-stack websites...",    
  "Architecting secure systems...",       
  "Solving algorithmic challenges..."     
];

export default function TerminalText() {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[index];

    if (!deleting && subIndex < current.length) {
      setTimeout(() => {
        setText(current.substring(0, subIndex + 1));
        setSubIndex(subIndex + 1);
      }, 80);
    } 
    else if (deleting && subIndex > 0) {
      setTimeout(() => {
        setText(current.substring(0, subIndex - 1));
        setSubIndex(subIndex - 1);
      }, 50);
    }
    else if (!deleting && subIndex === current.length) {
      setTimeout(() => setDeleting(true), 1200);
    }
    else if (deleting && subIndex === 0) {
      setDeleting(false);
      setIndex((index + 1) % texts.length);
    }
  }, [subIndex, index, deleting]);

  return (
    <div className="font-mono text-purple-400 text-lg mt-6">
      <span>$ </span>
      {text}
      <span className="animate-pulse">▋</span>
    </div>
  );
}
