-- Placeholder content so the UI has something to render. Replace with real titles/files.
INSERT OR IGNORE INTO categories (slug, name, sort_order) VALUES
  ('science',       'Science',        1),
  ('manufacturing', 'Manufacturing',  2),
  ('preparedness',  'Preparedness',   3),
  ('people',        'Our people',     4);

INSERT OR IGNORE INTO videos (slug, title, summary, description, category, video_key, duration_seconds, featured) VALUES
  ('flu-season-explained', 'The flu season, explained',
   'Why influenza returns every year and how vaccine strains are selected.',
   'Placeholder description. Replace with the approved copy for this video.',
   'science', 'videos/flu-season-explained.mp4', 214, 1),
  ('inside-cell-based-production', 'Inside cell-based production',
   'A look behind the scenes at how vaccines are produced at scale.',
   'Placeholder description. Replace with the approved copy for this video.',
   'manufacturing', 'videos/inside-cell-based-production.mp4', 342, 0),
  ('ready-for-the-next-pandemic', 'Ready for the next pandemic',
   'How partnerships with governments support pandemic preparedness.',
   'Placeholder description. Replace with the approved copy for this video.',
   'preparedness', 'videos/ready-for-the-next-pandemic.mp4', 276, 0),
  ('meet-the-scientists', 'Meet the scientists',
   'The people working every day to protect communities from influenza.',
   'Placeholder description. Replace with the approved copy for this video.',
   'people', 'videos/meet-the-scientists.mp4', 188, 0),
  ('strain-selection', 'From surveillance to strain selection',
   'Following the journey from global surveillance data to a new season''s vaccine.',
   'Placeholder description. Replace with the approved copy for this video.',
   'science', 'videos/strain-selection.mp4', 301, 0),
  ('quality-at-every-step', 'Quality at every step',
   'The testing and release process that every batch goes through.',
   'Placeholder description. Replace with the approved copy for this video.',
   'manufacturing', 'videos/quality-at-every-step.mp4', 245, 0);
