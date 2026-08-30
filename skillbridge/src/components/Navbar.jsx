import { useState } from "react";

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          className="mobile-menu"
          onClick={() => window.dispatchEvent(new Event("toggle-sidebar"))}
          aria-label="Open menu"
        >
          ☰
        </button>

        <a href="/" className="brand">
          <img src="/logo.svg" alt="SkillBridge" />
          <span>SkillBridge</span>
        </a>
      </div>

      <nav className="nav-links">
        <a href="#home" className="active">Home</a>
        <a href="#jobs">Jobs</a>
        <a href="#assessments">Assessments</a>
        <a href="#projects">Projects</a>
        <a href="#community">Community</a>
      </nav>

      <div className="navbar-right">
        <button
          className="icon-button"
          onClick={() => setSearchOpen(!searchOpen)}
          aria-label="Search"
        >
          ⌕
        </button>

        <button className="icon-button" aria-label="Notifications">
          ♢
        </button>

        <div className="user-avatar">F</div>
      </div>

      {searchOpen && (
        <div className="search-box">
          <input
            type="text"
            placeholder="Search jobs, skills, projects..."
            autoFocus
          />
        </div>
      )}
    </header>
  );
}
