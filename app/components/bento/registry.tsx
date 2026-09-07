import type { ComponentType } from "react";
import {
  IntroCard,
  PhotoCard,
  AboutCard,
  StatsCard,
  EducationCard,
  ResumeCard,
} from "./cards/ProfileCards";
import { SkillsCard, HighlightsCard } from "./cards/WorkCards";
import { ProjectsCard } from "./cards/ProjectsCard";
import { ContactCard } from "./cards/ConnectCards";
import { InstagramFacebookCard, LinkedinGithubCard, EmailCard } from "./cards/SocialTileCards";

export interface BentoCardDef {
  /** Doubles as the DOM id, so existing #hero/#about/#projects anchors keep working. */
  id: string;
  label: string;
  colSpan: number;
  /** Rows to span on the desktop grid; omit for the default of 1. */
  rowSpan?: number;
  Component: ComponentType;
}

/**
 * Every card is pinned to exactly one of these four fixed box shapes.
 * Paired with the grid's fixed `auto-rows` track height, this guarantees a
 * card's on-screen size depends only on which tier it's assigned — never on
 * its neighbors or where it lands after a drag reorder — and that gaps
 * between rows are always the same, regardless of how much content a card
 * happens to hold (overflow scrolls inside the card instead of resizing it).
 */
const SIZES = {
  small: { colSpan: 1 }, // 1x1 square
  wide: { colSpan: 2 }, // 2x1 wide
  tall: { colSpan: 1, rowSpan: 2 }, // 1x2 tall
  large: { colSpan: 2, rowSpan: 2 }, // 2x2 large
} as const;

export const BENTO_CARDS: BentoCardDef[] = [
  { id: "photo", label: "Photo", ...SIZES.small, Component: PhotoCard },
  { id: "hero", label: "Intro", ...SIZES.wide, Component: IntroCard },
  { id: "about", label: "About", ...SIZES.tall, Component: AboutCard },
  { id: "stats", label: "Stats", ...SIZES.small, Component: StatsCard },
  { id: "education", label: "Education", ...SIZES.small, Component: EducationCard },
  { id: "resume", label: "Resume", ...SIZES.small, Component: ResumeCard },
  { id: "skills", label: "Skills", ...SIZES.tall, Component: SkillsCard },
  { id: "highlights", label: "Achievement", ...SIZES.wide, Component: HighlightsCard },
  { id: "social-instagram-facebook", label: "Instagram & Facebook", ...SIZES.small, Component: InstagramFacebookCard },
  { id: "social-linkedin-github", label: "LinkedIn & GitHub", ...SIZES.small, Component: LinkedinGithubCard },
  { id: "projects", label: "Projects", ...SIZES.wide, Component: ProjectsCard },
  { id: "contact", label: "Contact", ...SIZES.small, Component: ContactCard },
  { id: "social-email", label: "Email", ...SIZES.small, Component: EmailCard },
];

export const DEFAULT_ORDER: string[] = BENTO_CARDS.map((card) => card.id);

export const CARD_BY_ID: Record<string, BentoCardDef> = Object.fromEntries(
  BENTO_CARDS.map((card) => [card.id, card]),
);
