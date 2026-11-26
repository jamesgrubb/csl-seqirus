import { useEffect, useMemo, useState } from "react";
import type { SiteContent, VideoListResponse } from "../shared/types";
import { fetchContent, fetchEditor, fetchVideos, saveContent, saveVideo } from "./api";
import { EditContext, withDefaults, type EditContextValue } from "./edit";
import { BASE, useRoute } from "./router";
import { EditBar } from "./components/EditBar";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { CampaignPage } from "./components/CampaignPage";
import { WatchPage } from "./components/WatchPage";

const EDIT_MODE = BASE === "/edit";

export function App() {
  const route = useRoute();
  const [data, setData] = useState<VideoListResponse | null>(null);
  const [content, setContent] = useState<SiteContent>(() => withDefaults({}));
  const [editor, setEditor] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    fetchVideos().then(setData, () => setData({ videos: [], categories: [] }));
    fetchContent().then((c) => setContent(withDefaults(c)), () => {});
    if (EDIT_MODE) {
      fetchEditor().then(
        (me) => setEditor(me.email),
        () => setEditError("You're not signed in as an editor. Ask the site owner to add your email address."),
      );
    }
  }, []);

  const edit = useMemo<EditContextValue>(
    () => ({
      editor,
      content,
      saveContent: async (key, value) => {
        const saved = await saveContent(key, value);
        setContent((c) => ({ ...c, [saved.key]: saved.value }));
      },
      saveVideo: async (slug, patch) => {
        const updated = await saveVideo(slug, patch);
        setData((d) =>
          d && {
            ...d,
            videos: d.videos.map((v) =>
              v.slug === slug ? updated : patch.featured ? { ...v, featured: false } : v,
            ),
          },
        );
      },
    }),
    [editor, content],
  );

  return (
    <EditContext.Provider value={edit}>
      <Header />
      <main>
        {route.name === "watch" ? (
          <WatchPage slug={route.slug} library={data} />
        ) : (
          <CampaignPage data={data} />
        )}
      </main>
      <Footer />
      {EDIT_MODE && <EditBar editor={editor} error={editError} />}
    </EditContext.Provider>
  );
}
