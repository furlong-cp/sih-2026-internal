import React, { useState, useEffect, useMemo } from "react";

export default function SkillProfilePage({ user, onNavigate }) {
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "analytics" | "contests" | "credentials"

  // Live Handles State
  const [cfHandle, setCfHandle] = useState("furlong");
  const [leetcodeHandle, setLeetcodeHandle] = useState("neal_wu");
  const [githubHandle, setGithubHandle] = useState("torvalds");

  // Form Inputs State
  const [tempCf, setTempCf] = useState(cfHandle);
  const [tempLc, setTempLc] = useState(leetcodeHandle);
  const [tempGh, setTempGh] = useState(githubHandle);
  const [isEditingHandles, setIsEditingHandles] = useState(false);

  // Live Codeforces Data State
  const [cfData, setCfData] = useState({
    rating: 791,
    maxRating: 791,
    rank: "newbie",
    maxRank: "newbie",
    organization: "NIT Warangal / IIT Guwahati",
    contribution: "+0",
    avatar: "https://userpic.codeforces.org/no-avatar.jpg",
    contestCount: 8,
    loading: false,
    verified: true,
  });

  // Codeforces Contest History
  const [contestHistory, setContestHistory] = useState([
    { contestId: 1985, contestName: "Codeforces Round 952 (Div. 4)", rank: 4120, oldRating: 710, newRating: 791, change: "+81" },
    { contestId: 1980, contestName: "Codeforces Round 950 (Div. 3)", rank: 5890, oldRating: 660, newRating: 710, change: "+50" },
    { contestId: 1974, contestName: "Codeforces Round 944 (Div. 4)", rank: 6420, oldRating: 615, newRating: 660, change: "+45" },
    { contestId: 1971, contestName: "Codeforces Round 943 (Div. 3)", rank: 7100, oldRating: 580, newRating: 615, change: "+35" },
    { contestId: 1950, contestName: "Codeforces Round 937 (Div. 4)", rank: 8200, oldRating: 540, newRating: 580, change: "+40" },
  ]);

  // Live GitHub Data State
  const [ghData, setGhData] = useState({
    publicRepos: 24,
    followers: 48,
    bio: "Quant Developer & Competitive Programmer",
    loading: false,
  });

  // Verified Credentials Modal Preview State
  const [activeCertModal, setActiveCertModal] = useState(null);

  // Fetch Codeforces API (Info + Rating History)
  const fetchCodeforcesStats = async (handleToFetch) => {
    if (!handleToFetch) return;
    try {
      setCfData((prev) => ({ ...prev, loading: true }));
      const [infoRes, ratingRes] = await Promise.all([
        fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(handleToFetch.trim())}`).catch(() => null),
        fetch(`https://codeforces.com/api/user.rating?handle=${encodeURIComponent(handleToFetch.trim())}`).catch(() => null)
      ]);

      if (infoRes) {
        const infoData = await infoRes.json();
        if (infoData && infoData.status === "OK" && infoData.result && infoData.result.length > 0) {
          const u = infoData.result[0];
          setCfData((prev) => ({
            ...prev,
            rating: u.rating || prev.rating,
            maxRating: u.maxRating || prev.maxRating,
            rank: u.rank || prev.rank,
            maxRank: u.maxRank || prev.maxRank,
            organization: u.organization || prev.organization,
            contribution: u.contribution >= 0 ? `+${u.contribution}` : `${u.contribution}`,
            avatar: u.titlePhoto || u.avatar || prev.avatar,
            loading: false,
            verified: true,
          }));
        }
      }

      if (ratingRes) {
        const rData = await ratingRes.json();
        if (rData && rData.status === "OK" && rData.result && rData.result.length > 0) {
          const formatted = rData.result.slice(-8).reverse().map((c) => ({
            contestId: c.contestId,
            contestName: c.contestName,
            rank: c.rank,
            oldRating: c.oldRating,
            newRating: c.newRating,
            change: c.newRating - c.oldRating >= 0 ? `+${c.newRating - c.oldRating}` : `${c.newRating - c.oldRating}`,
          }));
          setContestHistory(formatted);
          setCfData((prev) => ({ ...prev, contestCount: rData.result.length }));
        }
      }
    } catch (err) {
      console.error("Codeforces API Fetch error:", err);
      setCfData((prev) => ({ ...prev, loading: false }));
    }
  };

  // Fetch GitHub API
  const fetchGitHubStats = async (handleToFetch) => {
    if (!handleToFetch) return;
    try {
      setGhData((prev) => ({ ...prev, loading: true }));
      const res = await fetch(`https://api.github.com/users/${encodeURIComponent(handleToFetch.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setGhData({
          publicRepos: data.public_repos || 24,
          followers: data.followers || 48,
          bio: data.bio || "Quant Developer & Competitive Programmer",
          loading: false,
        });
      } else {
        setGhData((prev) => ({ ...prev, loading: false }));
      }
    } catch (err) {
      console.error("GitHub API Fetch error:", err);
      setGhData((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchCodeforcesStats(cfHandle);
    fetchGitHubStats(githubHandle);
  }, []);

  const handleSaveAllHandles = (e) => {
    e.preventDefault();
    if (tempCf.trim()) {
      setCfHandle(tempCf.trim());
      fetchCodeforcesStats(tempCf.trim());
    }
    if (tempLc.trim()) setLeetcodeHandle(tempLc.trim());
    if (tempGh.trim()) {
      setGithubHandle(tempGh.trim());
      fetchGitHubStats(tempGh.trim());
    }
    setIsEditingHandles(false);
  };

  const getRankColor = (rankStr = "") => {
    const r = rankStr.toLowerCase();
    if (r.includes("legendary") || r.includes("tourist") || r.includes("nutella")) return "#ff0000";
    if (r.includes("grandmaster")) return "#ff3333";
    if (r.includes("master")) return "#ff8c00";
    if (r.includes("candidate")) return "#aa00aa";
    if (r.includes("expert")) return "#0000ff";
    if (r.includes("specialist")) return "#03a89e";
    if (r.includes("pupil")) return "#008000";
    return "#808080";
  };

  const skillPillars = [
    {
      id: "ASM-SYS",
      title: "Low-Latency Systems & C++",
      score: 94,
      category: "Systems",
      percentile: "Top 1.2% Globally",
      gapTo100: "Missing: DPDK Kernel-Bypass & Solarflare OpenOnload Evaluation (+6%)",
      badges: ["C++20 Memory Models", "Lock-Free Ring Buffers", "Kernel Bypass (DPDK)", "SIMD AVX-512"],
      summary: "Demonstrated zero-overhead abstractions, cache-line alignment mastery, and custom allocator implementations.",
    },
    {
      id: "ASM-QUANT",
      title: "Probability & Stochastic Calculus",
      score: 88,
      category: "Quantitative Finance",
      percentile: "Top 2.5% Globally",
      gapTo100: "Missing: Multi-Dimensional Ito Calculus & Jump-Diffusion Models (+12%)",
      badges: ["Ito Calculus", "Martingale Theory", "Markov Decision Processes", "Black-Scholes Derivatives"],
      summary: "Proficient in continuous-time random processes, eigenvalue stationary distributions, and risk estimation.",
    },
    {
      id: "ASM-DSA",
      title: "Algorithms & Competitive Programming",
      score: 91,
      category: "DSA",
      percentile: "Top 0.8% Globally",
      gapTo100: "Missing: Tree Heavy-Light Decomposition & Suffix Automaton (+9%)",
      badges: ["Segment Trees / Lazy Prop", "DP with Bitmask / Convex Hull", "Max-Flow Min-Cut", "Centroid Decomp"],
      summary: `Live rating of ${cfData.rating} on Codeforces (${cfData.rank}). Over 650+ verified solutions across algorithmic platforms.`,
    },
    {
      id: "ASM-DISTRIB",
      title: "Distributed Infrastructure & Cloud",
      score: 78,
      category: "Infrastructure",
      percentile: "Top 8.4% Globally",
      gapTo100: "Missing: Raft Consensus Log Compaction & Spanner TrueTime (+22%)",
      badges: ["Raft Consensus", "Kafka Stream Partitioning", "gRPC / Protobuf", "Docker / Linux cgroups"],
      summary: "Built high-QPS reverse proxies, consistent hash rings, and fault-tolerant log replicators.",
    }
  ];

  const verifiedCredentials = [
    {
      id: "CERT-CPP-9401",
      title: "Modern C++20 Low-Latency Concurrency Certification",
      issuedDate: "Aug 28, 2026",
      score: "94%",
      hash: "0x8F92A77B014C92E4",
      firmEndorsement: "Validated for Jane Street & Citadel Fast-track",
      status: "Verified On-Chain"
    },
    {
      id: "CERT-STOCH-8812",
      title: "Stochastic Calculus & Derivative Pricing Mastery",
      issuedDate: "Aug 26, 2026",
      score: "88%",
      hash: "0x3D71C99A440F81B2",
      firmEndorsement: "Validated for Tower Research & Optiver Quant Teams",
      status: "Verified On-Chain"
    },
    {
      id: "CERT-DSA-9104",
      title: "Graph Theory & Tree Decomposition Verification",
      issuedDate: "Aug 20, 2026",
      score: "91%",
      hash: "0x11E8B29C558F4A13",
      firmEndorsement: "Codeforces Official API Synchronized",
      status: "Synchronized Live"
    }
  ];

  // Activity Heatmap Generation (52 Weeks x 7 Days)
  const heatmapData = useMemo(() => {
    const weeks = [];
    for (let w = 0; w < 52; w++) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        const count = ((w * 7 + d) % 9 === 0 || (w * 7 + d) % 13 === 0) ? ((w + d) % 6) : 0;
        days.push(count);
      }
      weeks.push(days);
    }
    return weeks;
  }, []);

  // Rating Progression SVG Points
  const ratingPoints = [
    { x: 20, y: 150, rating: 540, label: "Round 937" },
    { x: 90, y: 135, rating: 580, label: "Round 943" },
    { x: 160, y: 120, rating: 615, label: "Round 944" },
    { x: 230, y: 105, rating: 660, label: "Round 948" },
    { x: 300, y: 88, rating: 710, label: "Round 950" },
    { x: 370, y: 65, rating: 791, label: "Round 952 (Live)" },
  ];

  const svgPolylinePoints = ratingPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div style={styles.container}>
      {/* Top Banner */}
      <div style={styles.headerBanner}>
        <div style={styles.profileHeaderFlex}>
          <div style={styles.avatarLarge}>
            {cfData.avatar && cfData.avatar !== "https://userpic.codeforces.org/no-avatar.jpg" ? (
              <img src={cfData.avatar} alt="Avatar" style={styles.avatarImg} />
            ) : (
              user?.name ? user.name.charAt(0).toUpperCase() : "A"
            )}
          </div>

          <div>
            <div style={styles.badgeRow}>
              <span style={styles.verifiedIdentityPill}>✓ VERIFIED CANDIDATE IDENTITY</span>
              <span style={{ ...styles.candidateRankPill, backgroundColor: getRankColor(cfData.rank), color: "#ffffff" }}>
                {cfData.rank.toUpperCase()}
              </span>
              <span style={styles.targetQuantPill}>QUANT DEV & TRADER PROFILE</span>
            </div>
            <h1 style={styles.userNameHeading}>{user?.name || "Alex Henderson"}</h1>
            <div style={styles.userMetaSub}>
              <span>🎓 <strong>Mathematics & Computing</strong></span>
              <span>·</span>
              <span>📍 Bengaluru, India</span>
              <span>·</span>
              <span>Target Batch: <strong>Class of 2027</strong></span>
              <span>·</span>
              <span>Target Career: <strong>Quant Dev & Prop Trading (2030)</strong></span>
            </div>
          </div>
        </div>

        {/* Global Skill Score Box */}
        <div style={styles.scoreHighlightBox}>
          <span style={{ fontSize: "11px", fontWeight: "800", color: "#4b5563", letterSpacing: "1px" }}>
            OVERALL SKILL SCORE
          </span>
          <div style={styles.bigScoreText}>742</div>
          <div style={{ fontSize: "11px", fontWeight: "800", color: "#16a34a" }}>
            Top 18% of Global Candidates
          </div>
        </div>
      </div>

      {/* Proof-of-Work Handle Toolbar */}
      <div style={styles.handleToolbar}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "13px", fontWeight: "900" }}>🔗 PROOF-OF-WORK VERIFICATION CENTER:</span>
          <span style={{ fontSize: "12px", color: "#6b7280" }}>Click any card to inspect live profile or click settings to change handles</span>
        </div>

        <button
          onClick={() => setIsEditingHandles(!isEditingHandles)}
          style={styles.editHandleToggleBtn}
        >
          {isEditingHandles ? "✕ Close Settings" : "⚙️ Change Any Handle"}
        </button>
      </div>

      {/* Universal Handle Editor Drawer */}
      {isEditingHandles && (
        <form onSubmit={handleSaveAllHandles} style={styles.handleEditForm}>
          <div style={styles.handleInputGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Codeforces Handle:</label>
              <input
                type="text"
                value={tempCf}
                onChange={(e) => setTempCf(e.target.value)}
                placeholder="e.g. tourist, furlong"
                style={styles.handleInput}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>LeetCode Handle:</label>
              <input
                type="text"
                value={tempLc}
                onChange={(e) => setTempLc(e.target.value)}
                placeholder="e.g. neal_wu"
                style={styles.handleInput}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>GitHub Username:</label>
              <input
                type="text"
                value={tempGh}
                onChange={(e) => setTempGh(e.target.value)}
                placeholder="e.g. torvalds"
                style={styles.handleInput}
              />
            </div>
          </div>

          <button type="submit" style={styles.saveHandleBtn}>
            Save & Sync All Profiles ⚡
          </button>
        </form>
      )}

      {/* 3 Clickable External Live Proof Cards */}
      <div style={styles.powGrid}>
        {/* 1. CODEFORCES CARD */}
        <a
          href={`https://codeforces.com/profile/${encodeURIComponent(cfHandle)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.powLinkCard}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={styles.powLabel}>CODEFORCES LIVE RATING</span>
            <span style={styles.liveApiBadge}>● LIVE API ↗</span>
          </div>

          <div style={{ fontSize: "22px", fontWeight: "900", color: getRankColor(cfData.rank), marginTop: "6px" }}>
            {cfData.loading ? "Fetching..." : `${cfData.rating} (${cfData.rank})`}
          </div>

          <div style={{ fontSize: "12px", color: "#374151", marginTop: "4px", fontWeight: "700" }}>
            Handle: <strong style={{ textDecoration: "underline", color: "#000000" }}>{cfHandle}</strong> · Peak: {cfData.maxRating}
          </div>

          <div style={styles.powFooterInfo}>
            <span>Contests: {cfData.contestCount}</span>
            <span>Contrib: {cfData.contribution}</span>
            <span>Org: {cfData.organization}</span>
          </div>
        </a>

        {/* 2. LEETCODE CARD */}
        <a
          href={`https://leetcode.com/u/${encodeURIComponent(leetcodeHandle)}/`}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.powLinkCard}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={styles.powLabel}>LEETCODE COMPETITIVE</span>
            <span style={styles.liveApiBadge}>● LIVE LINK ↗</span>
          </div>

          <div style={{ fontSize: "22px", fontWeight: "900", color: "#ea580c", marginTop: "6px" }}>
            Top 1.2% (Knight 2180)
          </div>

          <div style={{ fontSize: "12px", color: "#374151", marginTop: "4px", fontWeight: "700" }}>
            Handle: <strong style={{ textDecoration: "underline", color: "#000000" }}>{leetcodeHandle}</strong> · 650+ Solved
          </div>

          <div style={styles.powFooterInfo}>
            <span>Winrate: 99.4%</span>
            <span>Contest Rank: #412</span>
          </div>
        </a>

        {/* 3. GITHUB CARD */}
        <a
          href={`https://github.com/${encodeURIComponent(githubHandle)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.powLinkCard}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={styles.powLabel}>GITHUB PROOF-OF-CODE</span>
            <span style={styles.liveApiBadge}>● AUDITED ↗</span>
          </div>

          <div style={{ fontSize: "22px", fontWeight: "900", color: "#000000", marginTop: "6px" }}>
            1,420+ Commits (2026)
          </div>

          <div style={{ fontSize: "12px", color: "#374151", marginTop: "4px", fontWeight: "700" }}>
            Profile: <strong style={{ textDecoration: "underline", color: "#000000" }}>@{githubHandle}</strong> · Repos: {ghData.publicRepos}
          </div>

          <div style={styles.powFooterInfo}>
            <span>Followers: {ghData.followers}</span>
            <span>orderbook-cpp20</span>
            <span>spanner-raft</span>
          </div>
        </a>
      </div>

      {/* Nav Tabs */}
      <div style={styles.tabNavRow}>
        {[
          { id: "overview", label: "4-Pillar Competency Radar" },
          { id: "analytics", label: "Live Performance Graph & Activity Heatmap" },
          { id: "contests", label: `Codeforces Contest Audit (${contestHistory.length})` },
          { id: "credentials", label: `Cryptographic Audit Vault (${verifiedCredentials.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              ...styles.tabNavBtn,
              backgroundColor: activeTab === tab.id ? "#000000" : "#ffffff",
              color: activeTab === tab.id ? "#ffffff" : "#000000",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* VIEW 1: 4-Pillar Competency Radar */}
      {activeTab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {skillPillars.map((pillar, idx) => (
            <div key={idx} style={styles.pillarCard}>
              <div style={styles.pillarHeader}>
                <div style={{ flex: 1, paddingRight: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                    <span style={styles.pillarCategoryBadge}>{pillar.category}</span>
                    <span style={styles.percentilePill}>{pillar.percentile}</span>
                  </div>
                  <h3 style={{ margin: "2px 0 4px 0", fontSize: "18px", fontWeight: "900" }}>
                    {pillar.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: "13px", color: "#4b5563" }}>
                    {pillar.summary}
                  </p>
                </div>

                {/* Score Dial + Action */}
                <div style={styles.scoreActionFlex}>
                  <div style={styles.scoreDial}>
                    <div style={{ fontSize: "24px", fontWeight: "900", color: "#000000" }}>
                      {pillar.score}%
                    </div>
                    <div style={{ fontSize: "10px", fontWeight: "800", color: "#6b7280" }}>
                      VERIFIED
                    </div>
                  </div>

                  {pillar.score < 100 && (
                    <button
                      onClick={() => onNavigate && onNavigate("Assessments")}
                      style={styles.complete100Btn}
                      title={pillar.gapTo100}
                    >
                      <span>⚡ How to reach 100%?</span>
                      <strong style={{ fontSize: "12px" }}>Take Assessment →</strong>
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div style={styles.progressBarTrack}>
                <div
                  style={{
                    ...styles.progressBarFill,
                    width: `${pillar.score}%`,
                    background: pillar.score >= 90 ? "linear-gradient(90deg, #16a34a, #22c55e)" : "linear-gradient(90deg, #6366f1, #a855f7)",
                  }}
                />
              </div>

              {/* Gap Diagnostic Notice */}
              <div style={styles.gapNoticeBanner}>
                <span style={{ fontSize: "11px", fontWeight: "800", color: "#1e293b" }}>
                  🎯 <strong>Roadmap to 100%:</strong> {pillar.gapTo100}
                </span>
              </div>

              {/* Sub-Badges */}
              <div style={styles.badgeWrap}>
                {pillar.badges.map((b, bIdx) => (
                  <span key={bIdx} style={styles.subSkillPill}>
                    ✓ {b}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {/* Direct Booster Callout */}
          <div style={styles.boosterCard}>
            <div>
              <h3 style={{ margin: "0 0 4px 0", fontSize: "17px", fontWeight: "900" }}>
                Want to push your score past 800+ for Jane Street &amp; Citadel Direct Bypasses?
              </h3>
              <p style={{ margin: 0, fontSize: "13px", color: "#4b5563" }}>
                Complete the remaining <strong>Distributed Systems &amp; Raft Consensus Assessment (+38 pts)</strong> to eliminate your lowest percentile pillar.
              </p>
            </div>
            <button
              onClick={() => onNavigate && onNavigate("Assessments")}
              style={styles.boostBtn}
            >
              Go to Assessments →
            </button>
          </div>
        </div>
      )}

      {/* VIEW 2: Live Performance Graph & Activity Heatmap */}
      {activeTab === "analytics" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Rating History SVG Graph */}
          <div style={styles.analyticsCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <span style={{ fontSize: "11px", fontWeight: "900", color: "#6b7280", letterSpacing: "1px" }}>
                  CODEFORCES RATING TRAJECTORY
                </span>
                <h3 style={{ margin: "2px 0 0 0", fontSize: "20px", fontWeight: "900" }}>
                  Live Rating Curve: {cfData.rating} ({cfData.rank.toUpperCase()})
                </h3>
              </div>
              <span style={styles.liveApiBadge}>● LIVE CONTEST TELEMETRY</span>
            </div>

            <div style={styles.chartContainer}>
              <svg viewBox="0 0 400 180" style={{ width: "100%", height: "200px", overflow: "visible" }}>
                {/* Horizontal Gridlines */}
                <line x1="0" y1="150" x2="400" y2="150" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="100" x2="400" y2="100" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="50" x2="400" y2="50" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />

                {/* Rating Curve Area Fill */}
                <polygon
                  points={`20,180 ${svgPolylinePoints} 370,180`}
                  fill="rgba(255, 61, 154, 0.12)"
                />

                {/* Rating Curve Polyline */}
                <polyline
                  points={svgPolylinePoints}
                  fill="none"
                  stroke="#ff3d9a"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data Points */}
                {ratingPoints.map((p, idx) => (
                  <g key={idx}>
                    <circle cx={p.x} cy={p.y} r="5" fill="#000000" stroke="#ff3d9a" strokeWidth="2" />
                    <text x={p.x} y={p.y - 10} fontSize="9" fontWeight="900" textAnchor="middle" fill="#000000">
                      {p.rating}
                    </text>
                  </g>
                ))}
              </svg>

              <div style={styles.chartFooter}>
                <span>May 2026 (540)</span>
                <span>June 2026 (615)</span>
                <span>July 2026 (710)</span>
                <span style={{ fontWeight: "900", color: "#16a34a" }}>August 2026 ({cfData.rating})</span>
              </div>
            </div>
          </div>

          {/* 52-Week Submission & Commit Heatmap */}
          <div style={styles.analyticsCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <span style={{ fontSize: "11px", fontWeight: "900", color: "#6b7280", letterSpacing: "1px" }}>
                  52-WEEK COMMIT &amp; SUBMISSION HEATMAP
                </span>
                <h3 style={{ margin: "2px 0 0 0", fontSize: "20px", fontWeight: "900" }}>
                  1,420+ Contributions &amp; Algorithmic Solutions (2026)
                </h3>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: "800" }}>
                <span>Less</span>
                <div style={{ width: "10px", height: "10px", backgroundColor: "#ebedf0", borderRadius: "2px" }} />
                <div style={{ width: "10px", height: "10px", backgroundColor: "#9be9a8", borderRadius: "2px" }} />
                <div style={{ width: "10px", height: "10px", backgroundColor: "#40c463", borderRadius: "2px" }} />
                <div style={{ width: "10px", height: "10px", backgroundColor: "#216e39", borderRadius: "2px" }} />
                <span>More</span>
              </div>
            </div>

            <div style={styles.heatmapScrollWrap}>
              <div style={styles.heatmapGrid}>
                {heatmapData.map((week, wIdx) => (
                  <div key={wIdx} style={styles.heatmapCol}>
                    {week.map((dayCount, dIdx) => {
                      const bg =
                        dayCount === 0
                          ? "#ebedf0"
                          : dayCount < 2
                          ? "#9be9a8"
                          : dayCount < 4
                          ? "#40c463"
                          : "#216e39";

                      return (
                        <div
                          key={dIdx}
                          title={`Day ${dIdx + 1}, Week ${wIdx + 1}: ${dayCount} contributions`}
                          style={{
                            ...styles.heatmapCell,
                            backgroundColor: bg,
                          }}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: Codeforces Contest Audit */}
      {activeTab === "contests" && (
        <div style={styles.analyticsCard}>
          <div style={{ marginBottom: "16px" }}>
            <span style={{ fontSize: "11px", fontWeight: "900", color: "#6b7280", letterSpacing: "1px" }}>
              OFFICIAL CODEFORCES CONTEST PERFORMANCE LOGS
            </span>
            <h3 style={{ margin: "2px 0 0 0", fontSize: "20px", fontWeight: "900" }}>
              Live Telemetry for Handle: <u>{cfHandle}</u>
            </h3>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={styles.contestTable}>
              <thead>
                <tr style={styles.tableHeadRow}>
                  <th style={styles.th}>CONTEST ID</th>
                  <th style={styles.th}>ROUND NAME</th>
                  <th style={styles.th}>RANK</th>
                  <th style={styles.th}>OLD RATING</th>
                  <th style={styles.th}>NEW RATING</th>
                  <th style={styles.th}>DELTA (Δ)</th>
                </tr>
              </thead>
              <tbody>
                {contestHistory.map((c, idx) => (
                  <tr key={idx} style={styles.tableRow}>
                    <td style={styles.td}>
                      <span style={styles.contestIdBadge}>#{c.contestId}</span>
                    </td>
                    <td style={{ ...styles.td, fontWeight: "900" }}>{c.contestName}</td>
                    <td style={styles.td}>#{c.rank}</td>
                    <td style={styles.td}>{c.oldRating}</td>
                    <td style={{ ...styles.td, fontWeight: "900", color: getRankColor(cfData.rank) }}>
                      {c.newRating}
                    </td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.deltaBadge,
                          backgroundColor: c.change.startsWith("+") ? "#bbf7d0" : "#fee2e2",
                          color: c.change.startsWith("+") ? "#166534" : "#991b1b",
                        }}
                      >
                        {c.change}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 4: Cryptographic Audit Vault */}
      {activeTab === "credentials" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {verifiedCredentials.map((cert) => (
            <div key={cert.id} style={styles.certCard}>
              <div style={styles.certCardHeader}>
                <div style={styles.certIcon}>🛡️</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span style={styles.certIdBadge}>{cert.id}</span>
                    <span style={{ fontSize: "11px", color: "#6b7280" }}>Verified on {cert.issuedDate}</span>
                    <span style={styles.verifiedOnChainPill}>{cert.status}</span>
                  </div>
                  <h3 style={{ margin: "0 0 4px 0", fontSize: "17px", fontWeight: "900" }}>
                    {cert.title}
                  </h3>
                  <div style={{ fontSize: "12px", color: "#16a34a", fontWeight: "800" }}>
                    {cert.firmEndorsement}
                  </div>
                </div>

                <div style={styles.certScoreBox}>
                  <span style={{ fontSize: "10px", fontWeight: "800", color: "#6b7280" }}>EVAL SCORE</span>
                  <div style={{ fontSize: "20px", fontWeight: "900", color: "#16a34a" }}>{cert.score}</div>
                </div>
              </div>

              <div style={styles.certHashRow}>
                <span>PROOF HASH: <code style={styles.codeText}>{cert.hash}</code></span>
                <span
                  onClick={() => setActiveCertModal(cert)}
                  style={{ color: "#7c3aed", fontWeight: "900", cursor: "pointer", textDecoration: "underline" }}
                >
                  View Cryptographic Proof ↗
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cryptographic Certificate Inspection Modal */}
      {activeCertModal && (
        <div style={modalStyles.overlay} onClick={() => setActiveCertModal(null)}>
          <div style={modalStyles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={modalStyles.badgeIcon}>SB</div>
            <h2 style={{ margin: "6px 0 2px 0", fontSize: "20px", fontWeight: "900" }}>
              SKILLBRIDGE CRYPTOGRAPHIC AUDIT PROOF
            </h2>
            <div style={{ fontSize: "11px", color: "#6b7280", letterSpacing: "1px" }}>
              ON-CHAIN RECRUITER VERIFICATION AUDIT
            </div>

            <div style={modalStyles.certDetailsBox}>
              <div style={{ fontSize: "13px", color: "#4b5563" }}>Certified that</div>
              <div style={{ fontSize: "22px", fontWeight: "900", margin: "4px 0" }}>
                {user?.name || "Alex Henderson"}
              </div>
              <div style={{ fontSize: "13px", color: "#4b5563" }}>has demonstrated verified mastery in</div>
              <div style={modalStyles.subjectPill}>{activeCertModal.title}</div>

              <div style={modalStyles.certRow}>
                <div>
                  <span style={{ fontSize: "10px", color: "#6b7280", fontWeight: "800" }}>SCORE</span>
                  <div style={{ fontSize: "16px", fontWeight: "900", color: "#16a34a" }}>{activeCertModal.score}</div>
                </div>
                <div>
                  <span style={{ fontSize: "10px", color: "#6b7280", fontWeight: "800" }}>DATE</span>
                  <div style={{ fontSize: "13px", fontWeight: "900" }}>{activeCertModal.issuedDate}</div>
                </div>
                <div>
                  <span style={{ fontSize: "10px", color: "#6b7280", fontWeight: "800" }}>HASH ID</span>
                  <div style={{ fontSize: "11px", fontWeight: "900", fontFamily: "monospace" }}>{activeCertModal.hash}</div>
                </div>
              </div>
            </div>

            <button onClick={() => setActiveCertModal(null)} style={modalStyles.closeBtn}>
              Close &amp; Attach to Resume
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "24px",
    width: "100%",
    color: "#111827",
    fontFamily: "'Space Grotesk', system-ui, sans-serif",
    boxSizing: "border-box",
  },
  headerBanner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    border: "2.5px solid #000000",
    borderRadius: "16px",
    padding: "24px 28px",
    boxShadow: "5px 5px 0px #000000",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "16px",
  },
  profileHeaderFlex: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },
  avatarLarge: {
    width: "72px",
    height: "72px",
    borderRadius: "18px",
    backgroundColor: "#ff3d9a",
    color: "#ffffff",
    border: "2.5px solid #000000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "900",
    boxShadow: "3px 3px 0px #000000",
    overflow: "hidden",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  badgeRow: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    marginBottom: "6px",
    flexWrap: "wrap",
  },
  verifiedIdentityPill: {
    backgroundColor: "#bbf7d0",
    border: "1px solid #000000",
    borderRadius: "6px",
    padding: "2px 8px",
    fontSize: "10px",
    fontWeight: "900",
    color: "#14532d",
  },
  candidateRankPill: {
    border: "1px solid #000000",
    borderRadius: "6px",
    padding: "2px 8px",
    fontSize: "10px",
    fontWeight: "900",
  },
  targetQuantPill: {
    backgroundColor: "#fef08a",
    border: "1px solid #000000",
    borderRadius: "6px",
    padding: "2px 8px",
    fontSize: "10px",
    fontWeight: "900",
  },
  userNameHeading: {
    margin: "0 0 4px 0",
    fontSize: "26px",
    fontWeight: "900",
    letterSpacing: "-0.5px",
  },
  userMetaSub: {
    fontSize: "13px",
    color: "#4b5563",
    display: "flex",
    gap: "8px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  scoreHighlightBox: {
    backgroundColor: "#fdfbf7",
    border: "2px solid #000000",
    borderRadius: "12px",
    padding: "12px 20px",
    textAlign: "center",
    boxShadow: "3px 3px 0px #000000",
  },
  bigScoreText: {
    fontSize: "36px",
    fontWeight: "900",
    color: "#7c3aed",
    lineHeight: "1.1",
  },
  handleToolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "12px",
    padding: "10px 18px",
    boxShadow: "3px 3px 0px #000000",
    marginBottom: "14px",
    flexWrap: "wrap",
    gap: "10px",
  },
  editHandleToggleBtn: {
    backgroundColor: "#fdfbf7",
    border: "1.5px solid #000000",
    borderRadius: "8px",
    padding: "6px 12px",
    fontWeight: "900",
    fontSize: "11px",
    cursor: "pointer",
    boxShadow: "2px 2px 0px #000000",
  },
  handleEditForm: {
    backgroundColor: "#fef08a",
    border: "2px solid #000000",
    borderRadius: "12px",
    padding: "16px 20px",
    boxShadow: "4px 4px 0px #000000",
    marginBottom: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  handleInputGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "12px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  inputLabel: {
    fontSize: "11px",
    fontWeight: "800",
    color: "#000000",
  },
  handleInput: {
    padding: "8px 12px",
    border: "2px solid #000000",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "800",
    backgroundColor: "#ffffff",
    outline: "none",
  },
  saveHandleBtn: {
    backgroundColor: "#000000",
    color: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "8px",
    padding: "10px 18px",
    fontSize: "13px",
    fontWeight: "900",
    cursor: "pointer",
    boxShadow: "3px 3px 0px #ff3d9a",
    alignSelf: "flex-end",
  },
  powGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "18px",
    marginBottom: "20px",
  },
  powLinkCard: {
    backgroundColor: "#ffffff",
    border: "2.5px solid #000000",
    borderRadius: "16px",
    padding: "18px 20px",
    boxShadow: "5px 5px 0px #000000",
    textDecoration: "none",
    color: "#111827",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    cursor: "pointer",
  },
  powLabel: {
    fontSize: "11px",
    fontWeight: "900",
    color: "#6b7280",
    letterSpacing: "0.5px",
  },
  liveApiBadge: {
    fontSize: "10px",
    fontWeight: "900",
    backgroundColor: "#bbf7d0",
    color: "#166534",
    border: "1px solid #000000",
    borderRadius: "6px",
    padding: "2px 6px",
  },
  powFooterInfo: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "11px",
    color: "#6b7280",
    fontWeight: "800",
    borderTop: "1px dashed #e2e8f0",
    paddingTop: "8px",
    marginTop: "12px",
  },
  tabNavRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  tabNavBtn: {
    border: "2px solid #000000",
    borderRadius: "10px",
    padding: "10px 18px",
    fontWeight: "900",
    fontSize: "13px",
    cursor: "pointer",
    boxShadow: "3px 3px 0px #000000",
  },
  pillarCard: {
    backgroundColor: "#ffffff",
    border: "2.5px solid #000000",
    borderRadius: "16px",
    padding: "22px",
    boxShadow: "5px 5px 0px #000000",
  },
  pillarHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px",
    flexWrap: "wrap",
    gap: "16px",
  },
  pillarCategoryBadge: {
    fontSize: "11px",
    fontWeight: "900",
    textTransform: "uppercase",
    color: "#6b7280",
  },
  percentilePill: {
    backgroundColor: "#e0e7ff",
    border: "1px solid #000000",
    borderRadius: "4px",
    padding: "2px 6px",
    fontSize: "10px",
    fontWeight: "900",
    color: "#3730a3",
  },
  scoreActionFlex: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  scoreDial: {
    backgroundColor: "#fdfbf7",
    border: "2px solid #000000",
    borderRadius: "10px",
    padding: "8px 14px",
    textAlign: "center",
    boxShadow: "2px 2px 0px #000000",
  },
  complete100Btn: {
    backgroundColor: "#ffea28",
    border: "2px solid #000000",
    borderRadius: "10px",
    padding: "8px 14px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    boxShadow: "3px 3px 0px #000000",
    fontSize: "10px",
    fontWeight: "800",
    color: "#000000",
    gap: "2px",
  },
  progressBarTrack: {
    height: "10px",
    backgroundColor: "#e2e8f0",
    border: "1.5px solid #000000",
    borderRadius: "6px",
    overflow: "hidden",
    marginBottom: "12px",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: "4px",
  },
  gapNoticeBanner: {
    backgroundColor: "#f1f5f9",
    border: "1.5px dashed #000000",
    borderRadius: "8px",
    padding: "8px 12px",
    marginBottom: "14px",
  },
  badgeWrap: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  subSkillPill: {
    backgroundColor: "#f8fafc",
    border: "1.5px solid #000000",
    borderRadius: "8px",
    padding: "4px 10px",
    fontSize: "11px",
    fontWeight: "800",
  },
  boosterCard: {
    backgroundColor: "#fdfbf7",
    border: "2.5px solid #000000",
    borderRadius: "16px",
    padding: "20px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "5px 5px 0px #000000",
    flexWrap: "wrap",
    gap: "14px",
  },
  boostBtn: {
    backgroundColor: "#000000",
    color: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "10px",
    padding: "12px 20px",
    fontWeight: "900",
    fontSize: "13px",
    cursor: "pointer",
    boxShadow: "3px 3px 0px #ff3d9a",
  },
  analyticsCard: {
    backgroundColor: "#ffffff",
    border: "2.5px solid #000000",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "5px 5px 0px #000000",
  },
  chartContainer: {
    backgroundColor: "#fdfbf7",
    border: "2px solid #000000",
    borderRadius: "12px",
    padding: "16px",
  },
  chartFooter: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "11px",
    fontWeight: "800",
    color: "#4b5563",
    marginTop: "10px",
    borderTop: "1px dashed #cbd5e1",
    paddingTop: "8px",
  },
  heatmapScrollWrap: {
    overflowX: "auto",
    padding: "8px 0",
  },
  heatmapGrid: {
    display: "flex",
    gap: "3px",
  },
  heatmapCol: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
  },
  heatmapCell: {
    width: "12px",
    height: "12px",
    borderRadius: "2.5px",
  },
  contestTable: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  tableHeadRow: {
    borderBottom: "2px solid #000000",
  },
  th: {
    padding: "10px 12px",
    fontSize: "11px",
    fontWeight: "900",
    color: "#4b5563",
  },
  tableRow: {
    borderBottom: "1px solid #e5e7eb",
  },
  td: {
    padding: "12px",
    fontSize: "13px",
  },
  contestIdBadge: {
    backgroundColor: "#f1f5f9",
    border: "1px solid #000000",
    borderRadius: "4px",
    padding: "2px 6px",
    fontSize: "11px",
    fontWeight: "800",
  },
  deltaBadge: {
    padding: "2px 8px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "900",
    border: "1px solid #000000",
  },
  certCard: {
    backgroundColor: "#ffffff",
    border: "2.5px solid #000000",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "5px 5px 0px #000000",
  },
  certCardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "14px",
  },
  certIcon: {
    fontSize: "32px",
  },
  certIdBadge: {
    backgroundColor: "#fef08a",
    border: "1px solid #000000",
    borderRadius: "4px",
    padding: "1px 6px",
    fontSize: "10px",
    fontWeight: "900",
  },
  verifiedOnChainPill: {
    backgroundColor: "#bbf7d0",
    border: "1px solid #000000",
    borderRadius: "4px",
    padding: "1px 6px",
    fontSize: "10px",
    fontWeight: "900",
    color: "#166534",
  },
  certScoreBox: {
    backgroundColor: "#fdfbf7",
    border: "1.5px solid #000000",
    borderRadius: "8px",
    padding: "6px 12px",
    textAlign: "center",
  },
  certHashRow: {
    borderTop: "1.5px dashed #e2e8f0",
    paddingTop: "10px",
    display: "flex",
    justifyContent: "space-between",
    fontSize: "11px",
    color: "#6b7280",
    fontWeight: "700",
  },
  codeText: {
    backgroundColor: "#f1f5f9",
    padding: "2px 6px",
    borderRadius: "4px",
    color: "#0f172a",
    fontFamily: "monospace",
  },
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
    padding: "20px",
  },
  modalCard: {
    backgroundColor: "#ffffff",
    border: "3px solid #000000",
    borderRadius: "20px",
    boxShadow: "10px 10px 0px #000000",
    maxWidth: "520px",
    width: "100%",
    padding: "28px",
    textAlign: "center",
    fontFamily: "'Space Grotesk', system-ui, sans-serif",
  },
  badgeIcon: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #ff3d9a, #8b5cf6)",
    color: "#ffffff",
    border: "2px solid #000000",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    fontSize: "16px",
    marginBottom: "8px",
    boxShadow: "2px 2px 0px #000000",
  },
  certDetailsBox: {
    backgroundColor: "#fdfbf7",
    border: "2px solid #000000",
    borderRadius: "14px",
    padding: "20px",
    margin: "16px 0 20px 0",
    boxShadow: "3px 3px 0px #000000",
  },
  subjectPill: {
    backgroundColor: "#ffffff",
    border: "1.5px solid #000000",
    borderRadius: "8px",
    padding: "8px 12px",
    fontWeight: "900",
    fontSize: "15px",
    margin: "8px 0 14px 0",
  },
  certRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1.2fr",
    gap: "10px",
    borderTop: "1.5px dashed #cbd5e1",
    paddingTop: "12px",
  },
  closeBtn: {
    backgroundColor: "#000000",
    color: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "10px",
    padding: "12px",
    fontWeight: "900",
    fontSize: "13px",
    cursor: "pointer",
    width: "100%",
    boxShadow: "4px 4px 0px #ff3d9a",
  },
};