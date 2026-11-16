/**
 * Bento layout shared by the projects and skills pages
 * (1 col → 2 cols at sm → 3 cols at lg).
 *
 * At lg, cards follow a repeating wide/narrow rhythm so rows read as
 * "big + small, small + big". A wide card that doesn't fit the space left
 * in its row shrinks, and the last card always stretches to fill its row,
 * so the grid never ends with a gap — whatever a filter leaves visible.
 */

export type LgSpan = 1 | 2 | 3;

export interface CardLayout {
  lgSpan: LgSpan;
  /** Spans both columns at the sm breakpoint (the odd card out at the end). */
  smFull: boolean;
}

const LG_COLUMNS = 3;
const WIDE_RHYTHM = [true, false, false, true, false, true];

export function computeLayouts(count: number): CardLayout[] {
  const layouts: CardLayout[] = [];
  let usedInRow = 0;

  for (let i = 0; i < count; i += 1) {
    const remaining = LG_COLUMNS - usedInRow;
    const isLast = i === count - 1;
    const preferred = WIDE_RHYTHM[i % WIDE_RHYTHM.length] ? 2 : 1;
    const span = (isLast ? remaining : Math.min(preferred, remaining)) as LgSpan;

    layouts.push({ lgSpan: span, smFull: isLast && count % 2 === 1 });
    usedInRow = (usedInRow + span) % LG_COLUMNS;
  }

  return layouts;
}

const LG_SPAN_CLASS: Record<LgSpan, string> = {
  1: "lg:col-span-1",
  2: "lg:col-span-2",
  3: "lg:col-span-3",
};

/** Grid-item span classes, written out in full so Tailwind can see them. */
export function bentoItemClass(layout: CardLayout): string {
  return [layout.smFull ? "sm:col-span-2" : "", LG_SPAN_CLASS[layout.lgSpan]].join(" ");
}
