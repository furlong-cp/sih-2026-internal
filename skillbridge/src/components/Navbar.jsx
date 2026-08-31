import React, { useState, useRef, useEffect } from "react";

export default function Navbar({ user, activeTab = "Home", onTabSelect, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navItems = ["Home", "Jobs", "Assessments", "Projects", "Community"];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = user?.name || user?.email?.split("@")[0] || "Alex";
  const displayInitial = displayName.charAt(0).toUpperCase();

  return (
    <header style={styles.topbar}>
      {/* Left Section: Brand & Main Navigation */}
      <div style={styles.leftSection}>
        <div
          onClick={() => onTabSelect && onTabSelect("Home")}
          style={styles.brandLink}
        >
          {/* Guaranteed Inline Vector Logo */}
          <div style={styles.logoBadge}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 17L10 11L14 15L20 7"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="20" cy="7" r="2.5" fill="#ffffff" />
            </svg>
          </div>
          <span style={styles.brandTitle}>SkillBridge</span>
        </div>

        <nav style={styles.navLinks}>
          {navItems.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onTabSelect && onTabSelect(item)}
              style={{
                ...styles.navBtn,
                fontWeight: activeTab === item ? "900" : "600",
                color: activeTab === item ? "#000000" : "#64748b",
                borderBottom: activeTab === item ? "3px solid #ff3d9a" : "3px solid transparent",
              }}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>

      {/* Right Section: Actions, Profile & Logout Menu */}
      <div style={styles.rightSection} ref={dropdownRef}>
        <button style={styles.iconBtn} title="Quick Search">
          ⌕
        </button>
        <button style={styles.iconBtn} title="Notifications">
          ◇
        </button>

        {/* User Pill Button */}
        <div
          onClick={() => setDropdownOpen(!dropdownOpen)}
          style={styles.userPill}
        >
          <span style={styles.avatarCircle}>{displayInitial}</span>
          <span style={styles.userNameText}>{displayName}</span>
          <span style={styles.arrowIcon}>{dropdownOpen ? "▲" : "▼"}</span>
        </div>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div style={styles.dropdownMenu}>
            <div style={styles.dropdownHeader}>
              <div style={{ fontWeight: "900", fontSize: "14px", color: "#000000" }}>
                {displayName}
              </div>
              <div style={{ fontSize: "11px", color: "#6b7280" }}>
                {user?.email || "alex@college.edu"}
              </div>
              <div style={styles.roleBadge}>STUDENT / CANDIDATE</div>
            </div>

            <div style={styles.dropdownDivider} />

            <button
              onClick={() => {
                setDropdownOpen(false);
                onTabSelect && onTabSelect("Skill Profile");
              }}
              style={styles.dropdownItem}
            >
              ◎ View Skill Profile
            </button>

            <button
              onClick={() => {
                setDropdownOpen(false);
                onTabSelect && onTabSelect("Jobs");
              }}
              style={styles.dropdownItem}
            >
              ▣ My Applications
            </button>

            <div style={styles.dropdownDivider} />

            <button
              onClick={() => {
                setDropdownOpen(false);
                if (onLogout) onLogout();
              }}
              style={styles.logoutBtn}
            >
              <span style={{ fontSize: "15px" }}>⎋</span> Log Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

const styles = {
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: "12px 28px",
    backgroundColor: "#ffffff",
    borderBottom: "2.5px solid #000000",
    position: "relative",
    zIndex: 100,
    boxSizing: "border-box",
    fontFamily: "'Space Grotesk', system-ui, sans-serif",
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: "36px",
  },
  brandLink: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    textDecoration: "none",
  },
  logoBadge: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #ff3d9a, #8b5cf6)",
    border: "2px solid #000000",
    boxShadow: "2px 2px 0px #000000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  brandTitle: {
    fontSize: "20px",
    fontWeight: "900",
    letterSpacing: "-0.5px",
    color: "#000000",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  navBtn: {
    background: "none",
    border: "none",
    padding: "8px 14px",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.15s ease",
    borderRadius: "6px 6px 0 0",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    position: "relative",
  },
  iconBtn: {
    width: "34px",
    height: "34px",
    border: "2px solid #000000",
    borderRadius: "8px",
    backgroundColor: "#fdfbf7",
    boxShadow: "2px 2px 0px #000000",
    fontSize: "15px",
    fontWeight: "900",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  userPill: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#000000",
    color: "#ffffff",
    padding: "4px 14px 4px 6px",
    borderRadius: "24px",
    border: "2px solid #000000",
    boxShadow: "3px 3px 0px #ff3d9a",
    cursor: "pointer",
    userSelect: "none",
  },
  avatarCircle: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    backgroundColor: "#ff3d9a",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: "900",
    border: "1.5px solid #ffffff",
  },
  userNameText: {
    fontSize: "13px",
    fontWeight: "800",
    letterSpacing: "0.2px",
  },
  arrowIcon: {
    fontSize: "10px",
    color: "#cbd5e1",
  },
  dropdownMenu: {
    position: "absolute",
    top: "calc(100% + 12px)",
    right: 0,
    width: "220px",
    backgroundColor: "#ffffff",
    border: "2.5px solid #000000",
    borderRadius: "14px",
    boxShadow: "6px 6px 0px #000000",
    padding: "12px",
    zIndex: 1000,
  },
  dropdownHeader: {
    padding: "4px 6px 8px 6px",
  },
  roleBadge: {
    display: "inline-block",
    marginTop: "6px",
    fontSize: "9px",
    fontWeight: "900",
    letterSpacing: "0.5px",
    backgroundColor: "#ffea28",
    border: "1px solid #000000",
    borderRadius: "4px",
    padding: "2px 6px",
  },
  dropdownDivider: {
    height: "1.5px",
    backgroundColor: "#e5e7eb",
    margin: "6px 0",
  },
  dropdownItem: {
    width: "100%",
    background: "none",
    border: "none",
    padding: "8px 10px",
    textAlign: "left",
    fontSize: "13px",
    fontWeight: "700",
    color: "#111827",
    cursor: "pointer",
    borderRadius: "6px",
  },
  logoutBtn: {
    width: "100%",
    backgroundColor: "#fee2e2",
    border: "1.5px solid #ef4444",
    padding: "8px 10px",
    textAlign: "left",
    fontSize: "13px",
    fontWeight: "900",
    color: "#b91c1c",
    cursor: "pointer",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "4px",
  },
};