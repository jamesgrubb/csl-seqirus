import { useEffect, useState } from "react";

// Minimal history-based router: "/" and "/watch/:slug". Pages serves index.html for unknown paths.
// Everything under /edit is the same site in edit mode; links keep the /edit prefix.
export type Route = { name: "home" } | { name: "watch"; slug: string };

export const BASE = location.pathname === "/edit" || location.pathname.startsWith("/edit/") ? "/edit" : "";

/** Current path without the /edit prefix. */
export const currentPath = () => location.pathname.slice(BASE.length) || "/";

function parse(path: string): Route {
  const watch = path.match(/^\/watch\/([^/]+)\/?$/);
  return watch ? { name: "watch", slug: decodeURIComponent(watch[1]) } : { name: "home" };
}

export function navigate(to: string) {
  history.pushState(null, "", BASE + to);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
}

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parse(currentPath()));
  useEffect(() => {
    const onPop = () => setRoute(parse(currentPath()));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  return route;
}

/** Props for an <a> that navigates client-side but still works with cmd-click / new tab. */
export function linkProps(href: string) {
  return {
    href: BASE + href,
    onClick: (e: React.MouseEvent) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      navigate(href);
    },
  };
}
