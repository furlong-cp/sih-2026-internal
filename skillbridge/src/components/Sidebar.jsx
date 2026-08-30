import { useEffect, useState } from "react";

export default function Sidebar() {
  const [active, setActive] = useState("Home");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const toggle = () => setMobileOpen((prev) => !prev);

    window.addEventListener("toggle-sidebar", toggle);

    return () => {
      window.removeEventListener("toggle-sidebar", toggle);
    };
  }, []);

  const mainItems = [
    { name: "Home", icon: "⌂" },
    { name: "Jobs", icon: "▣" },
    { name: "Applications", icon: "✓" },
    { name: "Assessments", icon: "◇" },
    { name: "Skill Profile", icon: "◎" },
    { name: "Projects", icon: "◆" },
    { name: "Career Copilot", icon: "✦" },
  ];

  const exploreItems = [
    { name: "Messages", icon: "□" },
    { name: "Community", icon: "◌" },
    { name: "Leaderboard", icon: "♛" },
  ];

  const handleClick = (name) => {
    setActive(name);
    setMobileOpen(false);
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-section">
          <p className="sidebar-label">WORKSPACE</p>

          {mainItems.map((item) => (
            <button
              key={item.name}
              className={`sidebar-item ${
                active === item.name ? "selected" : ""
              }`}
              onClick={() => handleClick(item.name)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </div>

        <div className="sidebar-section">
          <p className="sidebar-label">EXPLORE</p>

          {exploreItems.map((item) => (
            <button
              key={item.name}
              className={`sidebar-item ${
                active === item.name ? "selected" : ""
              }`}
              onClick={() => handleClick(item.name)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </div>

        <div className="sidebar-bottom">
          <div className="skill-progress">
            <div className="progress-header">
              <span>Profile strength</span>
              <strong>72%</strong>
            </div>

            <div className="progress-track">
              <div className="progress-fill" />
            </div>

            <p>
              Complete your profile to improve your job matches.
            </p>

            <button onClick={() => handleClick("Skill Profile")}>
              Complete profile →
            </button>
          </div>

          <button
            className="sidebar-item settings-item"
            onClick={() => handleClick("Settings")}
          >
            <span className="sidebar-icon">⚙</span>
            <span>Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
}
