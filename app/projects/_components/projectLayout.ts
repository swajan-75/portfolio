import { bentoItemClass, type CardLayout } from "@/app/lib/bentoLayout";

export { computeLayouts, type CardLayout, type LgSpan } from "@/app/lib/bentoLayout";

/** Every card's layout while the grid sits beside the details panel. */
export const SINGLE_COLUMN_LAYOUT: CardLayout = { lgSpan: 1, smFull: false };

/** Literal class strings (Tailwind can only see classes written out in full). */
export function layoutClasses(layout: CardLayout) {
  const isLgRow = layout.lgSpan > 1;

  return {
    isWide: isLgRow,
    item: bentoItemClass(layout),
    card: [
      "flex-col",
      layout.smFull ? "sm:flex-row" : "",
      isLgRow ? "lg:flex-row" : "lg:flex-col",
    ].join(" "),
    cover: [
      "aspect-video w-full",
      layout.smFull ? "sm:aspect-auto sm:w-[45%] sm:min-h-[280px]" : "",
      isLgRow
        ? "lg:aspect-auto lg:w-[46%] lg:min-h-[320px]"
        : "lg:aspect-video lg:w-full lg:min-h-0",
    ].join(" "),
  };
}
