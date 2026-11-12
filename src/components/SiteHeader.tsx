import { Link } from "@tanstack/react-router";

const linkCls = "text-sm text-muted-foreground hover:text-foreground transition-colors";
const activeCls = { className: "text-sm text-foreground font-semibold" };

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-2xl text-primary">OneLastConversion</Link>
        <nav className="flex items-center gap-6">
          <Link to="/" className={linkCls} activeProps={activeCls} activeOptions={{ exact: true }}>Home</Link>
          <Link to="/boundaries" className={linkCls} activeProps={activeCls}>Boundary settings</Link>
          <Link to="/help" className={linkCls} activeProps={activeCls}>Help</Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-muted-foreground">
        © 2026 OneLastConversion · A demo concept. Nothing on this site communicates with anyone who has passed away.
      </div>
    </footer>
  );
}
