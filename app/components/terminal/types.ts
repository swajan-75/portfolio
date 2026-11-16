import type { Profile } from "@/app/hooks/useProfile";
import type { Theme } from "@/app/hooks/useTheme";
import type { Project } from "@/app/projects/_components/projectModel";
import type { FsDir } from "./filesystem";

/** Color roles, mapped to a fixed terminal palette (the window is dark in both site themes). */
export type Tone =
  | "default"
  | "muted"
  | "dir"
  | "exec"
  | "accent"
  | "key"
  | "error"
  | "success"
  | "heading";

export interface Segment {
  text: string;
  tone?: Tone;
  href?: string;
  /** Raw color, for swatches only; everything else uses a tone. */
  color?: string;
}

export type Line = Segment[];

export interface PortfolioData {
  profile: Profile | null;
  projects: Project[];
  cvUrl: string | null;
  isLoading: boolean;
}

export interface ShellActions {
  clear: () => void;
  close: () => void;
  openUrl: (url: string) => void;
  navigate: (section: string) => void;
  setTheme: (theme: Theme) => void;
  theme: Theme;
}

export interface ShellContext {
  cwd: string;
  setCwd: (path: string) => void;
  previousCwd: string;
  fs: FsDir;
  data: PortfolioData;
  history: readonly string[];
  actions: ShellActions;
}

export type CommandResult = Line[] | void;

export type CommandGroup = "Portfolio" | "Navigation" | "Files" | "System" | "Utilities";

export interface Command {
  name: string;
  summary: string;
  usage?: string;
  group: CommandGroup;
  /** Works when typed, but stays out of `help`. */
  hidden?: boolean;
  run: (args: string[], ctx: ShellContext) => CommandResult | Promise<CommandResult>;
  /** Candidates for the argument being typed; falls back to file paths when absent. */
  complete?: (args: string[], ctx: ShellContext) => string[];
}
