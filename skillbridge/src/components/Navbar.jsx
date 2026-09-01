import React, { useState, useEffect, useRef } from "react";

export default function Navbar({ user, activeTab, onTabSelect, onLogout }) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [notifications, setNotifications] = useState([
    { id: "N-1", title: "Jane Street Capital · OA Bypassed", desc: "Marcus Vance reviewed your C++20 Orderbook.", time: "10m ago", unread: true, targetTab: "Messages" },
    { id: "N-2", title: "Citadel Securities · Telemetry Match", desc: "Stochastic PDE score matches Researcher requirements.", time: "2h ago", unread: true, targetTab: "Jobs" },
    { id: "N-3", title: "Assessment Milestone Unlocked", desc: "Score crossed 740 pts. Global rank: Top 4.2%.", time: "1d ago", unread: false, targetTab: "Leaderboard" }
  ]);

  const navDropdownRef = useRef(null);

  const mainNavTabs = [
    { id: "Home", label: "Home" },
    { id: "Jobs", label: "Jobs" },
    { id: "Assessments", label: "Assessments" },
    { id: "Projects", label: "Projects" },
    { id: "Community", label: "Community" }
  ];

  const searchableIndex = [
    { label: "Take 10-Q Stochastic Calculus & PDE Assessment", category: "Assessments", tab: "Assessments", icon: "◇" },
    { label: "Jane Street · Quant Developer Intern (Summer 2027)", category: "Jobs", tab: "Jobs", icon: "▤" },
    { label: "L3 Limit Order Book (820ns p99 Telemetry)", category: "Projects", tab: "Projects", icon: "◆" },
    { label: "Direct Message Marcus Vance (Jane Street Recruiter)", category: "Messages", tab: "Messages", icon: "✉" },
    { label: "Global SkillBridge & Codeforces Leaderboard", category: "Leaderboard", tab: "Leaderboard", icon: "🏆" }
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setSearchModalOpen(false);
        setNotificationsOpen(false);
        setProfileDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;
  const filteredSearch = searchableIndex.filter((item) => item.label.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <>
      <header style={navStyles.navbar}>
        <div style={navStyles.brandWrapper} onClick={() => onTabSelect("Home")}>
          <div style={navStyles.logoBadge}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M4 17L10 11L14 15L20 7" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="20" cy="7" r="3" fill="#000" />
            </svg>
          </div>
          <span style={navStyles.brandName}>SkillBridge</span>
        </div>

        <nav style={navStyles.centerNav}>
          {mainNavTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabSelect(tab.id)}
                style={{
                  ...navStyles.navTabBtn,
                  color: isActive ? "#000" : "#4b5563",
                  fontWeight: isActive ? "900" : "700",
                  borderBottom: isActive ? "3px solid #ff3d9a" : "3px solid transparent"
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div style={navStyles.centerSearchGap}>
          <div onClick={() => setSearchModalOpen(true)} style={navStyles.prominentSearchBar}>
            <span>🔍</span>
            <input type="text" readOnly placeholder="Search roles, assessments, skills, projects..." style={navStyles.fakeSearchInput} />
            <span style={navStyles.cmdKBadge}>⌘K</span>
          </div>
        </div>

        <div style={navStyles.rightSection} ref={navDropdownRef}>
          <div style={{ position: "relative" }}>
            <button
              onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileDropdownOpen(false); }}
              style={{ ...navStyles.iconBtn, backgroundColor: notificationsOpen ? "#ffea28" : "#fff" }}
              title="Notifications"
            >
              ◇
              {unreadCount > 0 && <span style={navStyles.notificationBadgeDot}>{unreadCount}</span>}
            </button>

            {notificationsOpen && (
              <div style={navStyles.notificationsDrawer}>
                <div style={navStyles.drawerHeader}>
                  <strong style={{ fontSize: "13px" }}>Live Alerts</strong>
                  {unreadCount > 0 && (
                    <button onClick={() => setNotifications((p) => p.map((n) => ({ ...n, unread: false })))} style={navStyles.markReadBtn}>
                      Mark read
                    </button>
                  )}
                </div>
                <div style={navStyles.notificationsList}>
                  {notifications.map((n) => (
                    <div key={n.id} onClick={() => { onTabSelect(n.targetTab); setNotificationsOpen(false); }} style={{ ...navStyles.notificationItem, backgroundColor: n.unread ? "#fdfbf7" : "#fff" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <strong style={{ fontSize: "12px" }}>{n.title}</strong>
                        <span style={{ fontSize: "9px", color: "#9ca3af" }}>{n.time}</span>
                      </div>
                      <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "#4b5563" }}>{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ position: "relative" }}>
            <button onClick={() => { setProfileDropdownOpen(!profileDropdownOpen); setNotificationsOpen(false); }} style={navStyles.userProfilePill}>
              <div style={navStyles.avatarCircle}>{user?.name ? user.name.charAt(0).toUpperCase() : "A"}</div>
              <span style={navStyles.userNameText}>{user?.name ? user.name.toLowerCase() : "alex"}</span>
              <span style={{ fontSize: "10px", marginLeft: "4px" }}>▼</span>
            </button>

            {profileDropdownOpen && (
              <div style={navStyles.dropdownMenu}>
                <div style={navStyles.dropdownHeader}>
                  <div style={{ fontWeight: "900", fontSize: "13px" }}>{user?.name || "Candidate"}</div>
                  <div style={{ fontSize: "11px", color: "#6b7280" }}>{user?.email || "candidate@skillbridge.io"}</div>
                </div>
                <div style={navStyles.dropdownDivider} />
                <button onClick={() => { onTabSelect("Skill Profile"); setProfileDropdownOpen(false); }} style={navStyles.dropdownItem}>👤 Skill Profile</button>
                <button onClick={() => { onTabSelect("Career Copilot"); setProfileDropdownOpen(false); }} style={navStyles.dropdownItem}>🤖 Career Copilot</button>
                <div style={navStyles.dropdownDivider} />
                <button onClick={() => { setProfileDropdownOpen(false); if (onLogout) onLogout(); }} style={{ ...navStyles.dropdownItem, color: "#dc2626", fontWeight: "900" }}>✕ Log Out</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {searchModalOpen && (
        <div style={searchStyles.overlay} onClick={() => setSearchModalOpen(false)}>
          <div style={searchStyles.card} onClick={(e) => e.stopPropagation()}>
            <div style={searchStyles.inputWrap}>
              <span>🔍</span>
              <input type="text" placeholder="Search jobs, assessments, projects..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={searchStyles.input} autoFocus />
              <span style={searchStyles.escBadge}>ESC</span>
            </div>
            <div style={searchStyles.resultsList}>
              {filteredSearch.map((item, idx) => (
                <div key={idx} onClick={() => { onTabSelect(item.tab); setSearchModalOpen(false); setSearchQuery(""); }} style={searchStyles.resultItem}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: "800" }}>{item.label}</div>
                      <span style={{ fontSize: "10px", color: "#6b7280" }}>Category: {item.category}</span>
                    </div>
                  </div>
                  <span style={searchStyles.tabTag}>Jump ➔</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const navStyles = {
  navbar: { height: "64px", backgroundColor: "#fff", borderBottom: "2.5px solid #000", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", fontFamily: "'Space Grotesk', system-ui, sans-serif", zIndex: 100, position: "sticky", top: 0, gap: "14px" },
  brandWrapper: { display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", flexShrink: 0 },
  logoBadge: { width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#ffea28", border: "2px solid #000", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "2px 2px 0px #000" },
  brandName: { fontSize: "19px", fontWeight: "900", letterSpacing: "-0.5px", color: "#000" },
  centerNav: { display: "flex", alignItems: "center", gap: "14px", height: "100%", flexShrink: 0 },
  navTabBtn: { background: "none", border: "none", fontSize: "13px", cursor: "pointer", padding: "0 4px", height: "100%", display: "flex", alignItems: "center" },
  centerSearchGap: { flex: 1, maxWidth: "460px", margin: "0 10px", display: "flex", alignItems: "center" },
  prominentSearchBar: { width: "100%", backgroundColor: "#fdfbf7", border: "2px solid #000", borderRadius: "10px", padding: "6px 12px", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", boxShadow: "2.5px 2.5px 0px #000" },
  fakeSearchInput: { flex: 1, background: "none", border: "none", outline: "none", fontSize: "12px", fontWeight: "700", color: "#111827", cursor: "pointer" },
  cmdKBadge: { backgroundColor: "#f1f5f9", border: "1px solid #000", borderRadius: "4px", padding: "1px 5px", fontSize: "10px", fontWeight: "900", color: "#6b7280" },
  rightSection: { display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 },
  iconBtn: { width: "38px", height: "38px", borderRadius: "10px", border: "2px solid #000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "900", cursor: "pointer", boxShadow: "2px 2px 0px #000", position: "relative" },
  notificationBadgeDot: { position: "absolute", top: "-4px", right: "-4px", backgroundColor: "#ff3d9a", color: "#fff", borderRadius: "50%", width: "16px", height: "16px", fontSize: "9px", fontWeight: "900", display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid #000" },
  notificationsDrawer: { position: "absolute", right: 0, top: "46px", width: "300px", backgroundColor: "#fff", border: "2.5px solid #000", borderRadius: "14px", boxShadow: "6px 6px 0px #000", padding: "12px", zIndex: 999, display: "flex", flexDirection: "column", gap: "8px" },
  drawerHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1.5px solid #e2e8f0", paddingBottom: "8px" },
  markReadBtn: { background: "none", border: "none", fontSize: "10px", fontWeight: "900", color: "#7c3aed", cursor: "pointer", textDecoration: "underline" },
  notificationsList: { display: "flex", flexDirection: "column", gap: "6px", maxHeight: "240px", overflowY: "auto" },
  notificationItem: { padding: "8px 10px", borderRadius: "8px", border: "1px solid #e2e8f0", cursor: "pointer" },
  userProfilePill: { display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#000", color: "#fff", border: "2px solid #000", borderRadius: "20px", padding: "4px 12px 4px 5px", cursor: "pointer", boxShadow: "2.5px 2.5px 0px #ff3d9a" },
  avatarCircle: { width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#ff3d9a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "12px", border: "1px solid #000" },
  userNameText: { fontSize: "12px", fontWeight: "800" },
  dropdownMenu: { position: "absolute", right: 0, top: "44px", width: "220px", backgroundColor: "#fff", border: "2.5px solid #000", borderRadius: "14px", boxShadow: "5px 5px 0px #000", padding: "10px", display: "flex", flexDirection: "column", gap: "4px", zIndex: 999 },
  dropdownHeader: { padding: "6px 8px" },
  dropdownDivider: { height: "1px", backgroundColor: "#e2e8f0", margin: "4px 0" },
  dropdownItem: { background: "none", border: "none", textAlign: "left", padding: "8px 10px", fontSize: "12px", fontWeight: "800", cursor: "pointer", borderRadius: "6px", color: "#111827" }
};

const searchStyles = {
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "90px", zIndex: 9999 },
  card: { backgroundColor: "#fff", border: "3px solid #000", borderRadius: "16px", boxShadow: "8px 8px 0px #000", maxWidth: "560px", width: "100%", padding: "18px", fontFamily: "'Space Grotesk', system-ui, sans-serif" },
  inputWrap: { display: "flex", alignItems: "center", gap: "10px", borderBottom: "2px solid #000", paddingBottom: "12px", marginBottom: "12px" },
  input: { flex: 1, border: "none", outline: "none", fontSize: "14px", fontWeight: "700" },
  escBadge: { backgroundColor: "#f1f5f9", border: "1px solid #000", borderRadius: "4px", padding: "1px 6px", fontSize: "10px", fontWeight: "900" },
  resultsList: { display: "flex", flexDirection: "column", gap: "6px", maxHeight: "300px", overflowY: "auto" },
  resultItem: { display: "flex", alignItems: "center", justifyContent: "space-between", border: "1.5px solid #000", borderRadius: "8px", padding: "10px 12px", cursor: "pointer", backgroundColor: "#fdfbf7" },
  tabTag: { fontSize: "11px", fontWeight: "900", color: "#7c3aed" }
};