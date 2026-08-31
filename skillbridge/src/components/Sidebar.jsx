import React from "react";

export default function Sidebar({ activeTab = "Home", onTabSelect }) {
  const workspaceItems = [
    { label: "Home", icon: "⌂" },
    { label: "Jobs", icon: "▣" },
    { label: "Applications", icon: "✓" },
    { label: "Assessments", icon: "◇" },
    { label: "Skill Profile", icon: "◎" },
    { label: "Projects", icon: "◆" },
    { label: "Career Copilot", icon: "✦" },
  ];

  const exploreItems = [
    { label: "Messages", icon: "✉" },
    { label: "Community", icon: "💬" },
    { label: "Leaderboard", icon: "🏆" },
  ];

  return (
    <aside className="sidebar" style={{ width: "230px", minWidth: "230px", padding: "16px 12px" }}>
      <div style={{ marginBottom: "24px" }}>
        <div 
          style={{ 
            fontSize: "11px", 
            fontWeight: "800", 
            letterSpacing: "1.2px", 
            color: "#94a3b8", 
            marginBottom: "10px",
            paddingLeft: "10px" 
          }}
        >
          WORKSPACE
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {workspaceItems.map((item) => {
            const isActive = activeTab === item.label;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => onTabSelect && onTabSelect(item.label)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: isActive ? "#000000" : "transparent",
                  color: isActive ? "#ffffff" : "#475569",
                  fontWeight: isActive ? "800" : "600",
                  fontSize: "13px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s ease",
                  boxShadow: isActive ? "3px 3px 0px #ff3d9a" : "none",
                }}
              >
                <span style={{ fontSize: "15px" }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div 
          style={{ 
            fontSize: "11px", 
            fontWeight: "800", 
            letterSpacing: "1.2px", 
            color: "#94a3b8", 
            marginBottom: "10px",
            paddingLeft: "10px" 
          }}
        >
          EXPLORE
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {exploreItems.map((item) => {
            const isActive = activeTab === item.label;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => onTabSelect && onTabSelect(item.label)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: isActive ? "#000000" : "transparent",
                  color: isActive ? "#ffffff" : "#475569",
                  fontWeight: isActive ? "800" : "600",
                  fontSize: "13px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s ease",
                }}
              >
                <span style={{ fontSize: "15px" }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div 
        style={{ 
          marginTop: "40px", 
          padding: "12px", 
          backgroundColor: "#ffffff", 
          border: "2px solid #000000",
          borderRadius: "12px",
          boxShadow: "3px 3px 0px #000000"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: "800" }}>
          <span>Profile strength</span>
          <span style={{ color: "#6366f1" }}>72%</span>
        </div>
        <div 
          style={{ 
            height: "6px", 
            backgroundColor: "#e2e8f0", 
            borderRadius: "3px", 
            marginTop: "6px", 
            overflow: "hidden" 
          }}
        >
          <div 
            style={{ 
              width: "72%", 
              height: "100%", 
              background: "linear-gradient(90deg, #6366f1, #ec4899)" 
            }} 
          />
        </div>
      </div>
    </aside>
  );
}