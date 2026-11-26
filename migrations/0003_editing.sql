-- Editable page copy (key/value) plus an audit log of every change made in edit mode.
CREATE TABLE IF NOT EXISTS content (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL,
  updated_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_by  TEXT
);

CREATE TABLE IF NOT EXISTS edits (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  at         TEXT NOT NULL DEFAULT (datetime('now')),
  editor     TEXT NOT NULL,
  entity     TEXT NOT NULL,          -- 'content' | 'video'
  entity_id  TEXT NOT NULL,          -- content key or video slug
  field      TEXT NOT NULL,
  old_value  TEXT,
  new_value  TEXT
);

ALTER TABLE videos ADD COLUMN updated_at TEXT;
ALTER TABLE videos ADD COLUMN updated_by TEXT;

INSERT OR IGNORE INTO content (key, value) VALUES
  ('home.hero.eyebrow',      'Featured video'),
  ('home.statement.title',   'We''re committed to the fight against influenza'),
  ('home.statement.text',    'Explore films from our scientists, manufacturing teams and partners, from global surveillance and strain selection to the people who help protect millions every flu season.'),
  ('home.library.title',     'Video library'),
  ('footer.tagline',         'A world leader in influenza vaccines, part of CSL.');
