import React, { useState } from "react";

// Clean list of only the essential SkillBridge application tabs
const APP_TABS = [
  "Home",
  "Jobs",
  "Applications",
  "Assessments",
  "Skill Profile",
  "Projects",
  "Career Copilot",
];

export default function Navbar({ user, activeTab, onTabSelect, onLogout }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleNav = (tab) => {
    onTabSelect?.(tab);
  };

  return (
    <div style={cfStyles.wrapper}>
      {/* Top Header Row */}
      <header style={cfStyles.header}>
        {/* SkillBridge Logo with trading trendline & sponsored by scissors.co */}
        <div style={cfStyles.logoContainer} onClick={() => handleNav("Home")}>
          <div style={cfStyles.tradeLogoBox} title="Ascending Trade Outline">
            <svg width="22" height="18" viewBox="0 0 24 20" fill="none">
              <path d="M2 14L8 8L13 13L22 4" stroke="#0000cc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={cfStyles.logoText}>SKILLBRIDGE</span>
            <span style={cfStyles.sponsoredText}>Sponsored by scissors.co</span>
          </div>
        </div>

        {/* Top Right User / Auth Status */}
        <div style={cfStyles.topRightAuth}>
          {user ? (
            <>
              <span style={{ color: "#0000ff", cursor: "pointer", fontWeight: "bold" }} onClick={() => handleNav("Skill Profile")}>
                {user.name ? user.name.toLowerCase() : "furlong"}
              </span>
              <span>|</span>
              <span style={{ color: "#0000ff", cursor: "pointer" }} onClick={() => onLogout?.()}>
                Logout
              </span>
              <div style={cfStyles.noticeMail}>
              </div>
            </>
          ) : (
            <>
              <span style={{ color: "#0000ff", cursor: "pointer" }} onClick={() => handleNav("Home")}>Login</span>
              <span>|</span>
              <span style={{ color: "#0000ff", cursor: "pointer" }} onClick={() => handleNav("Home")}>Register</span>
            </>
          )}
        </div>
      </header>

      {/* Main Navigation Menu Bar (Cleaned of extra Codeforces clutter) */}
      <nav style={cfStyles.navBar}>
        <div style={cfStyles.navLinksList}>
          {APP_TABS.map((tab) => {
            const isSelected = activeTab === tab || (tab === "Home" && activeTab === "Overview");
            return (
              <button
                key={tab}
                type="button"
                onClick={() => handleNav(tab)}
                style={{
                  ...cfStyles.navTabItem,
                  backgroundColor: isSelected ? "#e0e8f5" : "transparent",
                  fontWeight: isSelected ? "bold" : "normal",
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div style={cfStyles.searchContainer}>
          <input
            type="text"
            placeholder=""
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={cfStyles.searchInput}
          />
        </div>
      </nav>
    </div>
  );
}

// Utilitarian Codeforces layout styles with trading trendline logo and streamlined tabs
const cfStyles = {
  wrapper: {
    width: "100%",
    fontFamily: "Verdana, Arial, sans-serif",
    fontSize: "12px",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #d0d0d0",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 16px",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
  },
  tradeLogoBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f4f8",
    padding: "4px 6px",
    border: "1px solid #b0c4de",
    borderRadius: "3px",
  },
  logoText: {
    fontSize: "19px",
    fontWeight: "bold",
    fontFamily: "Arial, sans-serif",
    letterSpacing: "0.5px",
    color: "#0f172a",
    lineHeight: "1",
  },
  sponsoredText: {
    fontSize: "9px",
    color: "#555555",
    fontFamily: "Verdana, sans-serif",
    marginTop: "2px",
  },
  topRightAuth: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "11px",
  },
  noticeMail: {
    marginLeft: "8px",
    backgroundColor: "#eaf2f8",
    padding: "2px 6px",
    borderRadius: "3px",
    border: "1px solid #bce8f1",
  },
  navBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f0f4f8",
    borderTop: "1px solid #d0d0d0",
    borderBottom: "1px solid #d0d0d0",
    padding: "0 12px",
    height: "30px",
    overflowX: "auto",
  },
  navLinksList: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    gap: "2px",
  },
  navTabItem: {
    background: "none",
    border: "none",
    height: "100%",
    padding: "0 8px",
    fontSize: "11px",
    color: "#0000cc",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    whiteSpace: "nowrap",
  },
  searchContainer: {
    display: "flex",
    alignItems: "center",
  },
  searchInput: {
    height: "18px",
    width: "120px",
    border: "1px solid #7f9db9",
    borderRadius: "2px",
    padding: "1px 4px",
    fontSize: "11px",
  },
};