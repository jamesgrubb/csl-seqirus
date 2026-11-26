import { currentPath } from "../router";

interface Props {
  editor: string | null;
  error: string | null;
}

export function EditBar({ editor, error }: Props) {
  return (
    <div className={`edit-bar${error ? " edit-bar--error" : ""}`} role="status">
      <div className="container edit-bar__inner">
        {error ? (
          <span>
            <strong>Edit mode unavailable.</strong> {error}
          </span>
        ) : editor ? (
          <span>
            <strong>Edit mode</strong> · {editor} · Click any outlined text to change it. It saves when you click away.
          </span>
        ) : (
          <span>Checking your sign-in…</span>
        )}
        <a className="edit-bar__exit" href={currentPath()}>
          View live site
        </a>
      </div>
    </div>
  );
}
