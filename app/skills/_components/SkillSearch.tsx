import { useId } from "react";
import { FiSearch, FiX } from "react-icons/fi";

interface SkillSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SkillSearch({ value, onChange }: SkillSearchProps) {
  const inputId = useId();

  return (
    <div className="relative w-full lg:w-80">
      <label htmlFor={inputId} className="sr-only">
        Search skills
      </label>
      <FiSearch aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
      <input
        id={inputId}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search skills…"
        autoComplete="off"
        spellCheck={false}
        className="min-h-11 w-full rounded-full border border-border-strong bg-surface-tint pl-11 pr-11 text-base font-medium text-white
                   placeholder:text-white/40 transition-colors duration-200 focus:border-accent focus:outline-none
                   focus-visible:ring-2 focus-visible:ring-accent/40 sm:text-sm
                   [&::-webkit-search-cancel-button]:appearance-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-white/50
                     transition-colors hover:bg-surface-tint-hover hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <FiX aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
