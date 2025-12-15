-- Drop the foreign key constraint on developers to allow demo data
ALTER TABLE public.developers DROP CONSTRAINT IF EXISTS developers_user_id_fkey;

-- Create demo developer without profile reference
INSERT INTO public.developers (id, user_id, company_name, website, bio, support_email, is_verified)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Demo Apps',
  'https://pwastore.app',
  'Official demo apps for testing the PWA Store.',
  'demo@pwastore.app',
  true
)
ON CONFLICT (id) DO NOTHING;

-- Insert demo apps
INSERT INTO public.apps (developer_id, name, slug, tagline, description, icon_url, website_url, category_id, tags, status, is_featured, pwa_offline, pwa_push_notifications, pwa_installable, view_count, install_count)
SELECT 
  '00000000-0000-0000-0000-000000000001'::uuid,
  app_data.name,
  app_data.slug,
  app_data.tagline,
  app_data.description,
  app_data.icon_url,
  app_data.website_url,
  c.id,
  app_data.tags,
  'published'::app_status,
  app_data.is_featured,
  app_data.pwa_offline,
  app_data.pwa_push,
  app_data.pwa_installable,
  app_data.view_count,
  app_data.install_count
FROM (
  VALUES
    ('Notion', 'notion', 'All-in-one workspace', 'Write, plan, and get organized in one place. Notion is the connected workspace where better, faster work happens.', 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png', 'https://notion.so', 'Productivity', ARRAY['notes', 'workspace', 'collaboration'], true, true, true, true, 45230, 12500),
    ('Spotify', 'spotify', 'Music for everyone', 'Listen to millions of songs and podcasts. Discover new music, create playlists, and enjoy your favorite artists.', 'https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg', 'https://spotify.com', 'Entertainment', ARRAY['music', 'streaming', 'podcasts'], true, true, true, true, 89450, 34200),
    ('Figma', 'figma', 'Design together', 'The collaborative interface design tool. Create, prototype, and gather feedback all in one place.', 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg', 'https://figma.com', 'Productivity', ARRAY['design', 'collaboration', 'prototyping'], true, true, false, true, 32100, 8900),
    ('Discord', 'discord', 'Your place to talk', 'Chat, hang out, and stay close with your friends and communities.', 'https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a69f118df70ad7828d4_icon_clyde_blurple_RGB.svg', 'https://discord.com', 'Social', ARRAY['chat', 'voice', 'gaming'], true, true, true, true, 67800, 28900),
    ('Excalidraw', 'excalidraw', 'Virtual whiteboard', 'A simple and intuitive virtual whiteboard for sketching diagrams.', 'https://excalidraw.com/apple-touch-icon.png', 'https://excalidraw.com', 'Productivity', ARRAY['whiteboard', 'drawing'], false, true, false, true, 18900, 5600),
    ('Duolingo', 'duolingo', 'Learn a language free', 'The worlds best way to learn a language. Fun and effective.', 'https://www.duolingo.com/images/facebook/duo200_rounded.png', 'https://duolingo.com', 'Education', ARRAY['language', 'learning'], true, true, true, true, 54300, 21000),
    ('Todoist', 'todoist', 'Organize work and life', 'Get tasks out of your head and onto your to-do list.', 'https://todoist.com/static/favicon.ico', 'https://todoist.com', 'Productivity', ARRAY['tasks', 'productivity'], false, true, true, true, 28700, 9800),
    ('Chess.com', 'chess-com', 'Play chess online', 'Play chess online for free with millions of players.', 'https://www.chess.com/bundles/web/images/logo-chess-com.png', 'https://chess.com', 'Games', ARRAY['chess', 'strategy'], false, true, true, true, 41200, 15600),
    ('Canva', 'canva', 'Design anything', 'Create stunning graphics and presentations with ease.', 'https://static.canva.com/static/images/favicon-1.ico', 'https://canva.com', 'Productivity', ARRAY['design', 'graphics'], true, true, false, true, 38900, 14200),
    ('Slack', 'slack', 'Where work happens', 'Bring the right people, information, and tools together.', 'https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png', 'https://slack.com', 'Business', ARRAY['communication', 'work'], false, true, true, true, 52100, 19800),
    ('Strava', 'strava', 'Network for athletes', 'Track your running, cycling, and other activities.', 'https://d3nn82uuj53iqq.cloudfront.net/assets/strava-logo.png', 'https://strava.com', 'Lifestyle', ARRAY['fitness', 'running'], false, true, true, true, 29400, 11200),
    ('Habitica', 'habitica', 'Gamify your life', 'Turn your habits and tasks into a role-playing game.', 'https://habitica.com/static/img/home-main.png', 'https://habitica.com', 'Lifestyle', ARRAY['habits', 'gamification'], false, true, true, true, 15600, 4800)
) AS app_data(name, slug, tagline, description, icon_url, website_url, category_name, tags, is_featured, pwa_offline, pwa_push, pwa_installable, view_count, install_count)
JOIN public.categories c ON c.name = app_data.category_name
ON CONFLICT (slug) DO NOTHING;

-- Re-add the foreign key constraint
ALTER TABLE public.developers ADD CONSTRAINT developers_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE NOT VALID;