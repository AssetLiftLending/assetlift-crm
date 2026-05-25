import { Bell, Search } from "lucide-react";

export function Topbar() {
  return (
    <header className="topbar">
      <div className="search-shell">
        <Search size={16} />
        <span>Search contacts, deals, email, or follow-ups</span>
      </div>

      <div className="topbar-actions">
        <button className="icon-button" type="button" aria-label="Notifications">
          <Bell size={16} />
        </button>
      </div>
    </header>
  );
}
