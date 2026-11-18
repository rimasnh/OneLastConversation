import { Link } from "@tanstack/react-router";

const linkCls = "text-sm text-muted-foreground hover:text-foreground transition-colors";
const activeCls = { className: "text-sm text-foreground font-semibold" };

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-4 sm:flex-row sm:justify-between sm:px-6">
        <Link to="/" className="font-display text-xl text-primary sm:text-2xl">OneLastConversation</Link>
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 sm:gap-6">
          <Link to="/" className={linkCls} activeProps={activeCls} activeOptions={{ exact: true }}>Home</Link>
          <Link to="/pricing" className={linkCls} activeProps={activeCls}>Pricing</Link>
          <Link to="/help" className={linkCls} activeProps={activeCls}>Help</Link>
          <Link to="/signin" className={linkCls} activeProps={activeCls}>Sign in</Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-muted-foreground">
        © 2026 OneLastConversation · A demo concept. Nothing on this site communicates with anyone who has passed away.
      </div>
    </footer>
  );
}
