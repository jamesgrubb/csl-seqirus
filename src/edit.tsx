import { createContext, useContext, useState } from "react";
import type { SiteContent, VideoPatch } from "../shared/types";

// Fallback copy for when a content key is missing from the database (matches migrations/0004_campaign.sql).
const DEFAULT_CONTENT: SiteContent = {
  "hero.title": "Catch yourself. Not the flu.",
  "intro.text":
    "“It’s only flu”, “I’ll be fine” “it’s on my list” “I’ll book my flu jab later” – a few familiar words can be all it takes for your flu jab to slip down the list. Next time you hear yourself saying one of them, take a moment to catch yourself and act now.",
  "familiar.title": "Sound familiar?",
  "stats.title": "If that sounds like you, you’ve got company.",
  "stats.1.figure": "13%",
  "stats.1.text": "of adults in Britain said they intended to get a flu jab that winter but hadn’t had it done yet.",
  "stats.group": "Among those who said they probably wouldn’t get one:",
  "stats.2.figure": "17%",
  "stats.2.text": "said they hadn’t got round to it.",
  "stats.3.figure": "35%",
  "stats.3.text": "said they were generally healthy and rarely ill.",
  "report.title": "See our full campaign report",
  "southbank.title": "Catch yourself on the South Bank",
  "map.title": "Find a flu jab service near you to book your flu jab.",
  "close.text": "You’ve caught yourself saying it. Now put a date in the diary and get your flu jab.",
  "close.signoff": "Great catch.",
  "footer.campaign": "A campaign from CSL Seqirus.",
  "footer.source":
    "Research by YouGov for Spectrum Science. Online survey of 2,102 adults in Great Britain, 24–25 November 2026, weighted to represent GB adults aged 18+.",
};

export interface EditContextValue {
  /** Signed-in editor's email, or null when viewing the public site. */
  editor: string | null;
  content: SiteContent;
  saveContent: (key: string, value: string) => Promise<void>;
  saveVideo: (slug: string, patch: VideoPatch) => Promise<void>;
}

export const EditContext = createContext<EditContextValue>({
  editor: null,
  content: DEFAULT_CONTENT,
  saveContent: async () => {},
  saveVideo: async () => {},
});

export const useEdit = () => useContext(EditContext);

export function useText(key: string): string {
  const { content } = useEdit();
  return content[key] ?? DEFAULT_CONTENT[key] ?? "";
}

export const withDefaults = (content: SiteContent): SiteContent => ({ ...DEFAULT_CONTENT, ...content });

type Tag = "h1" | "h2" | "h3" | "p" | "span";
type Status = "idle" | "saving" | "saved" | "error";

interface EditableProps {
  as?: Tag;
  value: string;
  onSave: (value: string) => Promise<void>;
  label: string;
  className?: string;
  multiline?: boolean;
}

/**
 * Text that is plain on the public site and click-to-edit in edit mode.
 * Saves on blur; Enter saves single-line fields, Escape reverts.
 */
export function Editable({ as: Tag = "span", value, onSave, label, className = "", multiline = false }: EditableProps) {
  const { editor } = useEdit();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  if (!editor) return <Tag className={className}>{value}</Tag>;

  return (
    <Tag
      className={`${className} editable editable--${status}`}
      contentEditable="plaintext-only"
      suppressContentEditableWarning
      spellCheck
      role="textbox"
      aria-multiline={multiline}
      aria-label={`Edit ${label}`}
      data-label={status === "error" ? `Couldn't save: ${error}` : status === "saving" ? "Saving…" : status === "saved" ? "Saved" : label}
      onKeyDown={(e) => {
        const el = e.currentTarget;
        if (e.key === "Enter" && !multiline) {
          e.preventDefault();
          el.blur();
        } else if (e.key === "Escape") {
          el.innerText = value;
          el.blur();
        }
      }}
      onBlur={async (e) => {
        const el = e.currentTarget;
        const next = el.innerText.replace(/\s+\n/g, "\n").trim();
        if (next === value) return;
        if (!next) {
          el.innerText = value;
          return;
        }
        setStatus("saving");
        try {
          await onSave(next);
          setStatus("saved");
          setTimeout(() => setStatus((s) => (s === "saved" ? "idle" : s)), 2000);
        } catch (err) {
          setError((err as Error).message);
          setStatus("error");
        }
      }}
    >
      {value}
    </Tag>
  );
}

/** Editable bound to a site content key. */
export function EditableText(props: Omit<EditableProps, "value" | "onSave"> & { contentKey: string }) {
  const { saveContent } = useEdit();
  const value = useText(props.contentKey);
  return <Editable {...props} value={value} onSave={(v) => saveContent(props.contentKey, v)} />;
}
