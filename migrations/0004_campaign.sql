-- The site becomes a single "Catch yourself. Not the flu." campaign page.
-- The placeholder library videos are unpublished (kept, not deleted) and two talking-head clips added.
UPDATE videos SET published = 0, featured = 0
WHERE slug IN ('flu-season-explained', 'inside-cell-based-production', 'ready-for-the-next-pandemic',
               'meet-the-scientists', 'strain-selection', 'quality-at-every-step');

INSERT OR IGNORE INTO videos (slug, title, summary, description, category, video_key, featured) VALUES
  ('talking-head-1', 'Talking head 1', 'Quote TBD once clip received',
   'Placeholder description. Replace once the clip is received.', 'people', 'videos/talking-head-1.mp4', 1),
  ('talking-head-2', 'Talking head 2', 'Quote TBD once clip received',
   'Placeholder description. Replace once the clip is received.', 'people', 'videos/talking-head-2.mp4', 0);

-- Page copy from "CSL campaign web page 2.docx".
INSERT OR IGNORE INTO content (key, value) VALUES
  ('hero.title',        'Catch yourself. Not the flu.'),
  ('intro.text',        '“It’s only flu”, “I’ll be fine” “it’s on my list” “I’ll book my flu jab later” – a few familiar words can be all it takes for your flu jab to slip down the list. Next time you hear yourself saying one of them, take a moment to catch yourself and act now.'),
  ('familiar.title',    'Sound familiar?'),
  ('stats.title',       'If that sounds like you, you’ve got company.'),
  ('stats.1.figure',    '13%'),
  ('stats.1.text',      'of adults in Britain said they intended to get a flu jab that winter but hadn’t had it done yet.'),
  ('stats.group',       'Among those who said they probably wouldn’t get one:'),
  ('stats.2.figure',    '17%'),
  ('stats.2.text',      'said they hadn’t got round to it.'),
  ('stats.3.figure',    '35%'),
  ('stats.3.text',      'said they were generally healthy and rarely ill.'),
  ('report.title',      'See our full campaign report'),
  ('southbank.title',   'Catch yourself on the South Bank'),
  ('map.title',         'Find a flu jab service near you to book your flu jab.'),
  ('close.text',        'You’ve caught yourself saying it. Now put a date in the diary and get your flu jab.'),
  ('close.signoff',     'Great catch.'),
  ('footer.campaign',   'A campaign from CSL Seqirus.'),
  ('footer.source',     'Research by YouGov for Spectrum Science. Online survey of 2,102 adults in Great Britain, 24–25 November 2026, weighted to represent GB adults aged 18+.');
