import { BASE, currentPath, linkProps, navigate } from "../router";
import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="header">
      <div className="container header__inner">
        <a className="header__brand" {...linkProps("/")} aria-label="Catch yourself. Not the flu. Home">
          <Logo />
        </a>
        <a
          className="btn btn--small"
          href={`${BASE}/#find`}
          onClick={(e) => {
            e.preventDefault();
            if (currentPath() !== "/") navigate("/");
            requestAnimationFrame(() => document.getElementById("find")?.scrollIntoView({ behavior: "smooth" }));
          }}
        >
          Find a flu jab
        </a>
      </div>
    </header>
  );
}
