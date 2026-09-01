import React, { useState, useEffect } from "react";

/* ==========================================================================
   DATA: QUOTES & 30+ TESTIMONIALS
   ========================================================================== */
const QUOTES = [
  { quote: "Talk is cheap. Show me the code.", author: "Linus Torvalds", tag: "Systems" },
  { quote: "In high-frequency trading and low-latency systems, nanoseconds are the new seconds.", author: "Jane Street Engineering", tag: "Quant Tech" },
  { quote: "First, solve the problem. Then, write the code.", author: "John Johnson", tag: "Algorithms" },
  { quote: "Simplicity is prerequisite for reliability.", author: "Edsger W. Dijkstra", tag: "Architecture" }
];

const TESTIMONIALS_DATA = [
  { name: "Rohan Verma", role: "Quant Developer Intern", firm: "Jane Street", firmColor: "#1e3a8a", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80", quote: "The zero-heap C++20 telemetry proof in SkillBridge bypassed the resume black hole completely.", metrics: "120ns Tick-to-Trade" },
  { name: "Ananya Sharma", role: "Quantitative Researcher", firm: "Citadel", firmColor: "#0f172a", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80", quote: "The stochastic PDE and probability verification modules match actual HFT interview questions.", metrics: "Stochastics 88%" },
  { name: "Devansh Gupta", role: "Core Systems Engineer", firm: "Tower Research", firmColor: "#0284c7", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80", quote: "Syncing my Codeforces and LeetCode ratings gave me instant trust verification.", metrics: "CF 1980 · 99% Winrate" },
  { name: "Kavya Ramesh", role: "Cloud Infra Engineer", firm: "Google", firmColor: "#ea4335", photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80", quote: "My distributed Raft consensus project gave me a direct manager referral override at Google.", metrics: "Raft Consensus" },
  { name: "Arjun Mehta", role: "High-Frequency Trader", firm: "Optiver", firmColor: "#dc2626", photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80", quote: "SkillBridge's live recruiter radar connected me directly with hiring desks in London.", metrics: "OA Bypassed" },
  { name: "Priya Patel", role: "Low-Latency C++", firm: "HRT", firmColor: "#ea580c", photo: "https://images.unsplash.com/photo-1531123897727-8f129e1bf98a?auto=format&fit=crop&w=600&q=80", quote: "Hudson River Trading looks for obsessive optimizers. SkillBridge proved my hot loops.", metrics: "DPDK Bypass" },
  { name: "Siddharth Rao", role: "Distributed Systems", firm: "Databricks", firmColor: "#ff3621", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80", quote: "Took the Apache Spark internal architecture assessment and got a direct recruiter ping.", metrics: "Spark Internals" },
  { name: "Neha Singh", role: "Database Kernel", firm: "Snowflake", firmColor: "#2563eb", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80", quote: "Snowflake’s vectorization interview is brutal. I practiced in the War Room until confident.", metrics: "SIMD AVX-512" },
  { name: "Wei Chen", role: "FPGA Hardware", firm: "Jump Trading", firmColor: "#0f766e", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80", quote: "Integrating my Verilog hardware benchmarks directly into SkillBridge got Jump's attention.", metrics: "Verilog · PCIe" },
  { name: "Aisha Khan", role: "AI Infrastructure", firm: "NVIDIA", firmColor: "#76b900", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80", quote: "Wrote a custom CUDA kernel that outperformed cuBLAS by 2%. Natively verified.", metrics: "CUDA C++" },
  { name: "Liam O'Connor", role: "Alpha Researcher", firm: "Two Sigma", firmColor: "#334155", photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80", quote: "Competitive programming verification proves algorithmic velocity. Skipped HackerRank.", metrics: "CF Grandmaster" },
  { name: "Zara Ibrahim", role: "Options Pricing Quant", firm: "DRW", firmColor: "#0369a1", photo: "https://images.unsplash.com/photo-1524504388266-9c4c5f3e9c56?auto=format&fit=crop&w=600&q=80", quote: "The Black-Scholes interactive simulation mapped my math directly to an executable graph.", metrics: "Stochastics 92%" },
  { name: "David Kim", role: "Order Routing", firm: "IMC Trading", firmColor: "#1d4ed8", photo: "https://images.unsplash.com/photo-1488161628813-04466f872507?auto=format&fit=crop&w=600&q=80", quote: "SkillBridge translated my C++ systems knowledge into a universal Skill Score.", metrics: "SPSC Queues" },
  { name: "Sofia Rossi", role: "Backend Performance", firm: "Meta", firmColor: "#0668E1", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80", quote: "Passed the Linux IO tests and Meta's infrastructure team recruited me directly.", metrics: "io_uring · eBPF" },
  { name: "Omar Tariq", role: "Compiler Engineer", firm: "Apple", firmColor: "#34a853", photo: "https://images.unsplash.com/photo-1504257432389-523431e11b74?auto=format&fit=crop&w=600&q=80", quote: "Zero-Knowledge attestation let me prove my compiler pass efficiency secretly.", metrics: "LLVM IR" },
  { name: "Chloe Chen", role: "Data Infra Engineer", firm: "Confluent", firmColor: "#0284c7", photo: "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=600&q=80", quote: "Confluent requires deep Kafka internals knowledge. The targeted assessment closed my gaps.", metrics: "Event Streaming" },
  { name: "Daniel Silva", role: "Blockchain Protocol", firm: "Paradigm", firmColor: "#4338ca", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80", quote: "Paradigm recruited me through the Blind Talent Auction using only my Rust EVM telemetry.", metrics: "Rust EVM" },
  { name: "Fatima Noor", role: "Quantitative Analyst", firm: "DE Shaw", firmColor: "#be123c", photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80", quote: "Ranked in the Top 2% on the Global Leaderboard. DE Shaw reached out the next morning.", metrics: "Time-Series" },
  { name: "Julian Brooks", role: "Trading Systems", firm: "Akuna Capital", firmColor: "#0f766e", photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80", quote: "Bypassed the HackerRank because of my verified C++ memory models badge.", metrics: "Memory Models" },
  { name: "Nina Pavlovic", role: "Core Network", firm: "Cloudflare", firmColor: "#f58220", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80", quote: "Ran raw eBPF networking scripts and had SkillBridge cryptographically attest packet rates.", metrics: "XDP / eBPF" }
];

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
export default function Home({ user, score = 0, applicationsCount = 0, onNavigate }) {
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [paletteIdx, setPaletteIdx] = useState(0);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSuperdayModalOpen, setIsSuperdayModalOpen] = useState(false);

  // Advanced Profile State for Dynamic Scoring
  const [profileData, setProfileData] = useState({
    college: "NIT Warangal / IIT Guwahati",
    tier: "Tier 1",
    degree: "BSc Hons Data Science & AI",
    gpa: "9.2",
    cfHandle: "furlong",
    githubHandle: "torvalds",
    currentLocation: "Hyderabad, India",
    workLocation: "Singapore / London",
    assessmentsPassed: 0,
    projectsVerified: 0
  });

  const subtlePalettes = [
    { gradient: "linear-gradient(135deg, #7c3aed 0%, #ff3d9a 100%)", accent: "#7c3aed", glow: "rgba(124, 58, 237, 0.22)", iconBg: "#ede9fe", tagBg: "#ede9fe", tagColor: "#5b21b6" },
    { gradient: "linear-gradient(135deg, #0284c7 0%, #0d9488 100%)", accent: "#0284c7", glow: "rgba(2, 132, 199, 0.22)", iconBg: "#e0f2fe", tagBg: "#e0f2fe", tagColor: "#0369a1" },
    { gradient: "linear-gradient(135deg, #ea580c 0%, #eab308 100%)", accent: "#ea580c", glow: "rgba(234, 88, 12, 0.22)", iconBg: "#ffedd5", tagBg: "#ffedd5", tagColor: "#c2410c" }
  ];

  const currentPalette = subtlePalettes[paletteIdx];
  const currentQuote = QUOTES[quoteIdx] || QUOTES[0];

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIdx((prev) => (prev + 1) % QUOTES.length);
      setPaletteIdx((prev) => (prev + 1) % subtlePalettes.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Strict Profile Strength Calculation
  const calculateProfileStrength = () => {
    let strength = 0;
    if (profileData.tier === "Elite (Stanford/MIT)") strength += 15;
    else if (profileData.tier === "Tier 1") strength += 10;
    else if (profileData.tier === "Tier 2") strength += 5;
    else strength += 2; 

    const gpaVal = parseFloat(profileData.gpa);
    if (gpaVal >= 9.5) strength += 5;
    else if (gpaVal >= 8.5) strength += 3;
    else if (gpaVal >= 7.5) strength += 1;

    strength += Math.min(profileData.assessmentsPassed * 8, 40); 
    strength += Math.min(profileData.projectsVerified * 10, 40); 

    return Math.min(strength, 100);
  };

  const profileStrength = calculateProfileStrength();
  const displayScore = score > 0 ? score : 350 + (profileData.assessmentsPassed * 85) + (profileData.projectsVerified * 110);

  const growthCurvePoints = [
    { label: "W1", score: 210, x: 20, y: 130 },
    { label: "W2", score: 280, x: 80, y: 112 },
    { label: "W3", score: 360, x: 140, y: 90 },
    { label: "W4", score: 440, x: 200, y: 68 },
    { label: "W5", score: 510, x: 260, y: 44 },
    { label: "Now", score: displayScore > 742 ? 742 : displayScore, x: 320, y: 24 } 
  ];
  const polylineStr = growthCurvePoints.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPolygonStr = `20,150 ${polylineStr} 320,150`;

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsProfileModalOpen(false);
  };

  return (
    <div style={homeStyles.container}>
      
      {/* 1. HERO BANNER */}
      <div style={{ ...homeStyles.heroCard, borderLeft: `8px solid ${currentPalette.accent}`, boxShadow: `6px 6px 0px var(--shadow-main), 0 12px 32px ${currentPalette.glow}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "18px" }}>
          <div style={{ flex: 1, minWidth: "320px" }}>
            <div style={homeStyles.badgeRow}>
              <span style={homeStyles.sectionMiniTag}>CAREER COMMAND CENTER · PROOF-OF-WORK OS</span>
              <span style={{ ...homeStyles.dynamicTagBadge, backgroundColor: currentPalette.tagBg, color: currentPalette.tagColor, border: `1.5px solid ${currentPalette.accent}` }}>
                ✦ #{currentQuote.tag}
              </span>
            </div>
            <h1 style={homeStyles.mainHeading}>
              Build proof. <span style={{ backgroundImage: currentPalette.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Get noticed.</span>
            </h1>
            <div style={homeStyles.quoteBox}>
              <div style={{ ...homeStyles.quoteIcon, color: currentPalette.accent }}>“</div>
              <div style={{ flex: 1 }}>
                <p style={homeStyles.quoteText}>{currentQuote.quote}</p>
                <div style={homeStyles.quoteAuthor}>— <strong>{currentQuote.author}</strong></div>
              </div>
            </div>
            <p style={homeStyles.subHeading}>
              Target Track: <strong>Quantitative Developer (C++ / HFT)</strong> · Candidate ID: <strong style={{ color: currentPalette.accent }}>#SB-810492</strong>
            </p>
          </div>

          <div style={homeStyles.fastTrackStatusBadge} onClick={() => setIsSuperdayModalOpen(true)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "10px", fontWeight: "900", color: "var(--green-text)" }}>● FAST-TRACK CLEARANCE</span>
              <span style={homeStyles.superdayPill}>SUPERDAY ACTIVE ⚡</span>
            </div>
            <div style={{ fontSize: "14px", fontWeight: "900", color: "var(--text-main)", marginTop: "4px" }}>
              {profileStrength >= 80 ? "Top 4.2% · Direct OA Bypass" : "Rank too low for bypass"}
            </div>
            <div style={{ fontSize: "10px", color: "var(--green-text)", fontWeight: "700", marginTop: "2px" }}>Click to view firm interview invitations ➔</div>
          </div>
        </div>
      </div>

      {/* 2. 3D FLIP METRIC CARDS */}
      <div style={homeStyles.metricsGrid}>
        {[
          { title: "Skill Score", icon: "🏆", tag: "INDEX", val: displayScore, sub: profileStrength >= 80 ? "Top 18%" : "Bottom 50%", nav: "Assessments" },
          { title: "Profile Strength", icon: "👤", tag: "READINESS", val: `${profileStrength}%`, sub: `${100 - profileStrength}% gap`, nav: "Skill Profile" },
          { title: "Verified Skills", icon: "⚡", tag: "PROOF", val: profileData.assessmentsPassed + profileData.projectsVerified, sub: "Attested", nav: "Skill Profile" },
          { title: "Job Matches", icon: "🎯", tag: "MATCHES", val: profileStrength >= 80 ? "24" : "2", sub: profileStrength >= 80 ? "8 High Match" : "0 High Match", nav: "Jobs" },
          { title: "Benchmarked Repos", icon: "💻", tag: "HARDWARE", val: profileData.projectsVerified, sub: "Zero-Heap", nav: "Projects" }
        ].map((c, i) => (
          <div className="flip-card-container" key={i} style={flipStyles.container}>
            <div className="flip-card-inner" style={flipStyles.inner}>
              <div style={{ ...flipStyles.face, ...flipStyles.front, background: "var(--bg-main)", boxShadow: `3px 3px 0px ${currentPalette.accent}, 3px 3px 0px var(--shadow-main)` }}>
                <div style={flipStyles.frontTopRow}>
                  <span style={{ ...flipStyles.frontCategoryPill, backgroundColor: currentPalette.iconBg, color: currentPalette.accent }}>{c.tag}</span>
                  <span style={flipStyles.frontLivePulse}>● ACTIVE</span>
                </div>
                <div style={flipStyles.frontCenteredRow}>
                  <div style={{ ...flipStyles.frontIconCircle, backgroundColor: currentPalette.iconBg, borderColor: currentPalette.accent }}>{c.icon}</div>
                  <h3 style={flipStyles.frontTitle}>{c.title}</h3>
                </div>
              </div>

              <div style={{ ...flipStyles.face, ...flipStyles.back }}>
                <div style={homeStyles.cardHeader}>
                  <span style={homeStyles.cardLabel}>{c.title.toUpperCase()}</span>
                  <span style={homeStyles.badgeGreen}>Active</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={homeStyles.bigScoreNumber}>{c.val}</div>
                </div>
                <div style={homeStyles.cardFooter}>
                  <span style={homeStyles.subtextMuted}>{c.sub}</span>
                  <button onClick={() => onNavigate(c.nav)} style={homeStyles.actionLinkBtn}>Inspect →</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. QUICK ACTIONS BAR */}
      <div style={homeStyles.quickActionsBar}>
        <div style={homeStyles.quickActionsTitle}>
          <span style={{ fontSize: "10px", fontWeight: "900", color: "#9ca3af" }}>COMMAND SHORTCUTS</span>
          <div style={{ fontSize: "14px", fontWeight: "900", color: "#fff" }}>What do you want to accomplish today?</div>
        </div>
        <div style={homeStyles.quickButtonsGroup}>
          <button onClick={() => onNavigate("Jobs")} style={homeStyles.quickBtn}>▤ Find Jobs</button>
          <button onClick={() => onNavigate("Assessments")} style={homeStyles.quickBtn}>✓ Take Assessment</button>
          <button onClick={() => onNavigate("Projects")} style={homeStyles.quickBtn}>+ Add Project</button>
          <button onClick={() => onNavigate("Career Copilot")} style={homeStyles.quickBtn}>✦ Ask Copilot</button>
          <button onClick={() => onNavigate("Messages")} style={homeStyles.quickBtnSpecial}>💬 Messages ({applicationsCount + 3})</button>
        </div>
      </div>

      {/* 4. GROWTH CURVE & PROFILE WIDGET */}
      <div style={homeStyles.growthSectionGrid}>
        <div style={homeStyles.growthCurveCard}>
          <div style={homeStyles.cardTitleRow}>
            <div>
              <span style={homeStyles.subHeadingTag}>RATING ACCELERATION</span>
              <h3 style={homeStyles.blockHeading}>Verified Skill Score Growth Curve</h3>
            </div>
            <span style={homeStyles.badgeGreen}>+332 pts over 5 Weeks</span>
          </div>
          <div style={homeStyles.growthSvgWrapper}>
            <svg viewBox="0 0 340 160" style={{ width: "100%", height: "200px" }}>
              <defs>
                <linearGradient id="scoreAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={currentPalette.accent} stopOpacity="0.35" />
                  <stop offset="100%" stopColor={currentPalette.accent} stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {[40, 80, 120].map((y, idx) => (<line key={idx} x1="20" y1={y} x2="320" y2={y} stroke="var(--muted-border)" strokeDasharray="3,3" />))}
              <polygon points={areaPolygonStr} fill="url(#scoreAreaGrad)" />
              <polyline points={polylineStr} fill="none" stroke={currentPalette.accent} strokeWidth="4" strokeLinecap="round" />
              {growthCurvePoints.map((pt, idx) => (
                <g key={idx} onMouseEnter={() => setHoveredPoint(pt)} onMouseLeave={() => setHoveredPoint(null)}>
                  <circle cx={pt.x} cy={pt.y} r="5" fill="#ffea28" stroke="var(--border-main)" strokeWidth="2.5" />
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* High-Difficulty Dynamic Profile Completion Block */}
        <div style={homeStyles.profileWidgetCard}>
          <div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "12px" }}>
              <div style={homeStyles.avatarBoxWidget}>
                {"F"}
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: "15px", fontWeight: "900" }}>furlong</h4>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{profileData.degree}</span>
              </div>
            </div>

            <div style={homeStyles.profileStatsSmallBox}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: "800", marginBottom: "4px" }}>
                <span>PROFILE MULTIPLIER</span>
                <span style={{ color: "#7c3aed" }}>{profileStrength}%</span>
              </div>
              <div style={homeStyles.progressBarTrack}>
                <div style={{ width: `${profileStrength}%`, height: "100%", background: "linear-gradient(90deg, #ff3d9a, #8b5cf6)", transition: "width 1s ease" }} />
              </div>

              {/* Conditional Elite Certificates */}
              {profileStrength >= 90 ? (
                <div style={{ marginTop: "8px", backgroundColor: "#fef08a", color: "#854d0e", padding: "6px 10px", borderRadius: "6px", fontSize: "10px", fontWeight: "900", border: "1px solid #ca8a04", display: "flex", alignItems: "center", gap: "6px" }}>
                  🏆 CERTIFICATE OF TOP NOTCH PROFILE
                </div>
              ) : profileStrength >= 80 ? (
                <div style={{ marginTop: "8px", backgroundColor: "#e0e7ff", color: "#3730a3", padding: "6px 10px", borderRadius: "6px", fontSize: "10px", fontWeight: "900", border: "1px solid #4f46e5", display: "flex", alignItems: "center", gap: "6px" }}>
                  🏅 CERTIFICATE OF EXCELLENCE
                </div>
              ) : null}
              
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
                <div style={homeStyles.checklistItem}>
                  <span style={homeStyles.checkCircleGreen}>✓</span>
                  <div>
                    <strong style={{ fontSize: "10px", display: "block" }}>Academic Baseline ({profileData.tier})</strong>
                    <span style={{ fontSize: "9px", color: "var(--text-muted)" }}>{profileData.college} · GPA: {profileData.gpa}</span>
                  </div>
                </div>
                <div style={homeStyles.checklistItem}>
                  <span style={profileData.assessmentsPassed === 5 ? homeStyles.checkCircleGreen : homeStyles.checkCircleEmpty}>
                    {profileData.assessmentsPassed === 5 ? "✓" : ""}
                  </span>
                  <div>
                    <strong style={{ fontSize: "10px", display: "block", color: profileData.assessmentsPassed === 5 ? "var(--text-main)" : "var(--text-muted)" }}>
                      Verified Assessments ({profileData.assessmentsPassed}/5)
                    </strong>
                    <span style={{ fontSize: "9px", color: "var(--text-muted)" }}>Pass intense core track tests to boost visibility.</span>
                  </div>
                </div>
                <div style={homeStyles.checklistItem}>
                  <span style={profileData.projectsVerified === 4 ? homeStyles.checkCircleGreen : homeStyles.checkCircleEmpty}>
                    {profileData.projectsVerified === 4 ? "✓" : ""}
                  </span>
                  <div>
                    <strong style={{ fontSize: "10px", display: "block", color: profileData.projectsVerified === 4 ? "var(--text-main)" : "var(--text-muted)" }}>
                      Hardware-Verified Projects ({profileData.projectsVerified}/4)
                    </strong>
                    <span style={{ fontSize: "9px", color: "var(--text-muted)" }}>Link GitHub repos for cryptographic telemetry extraction.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button onClick={() => setIsProfileModalOpen(true)} style={homeStyles.completeProfileWideBtn}>
            Edit &amp; Optimize Profile ⚙️
          </button>
        </div>
      </div>

      {/* ==========================================================================
         5. CONTINUOUS SLOW-SCROLLING ONE-LINE TESTIMONIALS MARQUEE (100s SPEED)
         ========================================================================== */}
      <div style={homeStyles.testimonialsSection}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <span style={{ fontSize: "10px", fontWeight: "900", color: "#7c3aed", letterSpacing: "1px", backgroundColor: "var(--bg-card)", padding: "3px 10px", borderRadius: "8px", border: "1px solid var(--border-main)" }}>VERIFIED PLACEMENTS</span>
          <h3 style={{ margin: "10px 0 4px 0", fontSize: "22px", fontWeight: "900" }}>Engineers Standing Behind Their Dream Companies</h3>
          <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted)" }}>Smooth slow-gliding marquee tracking candidates who secured elite positions.</p>
        </div>

        {/* Marquee Wrapper Container */}
        <div style={homeStyles.marqueeOuter}>
          <div style={homeStyles.marqueeTrack}>
            {/* Duplicated array to create a seamless infinite loop */}
            {[...TESTIMONIALS_DATA, ...TESTIMONIALS_DATA].map((t, idx) => (
              <div key={idx} style={homeStyles.testimonialCard}>
                <div style={{ position: "relative", height: "130px", backgroundColor: t.firmColor, overflow: "hidden", borderBottom: "2px solid var(--border-main)" }}>
                  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "36px", fontWeight: "900", color: "#fff", opacity: 0.2, whiteSpace: "nowrap", letterSpacing: "2px" }}>
                    {t.firm.toUpperCase()}
                  </div>
                  <img
                    src={t.photo}
                    alt={t.name}
                    loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover", position: "relative", zIndex: 1, filter: "contrast(1.05) saturate(1.05)" }}
                  />
                  <div style={{ position: "absolute", bottom: "8px", right: "8px", backgroundColor: t.firmColor, color: "#fff", padding: "2px 6px", borderRadius: "4px", fontSize: "9px", fontWeight: "900", border: "1px solid #fff", boxShadow: "1px 1px 0px #000", zIndex: 2 }}>
                    🏢 {t.firm}
                  </div>
                </div>

                <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, backgroundColor: "var(--bg-card)" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2px" }}>
                      <h4 style={{ margin: 0, fontSize: "13px", fontWeight: "900" }}>{t.name}</h4>
                      <span style={{ fontSize: "8px", fontWeight: "900", color: "var(--green-text)", backgroundColor: "var(--green-bg)", padding: "1px 4px", borderRadius: "3px", border: "1px solid var(--green-border)" }}>HIRED</span>
                    </div>
                    <div style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: "800", marginBottom: "6px" }}>{t.role}</div>
                    <p style={{ margin: 0, fontSize: "11px", color: "var(--text-main)", lineHeight: "1.3", fontStyle: "italic", opacity: 0.85 }}>
                      "{t.quote}"
                    </p>
                  </div>
                  <div style={{ marginTop: "8px", paddingTop: "6px", borderTop: "1px dashed var(--muted-border)", fontSize: "9px", fontWeight: "900", color: "var(--green-border)" }}>
                    ✓ {t.metrics}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ==========================================================================
          MODALS (Detailed Profile Input with Hard Difficulty Logic)
         ========================================================================== */}
      {isSuperdayModalOpen && (
        <div style={modalStyles.overlay} onClick={() => setIsSuperdayModalOpen(false)}>
          <div style={modalStyles.card} onClick={(e) => e.stopPropagation()}>
            <div style={modalStyles.header}>
              <div>
                <span style={{ fontSize: "10px", fontWeight: "900", color: "var(--green-border)", letterSpacing: "1px" }}>FAST-PASS RECRUITER CLEARANCE</span>
                <h2 style={{ margin: "2px 0 0 0", fontSize: "20px", fontWeight: "900" }}>Active Superday Radar</h2>
              </div>
              <button onClick={() => setIsSuperdayModalOpen(false)} style={modalStyles.closeBtn}>✕</button>
            </div>
            
            {profileStrength >= 80 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "14px 0" }}>
                <div style={{ backgroundColor: "var(--bg-card)", border: "1.5px solid var(--border-main)", borderRadius: "8px", padding: "10px 12px", boxShadow: "2px 2px 0px var(--shadow-main)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <strong>Jane Street Capital</strong>
                    <span style={{ backgroundColor: "var(--green-bg)", color: "var(--green-text)", border: "1px solid var(--border-main)", borderRadius: "4px", padding: "1px 4px", fontSize: "9px", fontWeight: "900" }}>OA Bypassed</span>
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Quant Developer Intern · C++20 Zero-Heap Verified</div>
                </div>
              </div>
            ) : (
              <div style={{ padding: "20px", textAlign: "center", border: "1px dashed #ef4444", borderRadius: "8px", backgroundColor: "#fef2f2", color: "#991b1b", margin: "14px 0" }}>
                <strong>Insufficient Profile Strength</strong>
                <p style={{ fontSize: "12px", margin: "4px 0 0 0" }}>You must reach at least 80% multiplier to bypass standard ATS queues and access direct superdays.</p>
              </div>
            )}
            
            <button onClick={() => { setIsSuperdayModalOpen(false); onNavigate("Messages"); }} style={modalStyles.saveBtn}>
              {profileStrength >= 80 ? "Open Direct Messages to Schedule ➔" : "Close Radar"}
            </button>
          </div>
        </div>
      )}

      {isProfileModalOpen && (
        <div style={modalStyles.overlay} onClick={() => setIsProfileModalOpen(false)}>
          <div style={{ ...modalStyles.card, maxWidth: "600px" }} onClick={(e) => e.stopPropagation()}>
            <div style={modalStyles.header}>
              <div>
                <span style={{ fontSize: "10px", fontWeight: "900", color: "#7c3aed", letterSpacing: "1px" }}>CANDIDATE ONBOARDING</span>
                <h2 style={{ margin: "2px 0 0 0", fontSize: "20px", fontWeight: "900" }}>Optimize Your Profile Multiplier</h2>
              </div>
              <button onClick={() => setIsProfileModalOpen(false)} style={modalStyles.closeBtn}>✕</button>
            </div>
            
            <form onSubmit={handleSaveProfile} style={modalStyles.form}>
              {/* Row 1: College & Tier */}
              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "12px" }}>
                <div style={modalStyles.inputGroup}>
                  <label style={modalStyles.label}>Institution / University Name</label>
                  <input type="text" value={profileData.college} onChange={(e) => setProfileData({ ...profileData, college: e.target.value })} style={modalStyles.input} required />
                </div>
                <div style={modalStyles.inputGroup}>
                  <label style={modalStyles.label}>University Tier (Base Score)</label>
                  <select value={profileData.tier} onChange={(e) => setProfileData({ ...profileData, tier: e.target.value })} style={modalStyles.select}>
                    <option value="Elite (Stanford/MIT)">Elite (Stanford/MIT/Ivy) - 15% Base</option>
                    <option value="Tier 1">Tier 1 (IIT/NIT/BITS) - 10% Base</option>
                    <option value="Tier 2">Tier 2 (State Top) - 5% Base</option>
                    <option value="Tier 3">Tier 3 (Local/Private) - 2% Base</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Degree & CGPA */}
              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "12px" }}>
                <div style={modalStyles.inputGroup}>
                  <label style={modalStyles.label}>Degree & Branch</label>
                  <input type="text" value={profileData.degree} onChange={(e) => setProfileData({ ...profileData, degree: e.target.value })} style={modalStyles.input} placeholder="e.g., BSc Hons Data Science & AI" required />
                </div>
                <div style={modalStyles.inputGroup}>
                  <label style={modalStyles.label}>Current CGPA / GPA</label>
                  <input type="number" step="0.1" max="10" value={profileData.gpa} onChange={(e) => setProfileData({ ...profileData, gpa: e.target.value })} style={modalStyles.input} required />
                </div>
              </div>

              {/* Row 3: Action Simulator (Hard Mode) */}
              <div style={{ padding: "12px", backgroundColor: "var(--bg-main)", border: "1.5px dashed var(--muted-border)", borderRadius: "8px", margin: "8px 0" }}>
                <div style={{ fontSize: "11px", fontWeight: "800", color: "var(--text-main)", marginBottom: "8px" }}>TELEMETRY SYNCHRONIZATION (MOCK ACTIONS)</div>
                <p style={{ fontSize: "10px", color: "var(--text-muted)", margin: "0 0 8px 0", lineHeight: "1.3" }}>Crossing 50% is intentionally difficult. You must grind verified assessments (5 max) and real hardware-attested GitHub repositories (4 max).</p>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <button type="button" onClick={() => setProfileData(p => ({ ...p, assessmentsPassed: Math.min(p.assessmentsPassed + 1, 5) }))} style={{ ...homeStyles.quickBtn, padding: "6px 10px", fontSize: "10px", border: "1.5px solid var(--border-main)" }}>
                    + Complete Assessment (+8%)
                  </button>
                  <button type="button" onClick={() => setProfileData(p => ({ ...p, projectsVerified: Math.min(p.projectsVerified + 1, 4) }))} style={{ ...homeStyles.quickBtn, padding: "6px 10px", fontSize: "10px", border: "1.5px solid var(--border-main)" }}>
                    + Connect GitHub Repo (+10%)
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button type="button" onClick={() => setIsProfileModalOpen(false)} style={modalStyles.cancelBtn}>Cancel</button>
                <button type="submit" style={modalStyles.saveBtn}>Recalculate &amp; Save Profile 🚀</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global CSS for Theme & Marquee */}
      <style>{`
        :root {
          --bg-main: #ffffff;
          --bg-card: #fdfbf7;
          --text-main: #000000;
          --text-muted: #4b5563;
          --border-main: #000000;
          --shadow-main: #000000;
          --invert-bg: #000000;
          --invert-text: #ffffff;
          --muted-border: #cbd5e1;
          --green-bg: #bbf7d0;
          --green-text: #166534;
          --green-border: #16a34a;
        }
        @keyframes marqueeSlow {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .flip-card-container {
          perspective: 1000px;
          position: relative;
          z-index: 1;
        }
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform-style: preserve-3d;
        }
        .flip-card-container:hover {
          z-index: 50;
        }
        .flip-card-container:hover .flip-card-inner {
          transform: rotateY(180deg) translateZ(30px) scale(1.06);
        }
      `}</style>
    </div>
  );
}

/* ==========================================================================
   STYLES
   ========================================================================== */
const homeStyles = {
  container: { padding: "24px", width: "100%", backgroundColor: "var(--bg-main)", color: "var(--text-main)", fontFamily: "'Space Grotesk', system-ui, sans-serif", boxSizing: "border-box", overflowX: "hidden", minHeight: "100vh" },
  heroCard: { backgroundColor: "var(--bg-main)", border: "2.5px solid var(--border-main)", borderRadius: "18px", padding: "24px 28px", marginBottom: "20px" },
  badgeRow: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", flexWrap: "wrap" },
  sectionMiniTag: { fontSize: "11px", fontWeight: "900", color: "var(--text-muted)", letterSpacing: "1px" },
  dynamicTagBadge: { borderRadius: "6px", padding: "2px 8px", fontSize: "10px", fontWeight: "900", letterSpacing: "0.5px" },
  mainHeading: { fontSize: "40px", fontWeight: "900", margin: "0 0 10px 0", letterSpacing: "-1.5px", color: "var(--text-main)", lineHeight: "1.1" },
  quoteBox: { display: "flex", gap: "12px", backgroundColor: "var(--bg-card)", border: "2px solid var(--border-main)", borderRadius: "12px", padding: "12px 18px", margin: "12px 0 14px 0", boxShadow: "3px 3px 0px var(--shadow-main)" },
  quoteIcon: { fontSize: "32px", fontWeight: "900", lineHeight: "0.8" },
  quoteText: { margin: 0, fontSize: "14px", fontWeight: "800", color: "var(--text-main)", lineHeight: "1.4" },
  quoteAuthor: { fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" },
  subHeading: { fontSize: "13px", color: "var(--text-muted)", margin: 0 },
  metricsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", marginBottom: "20px" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" },
  cardLabel: { fontSize: "9px", fontWeight: "900", color: "var(--text-muted)", letterSpacing: "0.5px" },
  badgeGreen: { backgroundColor: "var(--green-bg)", color: "var(--green-text)", border: "1px solid var(--border-main)", borderRadius: "4px", padding: "1px 4px", fontSize: "9px", fontWeight: "900" },
  bigScoreNumber: { fontSize: "26px", fontWeight: "900", color: "var(--text-main)", letterSpacing: "-1px" },
  cardFooter: { display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed var(--muted-border)", paddingTop: "6px", marginTop: "2px" },
  subtextMuted: { fontSize: "8px", fontWeight: "800", color: "var(--text-muted)" },
  actionLinkBtn: { background: "none", border: "none", fontSize: "10px", fontWeight: "900", color: "var(--text-main)", cursor: "pointer", padding: 0, textDecoration: "underline" },
  quickActionsBar: { backgroundColor: "var(--invert-bg)", borderRadius: "16px", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", boxShadow: "4px 4px 0px #ff3d9a", flexWrap: "wrap", gap: "14px" },
  quickActionsTitle: { display: "flex", flexDirection: "column", gap: "2px" },
  quickButtonsGroup: { display: "flex", gap: "8px", flexWrap: "wrap" },
  quickBtn: { backgroundColor: "#1e1e24", color: "#fff", border: "1.5px solid var(--border-main)", borderRadius: "8px", padding: "8px 14px", fontSize: "12px", fontWeight: "800", cursor: "pointer" },
  quickBtnSpecial: { backgroundColor: "#ffea28", color: "#000", border: "1.5px solid var(--border-main)", borderRadius: "8px", padding: "8px 14px", fontSize: "12px", fontWeight: "900", cursor: "pointer", boxShadow: "2px 2px 0px #ff3d9a" },
  growthSectionGrid: { display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "20px", marginBottom: "24px" },
  growthCurveCard: { backgroundColor: "var(--bg-main)", border: "2.5px solid var(--border-main)", borderRadius: "16px", padding: "20px", boxShadow: "5px 5px 0px var(--shadow-main)" },
  cardTitleRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" },
  subHeadingTag: { fontSize: "10px", fontWeight: "900", color: "var(--text-muted)" },
  blockHeading: { margin: "2px 0 0 0", fontSize: "18px", fontWeight: "900" },
  growthSvgWrapper: { position: "relative", padding: "10px 0" },
  profileWidgetCard: { backgroundColor: "var(--bg-main)", border: "2.5px solid var(--border-main)", borderRadius: "16px", padding: "20px", boxShadow: "5px 5px 0px var(--shadow-main)", display: "flex", flexDirection: "column", justifyContent: "space-between" },
  avatarBoxWidget: { width: "38px", height: "38px", borderRadius: "10px", backgroundColor: "var(--invert-bg)", color: "var(--invert-text)", border: "2px solid var(--border-main)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "16px" },
  profileStatsSmallBox: { backgroundColor: "var(--bg-card)", border: "1.5px solid var(--border-main)", borderRadius: "10px", padding: "12px", marginTop: "8px" },
  progressBarTrack: { height: "6px", backgroundColor: "var(--muted-border)", borderRadius: "4px", overflow: "hidden", margin: "6px 0", border: "1px solid var(--border-main)" },
  completeProfileWideBtn: { backgroundColor: "var(--bg-main)", color: "var(--text-main)", border: "2px solid var(--border-main)", borderRadius: "10px", padding: "10px", fontWeight: "900", fontSize: "12px", cursor: "pointer", boxShadow: "3px 3px 0px var(--shadow-main)", width: "100%", marginTop: "12px" },
  checklistItem: { display: "flex", alignItems: "flex-start", gap: "8px" },
  checkCircleGreen: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: "14px", height: "14px", borderRadius: "50%", backgroundColor: "var(--green-border)", color: "#fff", fontSize: "9px", fontWeight: "900", marginTop: "2px" },
  checkCircleEmpty: { display: "inline-block", width: "14px", height: "14px", borderRadius: "50%", border: "1.5px solid var(--muted-border)", marginTop: "2px" },
  
  // Marquee Styles
  testimonialsSection: { marginTop: "32px", backgroundColor: "var(--bg-main)", border: "2.5px solid var(--border-main)", borderRadius: "18px", padding: "24px 0", boxShadow: "5px 5px 0px var(--shadow-main)", overflow: "hidden" },
  marqueeOuter: { width: "100%", overflow: "hidden", display: "flex", position: "relative", padding: "10px 0" },
  marqueeTrack: { display: "flex", gap: "16px", width: "max-content", animation: "marqueeSlow 100s linear infinite" },
  testimonialCard: { backgroundColor: "var(--bg-card)", border: "2px solid var(--border-main)", borderRadius: "12px", overflow: "hidden", boxShadow: "3px 3px 0px var(--shadow-main)", display: "flex", flexDirection: "column", width: "260px", flexShrink: 0 }
};

const flipStyles = {
  container: { backgroundColor: "transparent", minHeight: "135px", cursor: "pointer", position: "relative" },
  inner: { minHeight: "135px", width: "100%", height: "100%", transition: "transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)", transformStyle: "preserve-3d" },
  face: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", borderRadius: "16px", border: "2.5px solid var(--border-main)", padding: "12px 14px", boxSizing: "border-box", display: "flex", flexDirection: "column" },
  front: { justifyContent: "space-between", zIndex: 2 },
  frontTopRow: { display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" },
  frontCenteredRow: { display: "flex", alignItems: "center", justifyContent: "flex-start", gap: "12px", flex: 1, width: "100%" },
  back: { backgroundColor: "var(--bg-main)", transform: "rotateY(180deg)", boxShadow: "6px 6px 0px var(--shadow-main)", justifyContent: "space-between", zIndex: 1 },
  frontCategoryPill: { fontSize: "9px", fontWeight: "900", letterSpacing: "0.8px", padding: "2px 7px", borderRadius: "6px", border: "1px solid var(--border-main)", textTransform: "uppercase" },
  frontLivePulse: { fontSize: "8px", fontWeight: "900", color: "var(--green-border)" },
  frontIconCircle: { width: "36px", height: "36px", minWidth: "36px", borderRadius: "10px", border: "2px solid var(--border-main)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", boxShadow: "2px 2px 0px var(--shadow-main)" },
  frontTitle: { margin: 0, fontSize: "16px", fontWeight: "900", color: "var(--text-main)", letterSpacing: "-0.4px" }
};

const modalStyles = {
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.65)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px" },
  card: { backgroundColor: "var(--bg-main)", color: "var(--text-main)", border: "3px solid var(--border-main)", borderRadius: "20px", boxShadow: "8px 8px 0px var(--shadow-main)", maxWidth: "520px", width: "100%", padding: "26px", fontFamily: "'Space Grotesk', system-ui, sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid var(--border-main)", paddingBottom: "12px", marginBottom: "14px" },
  closeBtn: { background: "none", color: "var(--text-main)", border: "2px solid var(--border-main)", borderRadius: "6px", width: "28px", height: "28px", fontWeight: "900", cursor: "pointer", boxShadow: "2px 2px 0px var(--shadow-main)" },
  form: { display: "flex", flexDirection: "column", gap: "10px", textAlign: "left" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "4px" },
  label: { fontSize: "11px", fontWeight: "900", color: "var(--text-muted)" },
  input: { padding: "9px 12px", color: "var(--invert-text)", border: "2px solid var(--border-main)", borderRadius: "8px", fontSize: "13px", fontWeight: "600", backgroundColor: "var(--invert-bg)", outline: "none" },
  select: { padding: "9px 12px", color: "var(--invert-text)", border: "2px solid var(--border-main)", borderRadius: "8px", fontSize: "13px", fontWeight: "700", backgroundColor: "var(--invert-bg)", cursor: "pointer" },
  cancelBtn: { backgroundColor: "var(--bg-main)", color: "var(--text-main)", border: "2px solid var(--border-main)", borderRadius: "8px", padding: "10px 16px", fontWeight: "800", fontSize: "12px", cursor: "pointer", boxShadow: "2px 2px 0px var(--shadow-main)" },
  saveBtn: { flex: 1, backgroundColor: "var(--invert-bg)", color: "var(--invert-text)", border: "2px solid var(--border-main)", borderRadius: "8px", padding: "10px 16px", fontWeight: "900", fontSize: "12px", cursor: "pointer", boxShadow: "3px 3px 0px #ff3d9a" }
};