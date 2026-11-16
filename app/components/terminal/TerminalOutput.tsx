import { memo } from "react";
import { displayPath } from "./filesystem";
import type { Entry } from "./useShell";
import type { Line, Segment, Tone } from "./types";

/** Fixed palette: the terminal stays dark whichever site theme is active. */
const TONE_CLASS: Record<Tone, string> = {
  default: "text-[#d7dae0]",
  muted: "text-[#7d8590]",
  dir: "font-semibold text-[#61afef]",
  exec: "text-[#98c379]",
  accent: "text-[#c678dd]",
  key: "text-[#e5c07b]",
  error: "text-[#f47067]",
  success: "text-[#57d68d]",
  heading: "font-semibold text-[#f0f2f5]",
};

export function PromptLabel({ cwd }: { cwd: string }) {
  return (
    <span className="shrink-0 select-none whitespace-pre">
      <span className="font-semibold text-[#98c379]">guest@swajan</span>{" "}
      <span className="font-semibold text-[#61afef]">{displayPath(cwd)}</span>
      <span className="text-[#d7dae0]"> % </span>
    </span>
  );
}

function SegmentView({ segment }: { segment: Segment }) {
  const toneClass = segment.color ? "" : TONE_CLASS[segment.tone ?? "default"];
  const style = segment.color ? { color: segment.color } : undefined;
  if (!segment.href) {
    return (
      <span className={toneClass} style={style}>
        {segment.text}
      </span>
    );
  }
  const isMail = segment.href.startsWith("mailto:");
  return (
    <a
      href={segment.href}
      target={isMail ? undefined : "_blank"}
      rel={isMail ? undefined : "noopener noreferrer"}
      className={`${toneClass} underline decoration-[#61afef]/40 underline-offset-2 hover:decoration-[#61afef] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#61afef]`}
    >
      {segment.text}
    </a>
  );
}

function LineView({ line }: { line: Line }) {
  // A non-breaking space keeps empty lines at full height.
  if (!line.length) return <div>{" "}</div>;
  return (
    <div className="whitespace-pre-wrap break-words">
      {line.map((segment, i) => (
        <SegmentView key={i} segment={segment} />
      ))}
    </div>
  );
}

function EntryView({ entry }: { entry: Entry }) {
  if (entry.kind === "line") return <LineView line={entry.line} />;
  return (
    <div className="flex flex-wrap whitespace-pre-wrap break-all">
      <PromptLabel cwd={entry.cwd} />
      <span className="text-[#d7dae0]">{entry.input}</span>
      {entry.isInterrupted && <span className="text-[#7d8590]">^C</span>}
    </div>
  );
}

/** Past output never changes, so entries skip re-rendering while the visitor types. */
const TerminalOutput = memo(function TerminalOutput({ entries }: { entries: Entry[] }) {
  return (
    <>
      {entries.map((entry) => (
        <EntryView key={entry.id} entry={entry} />
      ))}
    </>
  );
});

export default TerminalOutput;
