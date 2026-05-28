import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClickSpark from "./components/ClickSpark";
import { Keyboard } from "@/components/ui/keyboard";
import HyperspeedWrapper from "./components/HyperspeedWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Swajan Barua",
  description: "Full Stack Developer",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased text-white`}>
  
  {/* Layer 1 — WebGL background, isolated layer */}
  <div className="fixed inset-0 -z-10 bg-black">
    <HyperspeedWrapper />
  </div>

  {/* Layer 2 — content, must be isolated with isolation-isolate */}
  <div style={{ isolation: 'isolate', position: 'relative' }}>
    <ClickSpark sparkColor="#ffffff" sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
      {children}
      
      {/* Global typing sounds and animated preview without the physical keypad */}
      <Keyboard 
        enableSound={true} 
        showPreview={true} 
        showKeypad={false} 
        className="fixed top-24 inset-x-0 z-[99999] pointer-events-none flex justify-center" 
      />
    </ClickSpark>
  </div>

</body>
    </html>
  );
}