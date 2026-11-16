/**
 * Scrolls to a home-page section, or navigates home to it when the section
 * isn't on the current page (e.g. clicking "Skills" in the dock on /projects).
 */
export function navigateToSection(sectionId: string, push: (href: string) => void): void {
  const target = document.getElementById(sectionId);
  if (target) {
    target.scrollIntoView({ behavior: "smooth" });
    return;
  }
  push(`/#${sectionId}`);
}
