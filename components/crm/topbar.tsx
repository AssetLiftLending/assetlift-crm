import { Bell, Search, Sparkles } from "lucide-react";

export function Topbar() {
  return (
    <header className="topbar">
      <div className="search-shell">
        <Search size={16} />
        <span>Search borrowers, lenders, properties, or tasks</span>
      </div>

      <div className="topbar-actions">
        <div className="topbar-chip">
          <Sparkles size={16} />
          <span>AI lender match</span>
        </div>
        <button className="icon-button" type="button" aria-label="Notifications">
          <Bell size={16} />
        </button>
      </div>
    </header>
  );
}
