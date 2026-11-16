"use client";
import { usePathname } from "next/navigation";
import MobileMenu from "./MobileMenu";
import FloatingDock from "./FloatingDock";

/** Site-wide navigation (dock on desktop, drawer on mobile). Hidden in the admin area. */
export default function SiteNav() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <MobileMenu />
      <div className="hidden md:block">
        <FloatingDock />
      </div>
    </>
  );
}
