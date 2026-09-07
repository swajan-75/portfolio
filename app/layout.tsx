import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Applies a saved theme choice before hydration so light-mode
            visitors never see a flash of the dark default. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(localStorage.getItem('theme')==='light'){document.documentElement.setAttribute('data-theme','light')}}catch(e){}",
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased text-white bg-bg`}>

  {/* Layer 1 — flat dark background with ambient gradient orbs */}
  <div className="fixed inset-0 -z-10 bg-bg overflow-hidden">
    <div className="bg-orb w-[600px] h-[600px] -top-40 -left-20 opacity-30" style={{ background: "radial-gradient(circle, rgba(108,92,231,0.55) 0%, rgba(108,92,231,0) 70%)" }} />
    <div className="bg-orb w-[500px] h-[500px] top-1/3 -right-32 opacity-25" style={{ background: "radial-gradient(circle, rgba(142,247,212,0.45) 0%, rgba(142,247,212,0) 70%)" }} />
    <div className="bg-orb w-[500px] h-[500px] bottom-0 left-1/4 opacity-20" style={{ background: "radial-gradient(circle, rgba(108,92,231,0.45) 0%, rgba(108,92,231,0) 70%)" }} />
  </div>

  {/* Layer 2 — content, must be isolated with isolation-isolate */}
  <div style={{ isolation: 'isolate', position: 'relative' }}>
    {children}
  </div>

</body>
    </html>
  );
}