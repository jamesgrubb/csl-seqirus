import { EditableText } from "../edit";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__top">
        <div className="footer__brand">
          <Logo />
          <EditableText as="p" className="footer__campaign" contentKey="footer.campaign" label="Campaign line" />
        </div>
        <div className="footer__source" id="source">
          <h3>About the research</h3>
          <EditableText as="p" contentKey="footer.source" label="Research note" multiline />
        </div>
      </div>
      <div className="footer__legal">
        <div className="container footer__legal-inner">
          <nav aria-label="Legal">
            <a href="#">Privacy Statement</a>
            <a href="#">Terms of Use</a>
            <a href="#">Cookie Policy</a>
            <a href="#">Accessibility</a>
          </nav>
          <p>© {new Date().getFullYear()} Seqirus UK Limited or its affiliates. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
