import React, { useState, useEffect } from "react";
import { QUOTES } from "../data/quotes";

export default function Home({ user, score = 0, applicationsCount = 0, onNavigate }) {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSuperdayModalOpen, setIsSuperdayModalOpen] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Quote & Dynamic Color Cycle State
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [paletteIdx, setPaletteIdx] = useState(0);

  // High-visibility, stylish shifting color themes
  const subtlePalettes = [
    {
      name: "Cyber Violet",
      gradient: "linear-gradient(135deg, #7c3aed 0%, #ff3d9a 100%)",
      accent: "#7c3aed",
      secondaryAccent: "#ff3d9a",
      glow: "rgba(124, 58, 237, 0.25)",
      frontBg: "linear-gradient(145deg, #ffffff 0%, #f5f3ff 100%)",
      iconBg: "#ede9fe",
      tagBg: "#ede9fe",
      tagColor: "#5b21b6",
      borderAccent: "#7c3aed"
    },
    {
      name: "Electric Cyan",
      gradient: "linear-gradient(135deg, #0284c7 0%, #0d9488 100%)",
      accent: "#0284c7",
      secondaryAccent: "#0d9488",
      glow: "rgba(2, 132, 199, 0.25)",
      frontBg: "linear-gradient(145deg, #ffffff 0%, #f0fdfa 100%)",
      iconBg: "#e0f2fe",
      tagBg: "#e0f2fe",
      tagColor: "#0369a1",
      borderAccent: "#0284c7"
    },
    {
      name: "Sunset Coral",
      gradient: "linear-gradient(135deg, #ea580c 0%, #eab308 100%)",
      accent: "#ea580c",
      secondaryAccent: "#eab308",
      glow: "rgba(234, 88, 12, 0.25)",
      frontBg: "linear-gradient(145deg, #ffffff 0%, #fffbeb 100%)",
      iconBg: "#ffedd5",
      tagBg: "#ffedd5",
      tagColor: "#c2410c",
      borderAccent: "#ea580c"
    },
    {
      name: "Emerald Matrix",
      gradient: "linear-gradient(135deg, #16a34a 0%, #059669 100%)",
      accent: "#16a34a",
      secondaryAccent: "#059669",
      glow: "rgba(22, 163, 74, 0.25)",
      frontBg: "linear-gradient(145deg, #ffffff 0%, #f0fdf4 100%)",
      iconBg: "#dcfce7",
      tagBg: "#dcfce7",
      tagColor: "#15803d",
      borderAccent: "#16a34a"
    },
    {
      name: "Rose Quartz",
      gradient: "linear-gradient(135deg, #db2777 0%, #7c3aed 100%)",
      accent: "#db2777",
      secondaryAccent: "#7c3aed",
      glow: "rgba(219, 39, 119, 0.25)",
      frontBg: "linear-gradient(145deg, #ffffff 0%, #fdf2f8 100%)",
      iconBg: "#fce7f3",
      tagBg: "#fce7f3",
      tagColor: "#be185d",
      borderAccent: "#db2777"
    }
  ];

  const currentPalette = subtlePalettes[paletteIdx];
  const currentQuote = (QUOTES && QUOTES[quoteIdx]) || {
    quote: "Talk is cheap. Show me the code.",
    author: "Linus Torvalds",
    tag: "Systems"
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIdx((prev) => (QUOTES ? (prev + 1) % QUOTES.length : 0));
      setPaletteIdx((prev) => (prev + 1) % subtlePalettes.length);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const [profileData, setProfileData] = useState({
    college: user?.college || "NIT Warangal / IIT Guwahati",
    branch: user?.branch || "Mathematics & Computing",
    cfHandle: user?.cfHandle || "furlong",
    githubHandle: user?.githubHandle || "torvalds",
    currentLocation: user?.currentLocation || "Hyderabad, India",
    workLocation: user?.workLocation || "Singapore / London"
  });

  const displayScore = score > 0 ? score : 742;

  // Growth Curve Vector Coordinates
  const growthCurvePoints = [
    { label: "W1", score: 410, x: 20, y: 130 },
    { label: "W2", score: 480, x: 80, y: 112 },
    { label: "W3", score: 560, x: 140, y: 90 },
    { label: "W4", score: 640, x: 200, y: 68 },
    { label: "W5", score: 710, x: 260, y: 44 },
    { label: "Now", score: displayScore, x: 320, y: 24 }
  ];

  const polylineStr = growthCurvePoints.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPolygonStr = `20,150 ${polylineStr} 320,150`;

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsProfileModalOpen(false);
    alert("Profile credentials synchronized with recruiter fast-track pipelines!");
  };

  return (
    <div style={styles.container}>
      {/* 1. HERO BANNER */}
      <div
        style={{
          ...styles.heroCard,
          borderLeft: `8px solid ${currentPalette.accent}`,
          boxShadow: `6px 6px 0px #000000, 0 12px 32px ${currentPalette.glow}`
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "18px" }}>
          <div style={{ flex: 1, minWidth: "320px" }}>
            <div style={styles.badgeRow}>
              <span style={styles.sectionMiniTag}>CAREER COMMAND CENTER · PROOF-OF-WORK OS</span>
              <span
                style={{
                  ...styles.dynamicTagBadge,
                  backgroundColor: currentPalette.tagBg,
                  color: currentPalette.tagColor,
                  border: `1.5px solid ${currentPalette.accent}`
                }}
              >
                ✦ #{currentQuote.tag}
              </span>
            </div>

            <h1 style={styles.mainHeading}>
              Build proof.{" "}
              <span
                style={{
                  backgroundImage: currentPalette.gradient,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  display: "inline-block",
                  transition: "all 0.8s ease"
                }}
              >
                Get noticed.
              </span>
            </h1>

            <div style={styles.quoteBox}>
              <div style={{ ...styles.quoteIcon, color: currentPalette.accent }}>“</div>
              <div style={{ flex: 1 }}>
                <p style={styles.quoteText}>{currentQuote.quote}</p>
                <div style={styles.quoteAuthor}>
                  — <strong>{currentQuote.author}</strong>
                </div>
              </div>
            </div>

            <p style={styles.subHeading}>
              Target Track: <strong>{user?.targetCareer || "Quantitative Developer (C++ / HFT)"}</strong> · Candidate ID:{" "}
              <strong style={{ color: currentPalette.accent }}>#SB-810492</strong>
            </p>
          </div>

          <div style={styles.fastTrackStatusBadge} onClick={() => setIsSuperdayModalOpen(true)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "10px", fontWeight: "900", color: "#166534" }}>● FAST-TRACK CLEARANCE</span>
              <span style={styles.superdayPill}>SUPERDAY ACTIVE ⚡</span>
            </div>
            <div style={{ fontSize: "14px", fontWeight: "900", color: "#000000", marginTop: "4px" }}>
              Top 4.2% · Direct OA Bypass
            </div>
            <div style={{ fontSize: "10px", color: "#15803d", fontWeight: "700", marginTop: "2px" }}>
              Click to view firm interview invitations ➔
            </div>
          </div>
        </div>
      </div>

      {/* 2. FIVE IN-PLACE 3D POP FLIP METRIC CARDS */}
      <div style={styles.metricsGrid}>
        {/* Card 1: Skill Score */}
        <div className="flip-card-container" style={flipStyles.container}>
          <div className="flip-card-inner" style={flipStyles.inner}>
            {/* FRONT COVER */}
            <div
              style={{
                ...flipStyles.face,
                ...flipStyles.front,
                background: currentPalette.frontBg,
                boxShadow: `3px 3px 0px ${currentPalette.accent}, 3px 3px 0px #000000`
              }}
            >
              <div style={flipStyles.frontTopRow}>
                <span style={{ ...flipStyles.frontCategoryPill, backgroundColor: currentPalette.iconBg, color: currentPalette.accent }}>
                  INDEX
                </span>
                <span style={flipStyles.frontLivePulse}>● ACTIVE</span>
              </div>

              <div style={flipStyles.frontCenteredRow}>
                <div style={{ ...flipStyles.frontIconCircle, backgroundColor: currentPalette.iconBg, borderColor: currentPalette.accent }}>
                  🏆
                </div>
                <h3 style={flipStyles.frontTitle}>Skill Score</h3>
              </div>
            </div>

            {/* BACK DETAILS (Same Exact Height, In-Place) */}
            <div style={{ ...flipStyles.face, ...flipStyles.back }}>
              <div style={styles.cardHeader}>
                <span style={styles.cardLabel}>SKILL SCORE</span>
                <span style={styles.badgeGreen}>↑ +24</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "2px 0" }}>
                <div style={styles.bigScoreNumber}>{displayScore}</div>
                <div style={{ ...styles.miniProgressCircle, borderColor: currentPalette.accent }}>74%</div>
              </div>
              <div style={styles.cardFooter}>
                <span style={styles.subtextMuted}>TOP 18%</span>
                <button onClick={() => onNavigate("Assessments")} style={styles.actionLinkBtn}>
                  Improve score →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Profile Strength */}
        <div className="flip-card-container" style={flipStyles.container}>
          <div className="flip-card-inner" style={flipStyles.inner}>
            {/* FRONT COVER */}
            <div
              style={{
                ...flipStyles.face,
                ...flipStyles.front,
                background: currentPalette.frontBg,
                boxShadow: `3px 3px 0px ${currentPalette.accent}, 3px 3px 0px #000000`
              }}
            >
              <div style={flipStyles.frontTopRow}>
                <span style={{ ...flipStyles.frontCategoryPill, backgroundColor: currentPalette.iconBg, color: currentPalette.accent }}>
                  READINESS
                </span>
                <span style={flipStyles.frontLivePulse}>● 72% READY</span>
              </div>

              <div style={flipStyles.frontCenteredRow}>
                <div style={{ ...flipStyles.frontIconCircle, backgroundColor: currentPalette.iconBg, borderColor: currentPalette.accent }}>
                  👤
                </div>
                <h3 style={flipStyles.frontTitle}>Profile Strength</h3>
              </div>
            </div>

            {/* BACK DETAILS */}
            <div style={{ ...flipStyles.face, ...flipStyles.back }}>
              <div style={styles.cardHeader}>
                <span style={styles.cardLabel}>PROFILE STRENGTH</span>
                <span style={{ fontSize: "10px", fontWeight: "900", color: currentPalette.accent }}>72%</span>
              </div>
              <div style={styles.bigScoreNumber}>72%</div>
              <div style={styles.progressBarTrack}>
                <div style={{ ...styles.progressBarFill, width: "72%", background: currentPalette.gradient }} />
              </div>
              <div style={styles.cardFooter}>
                <span style={styles.subtextMuted}>3 actions left</span>
                <button onClick={() => setIsProfileModalOpen(true)} style={styles.actionLinkBtn}>
                  Complete profile →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Verified Skills */}
        <div className="flip-card-container" style={flipStyles.container}>
          <div className="flip-card-inner" style={flipStyles.inner}>
            {/* FRONT COVER */}
            <div
              style={{
                ...flipStyles.face,
                ...flipStyles.front,
                background: currentPalette.frontBg,
                boxShadow: `3px 3px 0px ${currentPalette.accent}, 3px 3px 0px #000000`
              }}
            >
              <div style={flipStyles.frontTopRow}>
                <span style={{ ...flipStyles.frontCategoryPill, backgroundColor: currentPalette.iconBg, color: currentPalette.accent }}>
                  PROOF
                </span>
                <span style={flipStyles.frontLivePulse}>● ATTESTED</span>
              </div>

              <div style={flipStyles.frontCenteredRow}>
                <div style={{ ...flipStyles.frontIconCircle, backgroundColor: currentPalette.iconBg, borderColor: currentPalette.accent }}>
                  ⚡
                </div>
                <h3 style={flipStyles.frontTitle}>Verified Skills</h3>
              </div>
            </div>

            {/* BACK DETAILS */}
            <div style={{ ...flipStyles.face, ...flipStyles.back }}>
              <div style={styles.cardHeader}>
                <span style={styles.cardLabel}>VERIFIED SKILLS</span>
                <span style={styles.badgeGreen}>+2 new</span>
              </div>
              <div style={styles.bigScoreNumber}>06</div>
              <div style={{ fontSize: "10px", color: "#16a34a", fontWeight: "800", margin: "2px 0" }}>
                C++, CUDA, Raft, PDEs
              </div>
              <div style={styles.cardFooter}>
                <span style={styles.subtextMuted}>Attested</span>
                <button onClick={() => onNavigate("Skill Profile")} style={styles.actionLinkBtn}>
                  View evidence →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Job Matches */}
        <div className="flip-card-container" style={flipStyles.container}>
          <div className="flip-card-inner" style={flipStyles.inner}>
            {/* FRONT COVER */}
            <div
              style={{
                ...flipStyles.face,
                ...flipStyles.front,
                background: currentPalette.frontBg,
                boxShadow: `3px 3px 0px ${currentPalette.accent}, 3px 3px 0px #000000`
              }}
            >
              <div style={flipStyles.frontTopRow}>
                <span style={{ ...flipStyles.frontCategoryPill, backgroundColor: currentPalette.iconBg, color: currentPalette.accent }}>
                  MATCHES
                </span>
                <span style={flipStyles.frontLivePulse}>● 8 TIER-1</span>
              </div>

              <div style={flipStyles.frontCenteredRow}>
                <div style={{ ...flipStyles.frontIconCircle, backgroundColor: currentPalette.iconBg, borderColor: currentPalette.accent }}>
                  🎯
                </div>
                <h3 style={flipStyles.frontTitle}>Job Matches</h3>
              </div>
            </div>

            {/* BACK DETAILS */}
            <div style={{ ...flipStyles.face, ...flipStyles.back }}>
              <div style={styles.cardHeader}>
                <span style={styles.cardLabel}>JOB MATCHES</span>
                <span style={{ fontSize: "10px", fontWeight: "900", color: currentPalette.accent }}>Active Desks</span>
              </div>
              <div style={styles.bigScoreNumber}>24</div>
              <div style={{ fontSize: "10px", color: currentPalette.accent, fontWeight: "800", margin: "2px 0" }}>
                8 High Match (&gt;90%)
              </div>
              <div style={styles.cardFooter}>
                <span style={styles.subtextMuted}>Jane St, Citadel</span>
                <button onClick={() => onNavigate("Jobs")} style={styles.actionLinkBtn}>
                  Explore jobs →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card 5: Benchmarked Repos */}
        <div className="flip-card-container" style={flipStyles.container}>
          <div className="flip-card-inner" style={flipStyles.inner}>
            {/* FRONT COVER */}
            <div
              style={{
                ...flipStyles.face,
                ...flipStyles.front,
                background: currentPalette.frontBg,
                boxShadow: `3px 3px 0px ${currentPalette.accent}, 3px 3px 0px #000000`
              }}
            >
              <div style={flipStyles.frontTopRow}>
                <span style={{ ...flipStyles.frontCategoryPill, backgroundColor: currentPalette.iconBg, color: currentPalette.accent }}>
                  HARDWARE
                </span>
                <span style={flipStyles.frontLivePulse}>● 0-HEAP</span>
              </div>

              <div style={flipStyles.frontCenteredRow}>
                <div style={{ ...flipStyles.frontIconCircle, backgroundColor: currentPalette.iconBg, borderColor: currentPalette.accent }}>
                  💻
                </div>
                <h3 style={flipStyles.frontTitle}>Benchmarked Repos</h3>
              </div>
            </div>

            {/* BACK DETAILS */}
            <div style={{ ...flipStyles.face, ...flipStyles.back }}>
              <div style={styles.cardHeader}>
                <span style={styles.cardLabel}>BENCHMARKED REPOS</span>
                <span style={{ fontSize: "10px", fontWeight: "900", color: "#ea580c" }}>Telemetry</span>
              </div>
              <div style={styles.bigScoreNumber}>04</div>
              <div style={{ fontSize: "10px", color: "#ea580c", fontWeight: "800", margin: "2px 0" }}>
                2 Hardware-Verified
              </div>
              <div style={styles.cardFooter}>
                <span style={styles.subtextMuted}>Zero-Heap Proven</span>
                <button onClick={() => onNavigate("Projects")} style={styles.actionLinkBtn}>
                  Manage projects →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. QUICK COMMANDS TOOLBAR */}
      <div style={styles.quickActionsBar}>
        <div style={styles.quickActionsTitle}>
          <span style={{ fontSize: "10px", fontWeight: "900", color: "#9ca3af", letterSpacing: "1px" }}>
            COMMAND SHORTCUTS
          </span>
          <div style={{ fontSize: "14px", fontWeight: "900", color: "#ffffff" }}>
            What do you want to accomplish today?
          </div>
        </div>

        <div style={styles.quickButtonsGroup}>
          <button onClick={() => onNavigate("Jobs")} style={styles.quickBtn}>
            ▤ Find Jobs
          </button>
          <button onClick={() => onNavigate("Assessments")} style={styles.quickBtn}>
            ✓ Take Assessment
          </button>
          <button onClick={() => onNavigate("Projects")} style={styles.quickBtn}>
            + Add Project
          </button>
          <button onClick={() => onNavigate("Career Copilot")} style={styles.quickBtn}>
            ✦ Ask Copilot
          </button>
          <button onClick={() => onNavigate("Messages")} style={styles.quickBtnSpecial}>
            💬 Messages ({applicationsCount + 3})
          </button>
        </div>
      </div>

      {/* 4. GROWTH CURVE & RECRUITER RADAR */}
      <div style={styles.growthSectionGrid}>
        {/* Left: Dynamic SVG Growth Curve */}
        <div style={styles.growthCurveCard}>
          <div style={styles.cardTitleRow}>
            <div>
              <span style={styles.subHeadingTag}>RATING ACCELERATION</span>
              <h3 style={styles.blockHeading}>Verified Skill Score Growth Curve</h3>
            </div>
            <span style={styles.badgeGreen}>+332 pts over 5 Weeks</span>
          </div>

          <div style={styles.growthSvgWrapper}>
            <svg viewBox="0 0 340 160" style={{ width: "100%", height: "200px" }}>
              <defs>
                <linearGradient id="scoreAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={currentPalette.accent} stopOpacity="0.35" />
                  <stop offset="100%" stopColor={currentPalette.accent} stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[40, 80, 120].map((y, idx) => (
                <line key={idx} x1="20" y1={y} x2="320" y2={y} stroke="#e2e8f0" strokeDasharray="3,3" />
              ))}

              {/* Gradient Area Fill */}
              <polygon points={areaPolygonStr} fill="url(#scoreAreaGrad)" />

              {/* Primary Curve */}
              <polyline points={polylineStr} fill="none" stroke={currentPalette.accent} strokeWidth="4" strokeLinecap="round" />

              {/* Interactive Hoverable Points */}
              {growthCurvePoints.map((pt, idx) => (
                <g key={idx} onMouseEnter={() => setHoveredPoint(pt)} onMouseLeave={() => setHoveredPoint(null)}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredPoint?.label === pt.label ? "7" : "5"}
                    fill="#ffea28"
                    stroke="#000000"
                    strokeWidth="2.5"
                    style={{ cursor: "pointer", transition: "all 0.1s ease" }}
                  />
                  <text x={pt.x} y="156" fontSize="10" fontWeight="900" textAnchor="middle" fill="#64748b">
                    {pt.label}
                  </text>
                </g>
              ))}
            </svg>

            {hoveredPoint && (
              <div style={styles.curveTooltip}>
                <strong>{hoveredPoint.label}: {hoveredPoint.score} Pts</strong>
              </div>
            )}
          </div>

          <div style={styles.growthMilestonesRow}>
            <div style={styles.milestoneItem}>
              <div style={{ fontSize: "10px", fontWeight: "900", color: "#64748b" }}>INITIAL BASELINE</div>
              <div style={{ fontSize: "16px", fontWeight: "900" }}>410 pts</div>
            </div>
            <div style={styles.milestoneItem}>
              <div style={{ fontSize: "10px", fontWeight: "900", color: "#64748b" }}>GROWTH RATE</div>
              <div style={{ fontSize: "16px", fontWeight: "900", color: "#16a34a" }}>+55 pts / wk</div>
            </div>
            <div style={styles.milestoneItem}>
              <div style={{ fontSize: "10px", fontWeight: "900", color: "#64748b" }}>TARGET STATUS</div>
              <div style={{ fontSize: "16px", fontWeight: "900", color: currentPalette.accent }}>Top 1% (820+)</div>
            </div>
          </div>
        </div>

        {/* Right: Live Recruiter Radar */}
        <div style={styles.recruiterRadarCard}>
          <div style={styles.cardTitleRow}>
            <div>
              <span style={styles.subHeadingTag}>RECRUITER RADAR</span>
              <h3 style={styles.blockHeading}>Live Firm Inquiries</h3>
            </div>
            <span style={styles.livePulsePill}>● 4 Firms Reviewing</span>
          </div>

          <div style={styles.recruiterList}>
            <div style={styles.recruiterItem} onClick={() => onNavigate("Messages")}>
              <div style={{ ...styles.recruiterLogo, backgroundColor: "#1e3a8a" }}>JS</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong style={{ fontSize: "13px" }}>Jane Street Capital</strong>
                  <span style={{ fontSize: "10px", color: "#16a34a", fontWeight: "900" }}>Active Screen</span>
                </div>
                <div style={{ fontSize: "11px", color: "#4b5563" }}>Marcus Vance reviewed your C++20 Order Book</div>
              </div>
            </div>

            <div style={styles.recruiterItem} onClick={() => onNavigate("Messages")}>
              <div style={{ ...styles.recruiterLogo, backgroundColor: "#0f172a" }}>CS</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong style={{ fontSize: "13px" }}>Citadel Securities</strong>
                  <span style={{ fontSize: "10px", color: "#7c3aed", fontWeight: "900" }}>Telemetry Verified</span>
                </div>
                <div style={{ fontSize: "11px", color: "#4b5563" }}>Elena Rostova flagged Stochastic PDE score (88%)</div>
              </div>
            </div>

            <div style={styles.recruiterItem} onClick={() => onNavigate("Messages")}>
              <div style={{ ...styles.recruiterLogo, backgroundColor: "#dc2626" }}>OP</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong style={{ fontSize: "13px" }}>Optiver</strong>
                  <span style={{ fontSize: "10px", color: "#ea580c", fontWeight: "900" }}>OA Fast-Track</span>
                </div>
                <div style={{ fontSize: "11px", color: "#4b5563" }}>Sarah Jenkins invited you to direct 2027 Trading screening</div>
              </div>
            </div>
          </div>

          <button onClick={() => onNavigate("Messages")} style={styles.openMessagesFullBtn}>
            Open Direct Recruiter Inbox (3 Unread) 💬
          </button>
        </div>
      </div>

      {/* 5. NEXT ACTIONS & PROFILE WIDGET */}
      <div style={styles.bottomLayout}>
        <div style={styles.recommendedCard}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <span style={{ fontSize: "10px", fontWeight: "900", color: "#6b7280", letterSpacing: "1px" }}>RECOMMENDED ROADMAP</span>
              <h3 style={{ margin: "2px 0 0 0", fontSize: "18px", fontWeight: "900" }}>Your Next High-Impact Steps</h3>
            </div>
            <button onClick={() => onNavigate("Assessments")} style={styles.viewAllBtn}>
              View all actions →
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={styles.actionItemBox}>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <span style={styles.actionItemNumber}>01</span>
                <div>
                  <h4 style={{ margin: 0, fontSize: "15px", fontWeight: "900" }}>Complete Distributed Systems (Raft) Assessment</h4>
                  <p style={{ margin: "2px 0 4px 0", fontSize: "12px", color: "#4b5563" }}>
                    Raise your distributed systems pillar from 78% to 92% to unlock Google Core Infra direct bypass.
                  </p>
                  <span style={styles.highImpactPill}>HIGH IMPACT</span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "13px", fontWeight: "900", color: "#7c3aed" }}>+38 pts</span>
                <button onClick={() => onNavigate("Assessments")} style={styles.startActionBtn}>
                  Start →
                </button>
              </div>
            </div>

            <div style={styles.actionItemBox}>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <span style={styles.actionItemNumber}>02</span>
                <div>
                  <h4 style={{ margin: 0, fontSize: "15px", fontWeight: "900" }}>Upsolve Codeforces Div. 2 (Problems C &amp; D)</h4>
                  <p style={{ margin: "2px 0 4px 0", fontSize: "12px", color: "#4b5563" }}>
                    Practice Lazy Segment Trees and Suffix Automaton templates with AI Career Copilot.
                  </p>
                  <span style={{ ...styles.highImpactPill, backgroundColor: "#e0e7ff", color: "#3730a3" }}>DSA BOOST</span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "13px", fontWeight: "900", color: "#16a34a" }}>+25 pts</span>
                <button onClick={() => onNavigate("Career Copilot")} style={styles.startActionBtn}>
                  Launch ➔
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Profile Widget */}
        <div style={styles.profileWidgetCard}>
          <div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "12px" }}>
              <div style={styles.avatarBoxWidget}>
                {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: "15px", fontWeight: "900" }}>{user?.name || "Alex Henderson"}</h4>
                <span style={{ fontSize: "11px", color: "#6b7280" }}>{user?.branch || "Mathematics & Computing"}</span>
              </div>
            </div>

            <div style={styles.profileStatsSmallBox}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: "800", marginBottom: "4px" }}>
                <span>PROFILE COMPLETION</span>
                <span style={{ color: "#7c3aed" }}>72%</span>
              </div>
              <div style={styles.progressBarTrack}>
                <div style={{ ...styles.progressBarFill, width: "72%" }} />
              </div>
              <div style={{ fontSize: "10px", color: "#4b5563", marginTop: "6px" }}>
                ✓ Codeforces connected (@{user?.cfHandle || "furlong"})<br />
                ✓ GitHub benchmark verified (@{user?.githubHandle || "torvalds"})
              </div>
            </div>
          </div>

          <button onClick={() => setIsProfileModalOpen(true)} style={styles.completeProfileWideBtn}>
            Edit &amp; Complete Profile ⚙️
          </button>
        </div>
      </div>

      {/* 6. SUPERDAY CLEARANCE MODAL */}
      {isSuperdayModalOpen && (
        <div style={modalStyles.overlay} onClick={() => setIsSuperdayModalOpen(false)}>
          <div style={modalStyles.card} onClick={(e) => e.stopPropagation()}>
            <div style={modalStyles.header}>
              <div>
                <span style={{ fontSize: "10px", fontWeight: "900", color: "#16a34a", letterSpacing: "1px" }}>
                  FAST-PASS RECRUITER CLEARANCE
                </span>
                <h2 style={{ margin: "2px 0 0 0", fontSize: "20px", fontWeight: "900" }}>Active Superday Fast-Track Radar</h2>
              </div>
              <button onClick={() => setIsSuperdayModalOpen(false)} style={modalStyles.closeBtn}>
                ✕
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "14px 0" }}>
              <div style={styles.fastPassItem}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong>Jane Street Capital</strong>
                  <span style={styles.badgeGreen}>OA Bypassed</span>
                </div>
                <div style={{ fontSize: "12px", color: "#4b5563" }}>Quant Developer Intern · C++20 Zero-Heap Verified</div>
              </div>
              <div style={styles.fastPassItem}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong>Citadel Securities</strong>
                  <span style={{ ...styles.badgeGreen, backgroundColor: "#e0e7ff", color: "#3730a3" }}>Direct Screen</span>
                </div>
                <div style={{ fontSize: "12px", color: "#4b5563" }}>Quantitative Researcher · Stochastic PDE Score (88%)</div>
              </div>
            </div>

            <button
              onClick={() => {
                setIsSuperdayModalOpen(false);
                onNavigate("Messages");
              }}
              style={modalStyles.saveBtn}
            >
              Open Direct Messages to Schedule ➔
            </button>
          </div>
        </div>
      )}

      {/* 7. COMPLETE PROFILE MODAL */}
      {isProfileModalOpen && (
        <div style={modalStyles.overlay} onClick={() => setIsProfileModalOpen(false)}>
          <div style={modalStyles.card} onClick={(e) => e.stopPropagation()}>
            <div style={modalStyles.header}>
              <div>
                <span style={{ fontSize: "10px", fontWeight: "900", color: "#7c3aed", letterSpacing: "1px" }}>
                  CANDIDATE ONBOARDING
                </span>
                <h2 style={{ margin: "2px 0 0 0", fontSize: "20px", fontWeight: "900" }}>Complete Your Skill Profile</h2>
              </div>
              <button onClick={() => setIsProfileModalOpen(false)} style={modalStyles.closeBtn}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} style={modalStyles.form}>
              <div style={modalStyles.inputGroup}>
                <label style={modalStyles.label}>College / University</label>
                <input
                  type="text"
                  value={profileData.college}
                  onChange={(e) => setProfileData({ ...profileData, college: e.target.value })}
                  style={modalStyles.input}
                  required
                />
              </div>

              <div style={modalStyles.inputGroup}>
                <label style={modalStyles.label}>Engineering Branch / Major</label>
                <input
                  type="text"
                  value={profileData.branch}
                  onChange={(e) => setProfileData({ ...profileData, branch: e.target.value })}
                  style={modalStyles.input}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div style={modalStyles.inputGroup}>
                  <label style={modalStyles.label}>Codeforces Handle</label>
                  <input
                    type="text"
                    value={profileData.cfHandle}
                    onChange={(e) => setProfileData({ ...profileData, cfHandle: e.target.value })}
                    style={modalStyles.input}
                  />
                </div>
                <div style={modalStyles.inputGroup}>
                  <label style={modalStyles.label}>GitHub Username</label>
                  <input
                    type="text"
                    value={profileData.githubHandle}
                    onChange={(e) => setProfileData({ ...profileData, githubHandle: e.target.value })}
                    style={modalStyles.input}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div style={modalStyles.inputGroup}>
                  <label style={modalStyles.label}>Current City</label>
                  <input
                    type="text"
                    value={profileData.currentLocation}
                    onChange={(e) => setProfileData({ ...profileData, currentLocation: e.target.value })}
                    style={modalStyles.input}
                  />
                </div>
                <div style={modalStyles.inputGroup}>
                  <label style={modalStyles.label}>Target Work Location</label>
                  <select
                    value={profileData.workLocation}
                    onChange={(e) => setProfileData({ ...profileData, workLocation: e.target.value })}
                    style={modalStyles.select}
                  >
                    <option value="Singapore / London">Singapore / London (Relocation)</option>
                    <option value="Bengaluru / Hyderabad">Bengaluru / Hyderabad (India)</option>
                    <option value="New York / US">New York / US</option>
                    <option value="Global Remote">Global Remote</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
                <button type="button" onClick={() => setIsProfileModalOpen(false)} style={modalStyles.cancelBtn}>
                  Cancel
                </button>
                <button type="submit" style={modalStyles.saveBtn}>
                  Save &amp; Verify Profile 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global CSS for In-Place 3D Model Pop Cards */}
      <style>{`
        .flip-card-container {
          perspective: 1000px;
          position: relative;
          z-index: 1;
        }
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.5s ease;
          transform-style: preserve-3d;
          transform-origin: center center;
        }
        .flip-card-container:hover {
          z-index: 50;
        }
        /* IN-PLACE 3D SCALE & POP FORWARD */
        .flip-card-container:hover .flip-card-inner {
          transform: rotateY(180deg) translateZ(40px) scale(1.08);
        }
      `}</style>
    </div>
  );
}

const flipStyles = {
  container: {
    backgroundColor: "transparent",
    minHeight: "145px",
    cursor: "pointer",
    position: "relative"
  },
  inner: {
    minHeight: "145px",
    width: "100%",
    height: "100%"
  },
  face: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    borderRadius: "16px",
    border: "2.5px solid #000000",
    padding: "12px 14px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    transition: "box-shadow 0.5s ease, background 0.5s ease"
  },
  front: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    zIndex: 2
  },
  frontTopRow: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center"
  },
  frontCenteredRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    flex: 1,
    width: "100%",
    margin: "auto 0"
  },
  back: {
    backgroundColor: "#ffffff",
    transform: "rotateY(180deg)",
    boxShadow: "6px 6px 0px #000000, 0 16px 32px rgba(0,0,0,0.15)",
    justifyContent: "space-between",
    zIndex: 1
  },
  frontCategoryPill: {
    fontSize: "9px",
    fontWeight: "900",
    letterSpacing: "0.8px",
    padding: "2px 7px",
    borderRadius: "6px",
    border: "1px solid #000000",
    textTransform: "uppercase"
  },
  frontLivePulse: {
    fontSize: "8px",
    fontWeight: "900",
    color: "#16a34a",
    letterSpacing: "0.5px"
  },
  frontIconCircle: {
    width: "38px",
    height: "38px",
    minWidth: "38px",
    borderRadius: "10px",
    border: "2px solid #000000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    boxShadow: "2px 2px 0px #000000",
    transition: "border-color 0.6s ease, background-color 0.6s ease"
  },
  frontTitle: {
    margin: 0,
    fontSize: "15px",
    fontWeight: "900",
    color: "#000000",
    letterSpacing: "-0.4px",
    lineHeight: "1.2"
  }
};

const styles = {
  container: {
    padding: "24px",
    width: "100%",
    color: "#111827",
    fontFamily: "'Space Grotesk', system-ui, sans-serif",
    boxSizing: "border-box"
  },
  heroCard: {
    backgroundColor: "#ffffff",
    border: "2.5px solid #000000",
    borderRadius: "18px",
    padding: "24px 28px",
    marginBottom: "20px",
    transition: "border-color 0.8s ease, box-shadow 0.8s ease"
  },
  badgeRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "8px",
    flexWrap: "wrap"
  },
  sectionMiniTag: {
    fontSize: "11px",
    fontWeight: "900",
    color: "#6b7280",
    letterSpacing: "1px"
  },
  dynamicTagBadge: {
    borderRadius: "6px",
    padding: "2px 8px",
    fontSize: "10px",
    fontWeight: "900",
    letterSpacing: "0.5px",
    transition: "all 0.6s ease"
  },
  mainHeading: {
    fontSize: "40px",
    fontWeight: "900",
    margin: "0 0 10px 0",
    letterSpacing: "-1.5px",
    color: "#000000",
    lineHeight: "1.1"
  },
  quoteBox: {
    display: "flex",
    gap: "12px",
    backgroundColor: "#fdfbf7",
    border: "2px solid #000000",
    borderRadius: "12px",
    padding: "12px 18px",
    margin: "12px 0 14px 0",
    boxShadow: "3px 3px 0px #000000"
  },
  quoteIcon: {
    fontSize: "32px",
    fontWeight: "900",
    lineHeight: "0.8",
    userSelect: "none",
    transition: "color 0.6s ease"
  },
  quoteText: {
    margin: 0,
    fontSize: "14px",
    fontWeight: "800",
    color: "#18181b",
    lineHeight: "1.4"
  },
  quoteAuthor: {
    fontSize: "11px",
    color: "#6b7280",
    marginTop: "4px"
  },
  subHeading: {
    fontSize: "13px",
    color: "#4b5563",
    margin: 0
  },
  fastTrackStatusBadge: {
    backgroundColor: "#bbf7d0",
    border: "2px solid #16a34a",
    borderRadius: "14px",
    padding: "12px 18px",
    boxShadow: "3px 3px 0px #000000",
    cursor: "pointer",
    minWidth: "240px"
  },
  superdayPill: {
    backgroundColor: "#16a34a",
    color: "#ffffff",
    borderRadius: "4px",
    padding: "1px 6px",
    fontSize: "9px",
    fontWeight: "900"
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "14px",
    marginBottom: "20px"
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "4px"
  },
  cardLabel: {
    fontSize: "9px",
    fontWeight: "900",
    color: "#6b7280",
    letterSpacing: "0.5px"
  },
  badgeGreen: {
    backgroundColor: "#bbf7d0",
    color: "#166534",
    border: "1px solid #000000",
    borderRadius: "4px",
    padding: "1px 4px",
    fontSize: "9px",
    fontWeight: "900"
  },
  bigScoreNumber: {
    fontSize: "26px",
    fontWeight: "900",
    color: "#000000",
    letterSpacing: "-1px"
  },
  miniProgressCircle: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    backgroundColor: "#fdfbf7",
    border: "2px solid #ff3d9a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10px",
    fontWeight: "900"
  },
  progressBarTrack: {
    height: "5px",
    backgroundColor: "#e2e8f0",
    borderRadius: "4px",
    overflow: "hidden",
    margin: "4px 0"
  },
  progressBarFill: {
    height: "100%",
    background: "linear-gradient(90deg, #ff3d9a, #8b5cf6)"
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px dashed #e2e8f0",
    paddingTop: "6px",
    marginTop: "2px"
  },
  subtextMuted: {
    fontSize: "8px",
    fontWeight: "800",
    color: "#9ca3af"
  },
  actionLinkBtn: {
    background: "none",
    border: "none",
    fontSize: "10px",
    fontWeight: "900",
    color: "#000000",
    cursor: "pointer",
    padding: 0,
    textDecoration: "underline"
  },
  quickActionsBar: {
    backgroundColor: "#000000",
    borderRadius: "16px",
    padding: "16px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    boxShadow: "4px 4px 0px #ff3d9a",
    flexWrap: "wrap",
    gap: "14px"
  },
  quickActionsTitle: {
    display: "flex",
    flexDirection: "column",
    gap: "2px"
  },
  quickButtonsGroup: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap"
  },
  quickBtn: {
    backgroundColor: "#1e1e24",
    color: "#ffffff",
    border: "1.5px solid #3f3f46",
    borderRadius: "8px",
    padding: "8px 14px",
    fontSize: "12px",
    fontWeight: "800",
    cursor: "pointer"
  },
  quickBtnSpecial: {
    backgroundColor: "#ffea28",
    color: "#000000",
    border: "1.5px solid #000000",
    borderRadius: "8px",
    padding: "8px 14px",
    fontSize: "12px",
    fontWeight: "900",
    cursor: "pointer",
    boxShadow: "2px 2px 0px #ff3d9a"
  },
  growthSectionGrid: {
    display: "grid",
    gridTemplateColumns: "1.3fr 1fr",
    gap: "20px",
    marginBottom: "24px"
  },
  growthCurveCard: {
    backgroundColor: "#ffffff",
    border: "2.5px solid #000000",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "5px 5px 0px #000000",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  cardTitleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    flexWrap: "wrap",
    gap: "8px"
  },
  subHeadingTag: {
    fontSize: "10px",
    fontWeight: "900",
    color: "#6b7280",
    letterSpacing: "0.5px"
  },
  blockHeading: {
    margin: "2px 0 0 0",
    fontSize: "18px",
    fontWeight: "900"
  },
  growthSvgWrapper: {
    position: "relative",
    padding: "10px 0"
  },
  curveTooltip: {
    position: "absolute",
    top: "10px",
    right: "20px",
    backgroundColor: "#000000",
    color: "#ffea28",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "900"
  },
  growthMilestonesRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "8px",
    borderTop: "1px dashed #e2e8f0",
    paddingTop: "10px",
    textAlign: "center"
  },
  milestoneItem: {
    display: "flex",
    flexDirection: "column",
    gap: "2px"
  },
  recruiterRadarCard: {
    backgroundColor: "#ffffff",
    border: "2.5px solid #000000",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "5px 5px 0px #000000",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  livePulsePill: {
    backgroundColor: "#bbf7d0",
    border: "1px solid #16a34a",
    borderRadius: "6px",
    padding: "2px 8px",
    fontSize: "10px",
    fontWeight: "900",
    color: "#166534"
  },
  recruiterList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    margin: "12px 0"
  },
  recruiterItem: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    backgroundColor: "#fdfbf7",
    border: "1.5px solid #000000",
    borderRadius: "10px",
    padding: "10px 12px",
    cursor: "pointer",
    boxShadow: "2px 2px 0px #000000"
  },
  recruiterLogo: {
    width: "34px",
    height: "34px",
    borderRadius: "8px",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    fontSize: "12px"
  },
  openMessagesFullBtn: {
    backgroundColor: "#ffea28",
    color: "#000000",
    border: "2px solid #000000",
    borderRadius: "10px",
    padding: "10px",
    fontSize: "12px",
    fontWeight: "900",
    cursor: "pointer",
    boxShadow: "2px 2px 0px #ff3d9a",
    width: "100%"
  },
  bottomLayout: {
    display: "grid",
    gridTemplateColumns: "1.6fr 1fr",
    gap: "20px",
    alignItems: "stretch"
  },
  recommendedCard: {
    backgroundColor: "#ffffff",
    border: "2.5px solid #000000",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "5px 5px 0px #000000"
  },
  viewAllBtn: {
    background: "none",
    border: "none",
    fontSize: "12px",
    fontWeight: "900",
    cursor: "pointer",
    textDecoration: "underline"
  },
  actionItemBox: {
    backgroundColor: "#fdfbf7",
    border: "2px solid #000000",
    borderRadius: "12px",
    padding: "14px 18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "3px 3px 0px #000000"
  },
  actionItemNumber: {
    fontSize: "12px",
    fontWeight: "900",
    color: "#6b7280"
  },
  highImpactPill: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    border: "1px solid #000000",
    borderRadius: "4px",
    padding: "1px 5px",
    fontSize: "9px",
    fontWeight: "900"
  },
  startActionBtn: {
    backgroundColor: "#ffea28",
    color: "#000000",
    border: "2px solid #000000",
    borderRadius: "8px",
    padding: "6px 14px",
    fontSize: "12px",
    fontWeight: "900",
    cursor: "pointer",
    boxShadow: "2px 2px 0px #000000"
  },
  profileWidgetCard: {
    backgroundColor: "#ffffff",
    border: "2.5px solid #000000",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "5px 5px 0px #000000",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  avatarBoxWidget: {
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    backgroundColor: "#000000",
    color: "#ffffff",
    border: "2px solid #000000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    fontSize: "16px"
  },
  profileStatsSmallBox: {
    backgroundColor: "#fdfbf7",
    border: "1.5px solid #000000",
    borderRadius: "10px",
    padding: "12px",
    marginTop: "8px"
  },
  completeProfileWideBtn: {
    backgroundColor: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "10px",
    padding: "10px",
    fontWeight: "900",
    fontSize: "12px",
    cursor: "pointer",
    boxShadow: "3px 3px 0px #000000",
    width: "100%",
    marginTop: "12px"
  },
  fastPassItem: {
    backgroundColor: "#fdfbf7",
    border: "1.5px solid #000000",
    borderRadius: "8px",
    padding: "10px 12px",
    boxShadow: "2px 2px 0px #000000"
  }
};

const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    backdropFilter: "blur(6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "20px"
  },
  card: {
    backgroundColor: "#ffffff",
    border: "3px solid #000000",
    borderRadius: "20px",
    boxShadow: "8px 8px 0px #000000",
    maxWidth: "520px",
    width: "100%",
    padding: "26px",
    fontFamily: "'Space Grotesk', system-ui, sans-serif"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottom: "2px solid #000000",
    paddingBottom: "12px",
    marginBottom: "14px"
  },
  closeBtn: {
    background: "none",
    border: "2px solid #000000",
    borderRadius: "6px",
    width: "28px",
    height: "28px",
    fontWeight: "900",
    cursor: "pointer",
    boxShadow: "2px 2px 0px #000000"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    textAlign: "left"
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "3px"
  },
  label: {
    fontSize: "11px",
    fontWeight: "800",
    color: "#374151"
  },
  input: {
    padding: "9px 12px",
    border: "2px solid #000000",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    backgroundColor: "#fdfbf7",
    outline: "none"
  },
  select: {
    padding: "9px 12px",
    border: "2px solid #000000",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "700",
    backgroundColor: "#ffffff",
    cursor: "pointer"
  },
  cancelBtn: {
    backgroundColor: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "8px",
    padding: "10px 16px",
    fontWeight: "800",
    fontSize: "12px",
    cursor: "pointer",
    boxShadow: "2px 2px 0px #000000"
  },
  saveBtn: {
    flex: 1,
    backgroundColor: "#000000",
    color: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "8px",
    padding: "10px 16px",
    fontWeight: "900",
    fontSize: "12px",
    cursor: "pointer",
    boxShadow: "3px 3px 0px #ff3d9a"
  }
};