import React, { useState, useMemo } from "react";

const LEADERBOARD_TABS = [
  { id: "overall", name: "🏆 Overall SkillBridge Score", desc: "Top verified candidates ranked by comprehensive score" },
  { id: "project-relevance", name: "⚡ Target Project Relevance", desc: "Ranked by portfolio alignment with target career (penalizes unrelated projects)" },
  { id: "competitive", name: "🧠 Competitive Programming", desc: "Live contest ratings, Codeforces peak & speed benchmarks" },
  { id: "placement-radar", name: "🎯 Direct Interview Unlocks", desc: "Candidates with active OA bypasses & top firm endorsements" }
];

const OVERALL_LEADERBOARD_DATA = [
  {
    rank: 1,
    name: "Rohan Verma",
    handle: "rohan_v",
    id: "849201",
    college: "IIT Bombay",
    branch: "Computer Science & Engineering",
    targetRole: "Quant Developer (C++ / HFT)",
    score: 982,
    percentile: "Top 0.05%",
    badge: "Grandmaster (2410)",
    firm: "Jane Street (Offer Extended)",
    avatar: "RV",
    color: "#1e3a8a",
    techStack: ["C++20", "DPDK", "Lock-Free SPSC", "SIMD AVX-512", "Linux Kernel"],
    topProject: "L3 Limit Order Book (820ns p99 Tick-to-Trade)",
    commits2026: "1,840+",
    bio: "Focused on deterministic ultra-low-latency market connectivity and lock-free memory models."
  },
  {
    rank: 2,
    name: "Devansh Gupta",
    handle: "dev_quant",
    id: "582104",
    college: "IIT Delhi",
    branch: "Mathematics & Computing",
    targetRole: "Quantitative Researcher",
    score: 964,
    percentile: "Top 0.12%",
    badge: "Candidate Master (1980)",
    firm: "Citadel Securities (Round 2)",
    avatar: "DG",
    color: "#0f172a",
    techStack: ["Python", "CUDA C++", "Stochastic PDEs", "PyTorch", "OpenMP"],
    topProject: "CUDA Monte Carlo Jump-Diffusion Surface Engine",
    commits2026: "1,420+",
    bio: "Specializing in exotic option pricing, Crank-Nicolson PDE discretization, and statistical arbitrage."
  },
  {
    rank: 3,
    name: "Aditya Sharma",
    handle: "aditya_cpp",
    id: "392019",
    college: "IIT Kanpur",
    branch: "Electrical Engineering",
    targetRole: "Low-Latency Core SWE",
    score: 951,
    percentile: "Top 0.20%",
    badge: "Master (2140)",
    firm: "Tower Research Capital (PPO)",
    avatar: "AS",
    color: "#ea580c",
    techStack: ["Modern C++", "POSIX SHM", "Linux io_uring", "x86 Assembly"],
    topProject: "Kernel-Bypass UDP Multicast Market Data Feed Handler",
    commits2026: "1,290+",
    bio: "Obsessed with zero-copy network architectures and sub-microsecond IPC ring buffers."
  },
  {
    rank: 4,
    name: "Sarah Jenkins",
    handle: "s_jenkins",
    id: "710482",
    college: "NUS Singapore",
    branch: "Quantitative Finance",
    targetRole: "Quant Trader",
    score: 938,
    percentile: "Top 0.35%",
    badge: "Knight (2210)",
    firm: "Optiver (Interview)",
    avatar: "SJ",
    color: "#dc2626",
    techStack: ["Python", "C++17", "Game Theory", "Black-Scholes", "Order Flow VPIN"],
    topProject: "Order Flow Imbalance Microstructure Alpha Predictor",
    commits2026: "980+",
    bio: "Trading options microstructure, volatility arbitrage, and algorithmic game theory."
  },
  {
    rank: 5,
    name: "Arjun Mehta",
    handle: "arjun_m",
    id: "629104",
    college: "NIT Warangal",
    branch: "Mathematics & Computing",
    targetRole: "Distributed Systems SWE",
    score: 925,
    percentile: "Top 0.48%",
    badge: "Candidate Master (1945)",
    firm: "Google Core Infra (Fast-track)",
    avatar: "AM",
    color: "#ea4335",
    techStack: ["Go", "gRPC", "Raft", "RocksDB", "Docker"],
    topProject: "Fault-Tolerant Raft Key-Value Storage Engine",
    commits2026: "1,550+",
    bio: "Constructing linearizable distributed storage engines and consensus log compaction protocols."
  },
  {
    rank: 6,
    name: "Kavya Sharma",
    handle: "kavya_s",
    id: "194820",
    college: "IIT Roorkee",
    branch: "Computer Science",
    targetRole: "Quant Dev / HFT",
    score: 912,
    percentile: "Top 0.65%",
    badge: "Expert (1890)",
    firm: "Hudson River Trading (HRT)",
    avatar: "KS",
    color: "#7c3aed",
    techStack: ["C++20", "DPDK", "Cache Prefetching", "Linux Drivers"],
    topProject: "High-Throughput NASDAQ ITCH 5.0 Packet Parser",
    commits2026: "1,100+",
    bio: "Kernel-bypass systems builder specializing in Solarflare OpenOnload configurations."
  },
  {
    rank: 7,
    name: "Vikram Singhania",
    handle: "vikram_hft",
    id: "819302",
    college: "IIT Madras",
    branch: "Mechanical Engineering",
    targetRole: "Algorithmic Trader",
    score: 895,
    percentile: "Top 0.90%",
    badge: "Knight (2150)",
    firm: "Jump Trading (OA Active)",
    avatar: "VS",
    color: "#16a34a",
    techStack: ["Python", "C++", "Kalman Filtering", "Cointegration"],
    topProject: "Event-Driven Statistical Arbitrage Pairs Backtester",
    commits2026: "870+",
    bio: "Statistical modeling on tick-by-tick equity and crypto order book depth."
  },
  {
    rank: 8,
    name: "Pooja Trivedi",
    handle: "pooja_t",
    id: "402918",
    college: "IIT Kharagpur",
    branch: "Data Science & AI",
    targetRole: "AI / HPC Infrastructure",
    score: 884,
    percentile: "Top 1.10%",
    badge: "CUDA Specialist",
    firm: "Databricks Storage",
    avatar: "PT",
    color: "#ff3621",
    techStack: ["CUDA", "C++", "TensorRT", "NCCL", "Distributed Training"],
    topProject: "Custom Vectorized GPU Attention Kernels",
    commits2026: "1,340+",
    bio: "Maximizing GPU tensor core utilization and low-level memory bandwidth pipelines."
  }
];

const PROJECT_RELEVANCE_DATA = [
  {
    rank: 1,
    name: "Rohan Verma",
    targetRole: "Quant Developer (HFT)",
    score: "99.2%",
    status: "Maximum Alignment",
    topRepo: "ultra-orderbook-cpp20 (820ns tick-to-trade, DPDK, Lock-free)",
    relevanceBreakdown: "+40% Modern C++20 · +35% Kernel Bypass · +24.2% Zero-Allocation Architecture",
    penaltyNote: "0 Unrelated Repositories detected."
  },
  {
    rank: 2,
    name: "Devansh Gupta",
    targetRole: "Quantitative Researcher",
    score: "97.8%",
    status: "Optimal Alignment",
    topRepo: "cuda-heston-pde-pricer (45x GPU acceleration, Greeks Auto-diff)",
    relevanceBreakdown: "+45% Stochastic Volatility · +35% CUDA C++ · +17.8% Monte Carlo",
    penaltyNote: "0 Unrelated Repositories detected."
  },
  {
    rank: 3,
    name: "Alex Henderson (You)",
    targetRole: "Quant Developer (C++ / HFT)",
    score: "89.4%",
    status: "High Alignment",
    topRepo: "orderbook-cpp20 & spanner-raft",
    relevanceBreakdown: "+38% Low-Latency C++ · +32% Concurrency · +19.4% Distributed Logs",
    penaltyNote: "-10% Applied: Pinned generic static portfolio repos reduce focused domain density."
  },
  {
    rank: 4,
    name: "Aditya Sharma",
    targetRole: "Distributed Systems SWE",
    score: "88.1%",
    status: "Strong Alignment",
    topRepo: "raft-consensus-engine (Jepsen verified linearizable key-value)",
    relevanceBreakdown: "+40% Consensus · +30% gRPC/Protobuf · +18.1% LSM Storage",
    penaltyNote: "-8% Penalty: Unrelated React landing pages present in pinned profile."
  },
  {
    rank: 5,
    name: "Pooja Trivedi",
    targetRole: "Quant Developer",
    score: "68.5%",
    status: "Score Drop / Mismatch",
    topRepo: "iot-electronic-sensor-arduino & basic-mern-blog",
    relevanceBreakdown: "+25% Embedded C · +20% Basic Networking · +23.5% Frontend",
    penaltyNote: "⚠️ -31.5% Severe Penalty: Arduino & MERN stack repos do not demonstrate HFT/Low-Latency or Stochastic proficiency."
  }
];

const COMPETITIVE_DATA = [
  { rank: 1, name: "Rohan Verma", cfHandle: "rohan_v", rating: 2410, rankTitle: "Grandmaster", solves: 840, contestWins: 14, speed: "Avg 12m Div2C" },
  { rank: 2, name: "Devansh Gupta", cfHandle: "dev_quant", rating: 1980, rankTitle: "Candidate Master", solves: 620, contestWins: 8, speed: "Avg 18m Div2C" },
  { rank: 3, name: "Aditya Sharma", cfHandle: "aditya_cpp", rating: 2140, rankTitle: "Master", solves: 710, contestWins: 11, speed: "Avg 15m Div2C" },
  { rank: 4, name: "Arjun Mehta", cfHandle: "arjun_m", rating: 1945, rankTitle: "Candidate Master", solves: 590, contestWins: 5, speed: "Avg 20m Div2C" },
  { rank: 5, name: "Alex Henderson (You)", cfHandle: "furlong", rating: 791, rankTitle: "Newbie", solves: 124, contestWins: 0, speed: "Improving" }
];

const PLACEMENT_RADAR_DATA = [
  { candidate: "Rohan Verma", id: "849201", targetFirm: "Jane Street", role: "Quant Trader Intern", package: "₹40L / month", stage: "Offer Accepted 🎉", matchRate: "99.4%" },
  { candidate: "Devansh Gupta", id: "582104", targetFirm: "Citadel Securities", role: "Quantitative Researcher", package: "₹1.8 Cr CTC", stage: "Final Round Scheduled", matchRate: "98.1%" },
  { candidate: "Aditya Sharma", id: "392019", targetFirm: "Tower Research Capital", role: "Quant Developer", package: "₹36L / month", stage: "PPO Fast-Track", matchRate: "97.5%" },
  { candidate: "Sarah Jenkins", id: "710482", targetFirm: "Optiver", role: "Derivatives Trader", package: "₹48L / month", stage: "Superday Active", matchRate: "96.2%" },
  { candidate: "Arjun Mehta", id: "629104", targetFirm: "Google", role: "Core Systems SWE", package: "₹58 LPA", stage: "Fast-Track Bypass", matchRate: "95.8%" }
];

export default function LeaderboardPage({ user, score = 0, onNavigate }) {
  const [activeTab, setActiveTab] = useState("overall");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCandidateModal, setSelectedCandidateModal] = useState(null);

  const filteredOverallData = useMemo(() => {
    if (!searchQuery.trim()) return OVERALL_LEADERBOARD_DATA;
    const q = searchQuery.toLowerCase();
    return OVERALL_LEADERBOARD_DATA.filter(
      (row) =>
        row.name.toLowerCase().includes(q) ||
        row.college.toLowerCase().includes(q) ||
        row.targetRole.toLowerCase().includes(q) ||
        row.id.includes(q) ||
        row.firm.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div style={styles.container}>
      {/* Top Banner */}
      <div style={styles.headerBanner}>
        <div>
          <div style={styles.topBadgeRow}>
            <span style={styles.liveTag}>● REAL-TIME RECRUITER & CANDIDATE TELEMETRY</span>
            <span style={styles.verifiedCount}>Global Talent Index</span>
          </div>
          <h1 style={styles.headerTitle}>COMMAND CENTER LEADERBOARDS</h1>
          <p style={styles.headerSub}>
            Rankings calibrated by verified assessment scores, target project architectural relevance, and live competitive programming benchmarks.
          </p>
        </div>

        <div style={styles.userRankCapsule}>
          <span style={{ fontSize: "11px", fontWeight: "900", color: "#6b7280" }}>YOUR GLOBAL POSITION</span>
          <div style={{ fontSize: "24px", fontWeight: "900", color: "#7c3aed" }}>
            #{score >= 700 ? "42" : "184"} <span style={{ fontSize: "12px", color: "#16a34a" }}>Top {score >= 700 ? "4.2%" : "18%"}</span>
          </div>
          <div style={{ fontSize: "11px", fontWeight: "800", color: "#000000" }}>
            Score: <strong>{score} pts</strong> · ID: <strong>#SB-810492</strong>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={styles.tabsRow}>
        {LEADERBOARD_TABS.map((t) => {
          const isSelected = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                ...styles.tabBtn,
                backgroundColor: isSelected ? "#000000" : "#ffffff",
                color: isSelected ? "#ffffff" : "#000000",
                boxShadow: isSelected ? "3px 3px 0px #ff3d9a" : "2px 2px 0px #000000"
              }}
            >
              {t.name}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERALL SKILLBRIDGE LEADERBOARD */}
      {activeTab === "overall" && (
        <div style={styles.leaderboardCard}>
          <div style={styles.cardHeaderFlex}>
            <div>
              <h2 style={styles.cardTitle}>Global SkillBridge Verified Leaderboard</h2>
              <p style={styles.cardSub}>Click any candidate to inspect technical architecture, stack breakdown, and direct messaging link.</p>
            </div>
            <input
              type="text"
              placeholder="🔍 Search candidate, college, role, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchBar}
            />
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thRow}>
                  <th style={styles.th}>RANK</th>
                  <th style={styles.th}>CANDIDATE &amp; ID</th>
                  <th style={styles.th}>COLLEGE &amp; BRANCH</th>
                  <th style={styles.th}>TARGET CAREER TRACK</th>
                  <th style={styles.th}>BADGE / CP RANK</th>
                  <th style={styles.th}>FIRM FAST-TRACK</th>
                  <th style={styles.th}>SCORE</th>
                  <th style={styles.th}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredOverallData.map((row) => (
                  <tr
                    key={row.rank}
                    style={styles.tr}
                    onClick={() => setSelectedCandidateModal(row)}
                  >
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.rankBadge,
                          backgroundColor: row.rank === 1 ? "#ffea28" : row.rank === 2 ? "#e2e8f0" : row.rank === 3 ? "#fed7aa" : "#f1f5f9",
                          color: "#000000"
                        }}
                      >
                        {row.rank === 1 ? "🥇 #1" : row.rank === 2 ? "🥈 #2" : row.rank === 3 ? "🥉 #3" : `#${row.rank}`}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ ...styles.avatarTable, backgroundColor: row.color }}>
                          {row.avatar}
                        </div>
                        <div>
                          <div style={{ fontWeight: "900", fontSize: "14px", color: "#000000" }}>{row.name}</div>
                          <span style={styles.connectionIdPill}>ID: #{row.id}</span>
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={{ fontWeight: "800" }}>{row.college}</div>
                      <div style={{ fontSize: "11px", color: "#6b7280" }}>{row.branch}</div>
                    </td>
                    <td style={{ ...styles.td, fontWeight: "800", color: "#7c3aed" }}>
                      {row.targetRole}
                    </td>
                    <td style={styles.td}>
                      <span style={styles.badgePill}>{row.badge}</span>
                    </td>
                    <td style={{ ...styles.td, color: "#16a34a", fontWeight: "900", fontSize: "12px" }}>
                      {row.firm}
                    </td>
                    <td style={styles.td}>
                      <strong style={{ fontSize: "16px", color: "#000000" }}>{row.score}</strong>
                      <div style={{ fontSize: "10px", color: "#6b7280", fontWeight: "700" }}>{row.percentile}</div>
                    </td>
                    <td style={styles.td}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCandidateModal(row);
                        }}
                        style={styles.inspectMiniBtn}
                      >
                        Inspect ↗
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: TARGET PROJECT RELEVANCE MATRIX */}
      {activeTab === "project-relevance" && (
        <div style={styles.leaderboardCard}>
          <div style={styles.cardHeaderFlex}>
            <div>
              <div style={styles.relevanceExplainerBanner}>
                ⚡ <strong>Architectural Domain Alignment Scoring:</strong> Repositories matching the target track (e.g. C++20 Orderbook engines, CUDA PDE pricers, Raft nodes) push relevance towards 100%, while unrelated generic projects (e.g. basic Arduino circuits or generic blogs for Quant/Systems) incur severe penalties.
              </div>
              <h2 style={styles.cardTitle}>Target Role Project Relevance Leaderboard</h2>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "16px" }}>
            {PROJECT_RELEVANCE_DATA.map((item) => (
              <div
                key={item.rank}
                style={{
                  ...styles.relevanceCard,
                  borderLeft: item.score.startsWith("9") || item.score.startsWith("8") ? "6px solid #16a34a" : "6px solid #ef4444"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "14px", fontWeight: "900" }}>#{item.rank} · {item.name}</span>
                      <span style={styles.targetRolePill}>{item.targetRole}</span>
                      <span
                        style={{
                          ...styles.statusPill,
                          backgroundColor: item.status.includes("Alignment") ? "#bbf7d0" : "#fee2e2",
                          color: item.status.includes("Alignment") ? "#166534" : "#991b1b"
                        }}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div style={{ fontSize: "13px", fontWeight: "900", color: "#000000", marginTop: "6px" }}>
                      Pinned Work: <code>{item.topRepo}</code>
                    </div>

                    <div style={{ fontSize: "12px", color: "#4b5563", marginTop: "4px" }}>
                      Domain Weights: <strong>{item.relevanceBreakdown}</strong>
                    </div>

                    <div style={{ fontSize: "11px", fontWeight: "800", color: item.penaltyNote.includes("Penalty") ? "#dc2626" : "#16a34a", marginTop: "4px" }}>
                      {item.penaltyNote}
                    </div>
                  </div>

                  <div style={styles.relevanceScoreDial}>
                    <span style={{ fontSize: "10px", fontWeight: "900", color: "#6b7280" }}>RELEVANCE</span>
                    <div style={{ fontSize: "22px", fontWeight: "900", color: item.score.startsWith("9") || item.score.startsWith("8") ? "#16a34a" : "#dc2626" }}>
                      {item.score}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: COMPETITIVE PROGRAMMING LEADERBOARD */}
      {activeTab === "competitive" && (
        <div style={styles.leaderboardCard}>
          <div style={styles.cardHeaderFlex}>
            <div>
              <h2 style={styles.cardTitle}>Competitive Programming &amp; Algorithmic Speed Leaderboard</h2>
              <p style={styles.cardSub}>Synchronized live with Codeforces ratings, problem volume, and Div. 2/3 speed solving telemetry.</p>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thRow}>
                  <th style={styles.th}>RANK</th>
                  <th style={styles.th}>CANDIDATE</th>
                  <th style={styles.th}>CODEFORCES HANDLE</th>
                  <th style={styles.th}>LIVE RATING</th>
                  <th style={styles.th}>RANK TITLE</th>
                  <th style={styles.th}>VERIFIED SOLVES</th>
                  <th style={styles.th}>SOLVE SPEED METRIC</th>
                </tr>
              </thead>
              <tbody>
                {COMPETITIVE_DATA.map((row) => (
                  <tr key={row.rank} style={styles.tr}>
                    <td style={styles.td}><strong>#{row.rank}</strong></td>
                    <td style={{ ...styles.td, fontWeight: "900" }}>{row.name}</td>
                    <td style={styles.td}>
                      <a
                        href={`https://codeforces.com/profile/${row.cfHandle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#7c3aed", fontWeight: "900", textDecoration: "underline" }}
                      >
                        @{row.cfHandle} ↗
                      </a>
                    </td>
                    <td style={{ ...styles.td, fontWeight: "900", fontSize: "15px" }}>{row.rating}</td>
                    <td style={styles.td}>
                      <span style={styles.badgePill}>{row.rankTitle}</span>
                    </td>
                    <td style={styles.td}>{row.solves} Solved</td>
                    <td style={{ ...styles.td, fontWeight: "700", color: "#16a34a" }}>{row.speed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: DIRECT RECRUITER PLACEMENT RADAR */}
      {activeTab === "placement-radar" && (
        <div style={styles.leaderboardCard}>
          <div style={styles.cardHeaderFlex}>
            <div>
              <h2 style={styles.cardTitle}>Direct Recruiter Fast-Track &amp; Placement Radar</h2>
              <p style={styles.cardSub}>Live feed of candidate interview bypasses, superday invitations, and offers extended.</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px", marginTop: "14px" }}>
            {PLACEMENT_RADAR_DATA.map((item, idx) => (
              <div key={idx} style={styles.radarCard}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={styles.firmBadge}>{item.targetFirm}</span>
                  <span style={styles.matchRateBadge}>🎯 {item.matchRate} Match</span>
                </div>

                <h3 style={{ margin: "0 0 2px 0", fontSize: "16px", fontWeight: "900" }}>{item.candidate}</h3>
                <div style={{ fontSize: "11px", color: "#6b7280", marginBottom: "6px" }}>ID: #{item.id}</div>

                <div style={{ fontSize: "13px", fontWeight: "800", color: "#000000" }}>{item.role}</div>
                <div style={{ fontSize: "12px", color: "#16a34a", fontWeight: "900", margin: "2px 0 8px 0" }}>
                  Stipend / CTC: {item.package}
                </div>

                <div style={styles.stageBox}>
                  <span style={{ fontSize: "10px", fontWeight: "800", color: "#6b7280" }}>CURRENT STATUS:</span>
                  <strong style={{ fontSize: "12px", color: "#7c3aed" }}>{item.stage}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CANDIDATE DEEP-DIVE INSPECTION MODAL */}
      {selectedCandidateModal && (
        <div style={modalStyles.overlay} onClick={() => setSelectedCandidateModal(null)}>
          <div style={modalStyles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={modalStyles.header}>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <div style={{ ...modalStyles.avatarModal, backgroundColor: selectedCandidateModal.color }}>
                  {selectedCandidateModal.avatar}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "900" }}>{selectedCandidateModal.name}</h2>
                    <span style={modalStyles.badgePillModal}>{selectedCandidateModal.badge}</span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#6b7280", fontWeight: "700" }}>
                    {selectedCandidateModal.college} · {selectedCandidateModal.branch}
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedCandidateModal(null)} style={modalStyles.closeBtn}>
                ✕
              </button>
            </div>

            {/* Score & Telemetry Strip */}
            <div style={modalStyles.statsGrid}>
              <div style={modalStyles.statBox}>
                <span style={{ fontSize: "10px", fontWeight: "900", color: "#6b7280" }}>VERIFIED SCORE</span>
                <div style={{ fontSize: "22px", fontWeight: "900", color: "#7c3aed" }}>{selectedCandidateModal.score}</div>
                <div style={{ fontSize: "10px", color: "#16a34a", fontWeight: "800" }}>{selectedCandidateModal.percentile}</div>
              </div>
              <div style={modalStyles.statBox}>
                <span style={{ fontSize: "10px", fontWeight: "900", color: "#6b7280" }}>CONNECTION ID</span>
                <div style={{ fontSize: "16px", fontWeight: "900", fontFamily: "monospace", marginTop: "3px" }}>
                  #{selectedCandidateModal.id}
                </div>
                <div style={{ fontSize: "10px", color: "#6b7280" }}>Shareable Token</div>
              </div>
              <div style={modalStyles.statBox}>
                <span style={{ fontSize: "10px", fontWeight: "900", color: "#6b7280" }}>2026 COMMITS</span>
                <div style={{ fontSize: "20px", fontWeight: "900", color: "#000000" }}>
                  {selectedCandidateModal.commits2026}
                </div>
                <div style={{ fontSize: "10px", color: "#16a34a" }}>Active Builder</div>
              </div>
            </div>

            {/* Bio & Track */}
            <div style={{ margin: "14px 0", textAlign: "left" }}>
              <div style={modalStyles.sectionHeading}>Target Track &amp; Focus</div>
              <div style={{ fontSize: "14px", fontWeight: "900", color: "#7c3aed" }}>
                {selectedCandidateModal.targetRole}
              </div>
              <p style={{ fontSize: "12px", color: "#4b5563", lineHeight: "1.4", margin: "4px 0 0 0" }}>
                {selectedCandidateModal.bio}
              </p>
            </div>

            {/* Pinned Architecture Project */}
            <div style={{ margin: "14px 0", textAlign: "left" }}>
              <div style={modalStyles.sectionHeading}>Key Production Work</div>
              <div style={modalStyles.repoBox}>
                <code>{selectedCandidateModal.topProject}</code>
              </div>
            </div>

            {/* Verified Tech Stack */}
            <div style={{ margin: "14px 0", textAlign: "left" }}>
              <div style={modalStyles.sectionHeading}>Verified Production Tech Stack</div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "4px" }}>
                {selectedCandidateModal.techStack.map((tech, idx) => (
                  <span key={idx} style={modalStyles.techPillModal}>
                    ⚡ {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div style={modalStyles.actionRow}>
              <button
                onClick={() => {
                  setSelectedCandidateModal(null);
                  if (onNavigate) onNavigate("Messages");
                }}
                style={modalStyles.dmBtn}
              >
                Direct Message Candidate (ID: #{selectedCandidateModal.id}) 💬
              </button>
            </div>
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
    boxSizing: "border-box"
  },
  headerBanner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    border: "2.5px solid #000000",
    borderRadius: "16px",
    padding: "22px 28px",
    boxShadow: "5px 5px 0px #000000",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "16px"
  },
  topBadgeRow: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    marginBottom: "6px"
  },
  liveTag: {
    fontSize: "11px",
    fontWeight: "900",
    color: "#7c3aed",
    letterSpacing: "0.5px"
  },
  verifiedCount: {
    fontSize: "11px",
    fontWeight: "900",
    backgroundColor: "#ffea28",
    border: "1px solid #000000",
    padding: "2px 8px",
    borderRadius: "6px"
  },
  headerTitle: {
    margin: "0 0 4px 0",
    fontSize: "24px",
    fontWeight: "900",
    letterSpacing: "-0.5px"
  },
  headerSub: {
    margin: 0,
    fontSize: "13px",
    color: "#4b5563"
  },
  userRankCapsule: {
    backgroundColor: "#fdfbf7",
    border: "2px solid #000000",
    borderRadius: "12px",
    padding: "10px 18px",
    textAlign: "right",
    boxShadow: "3px 3px 0px #000000"
  },
  tabsRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap"
  },
  tabBtn: {
    border: "2px solid #000000",
    borderRadius: "10px",
    padding: "10px 18px",
    fontWeight: "900",
    fontSize: "13px",
    cursor: "pointer",
    transition: "transform 0.1s ease"
  },
  leaderboardCard: {
    backgroundColor: "#ffffff",
    border: "2.5px solid #000000",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "5px 5px 0px #000000"
  },
  cardHeaderFlex: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    flexWrap: "wrap",
    gap: "12px"
  },
  cardTitle: {
    margin: "0 0 4px 0",
    fontSize: "20px",
    fontWeight: "900"
  },
  cardSub: {
    margin: 0,
    fontSize: "12px",
    color: "#4b5563"
  },
  searchBar: {
    padding: "10px 14px",
    border: "2px solid #000000",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "700",
    backgroundColor: "#fdfbf7",
    outline: "none",
    width: "280px"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left"
  },
  thRow: {
    borderBottom: "2px solid #000000",
    backgroundColor: "#fdfbf7"
  },
  th: {
    padding: "12px 14px",
    fontSize: "11px",
    fontWeight: "900",
    color: "#4b5563"
  },
  tr: {
    borderBottom: "1px solid #e2e8f0",
    cursor: "pointer",
    transition: "background 0.1s ease"
  },
  td: {
    padding: "14px",
    fontSize: "13px"
  },
  avatarTable: {
    width: "34px",
    height: "34px",
    borderRadius: "8px",
    color: "#ffffff",
    border: "1.5px solid #000000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    fontSize: "12px"
  },
  rankBadge: {
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "900",
    border: "1.5px solid #000000"
  },
  connectionIdPill: {
    fontSize: "10px",
    fontFamily: "monospace",
    color: "#6b7280",
    fontWeight: "700"
  },
  badgePill: {
    backgroundColor: "#f1f5f9",
    border: "1px solid #000000",
    borderRadius: "6px",
    padding: "3px 8px",
    fontSize: "11px",
    fontWeight: "800"
  },
  inspectMiniBtn: {
    backgroundColor: "#ffea28",
    color: "#000000",
    border: "1.5px solid #000000",
    borderRadius: "6px",
    padding: "4px 10px",
    fontSize: "11px",
    fontWeight: "900",
    cursor: "pointer",
    boxShadow: "2px 2px 0px #000000"
  },
  relevanceExplainerBanner: {
    backgroundColor: "#fef08a",
    border: "1.5px solid #000000",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "12px",
    color: "#1e293b",
    marginBottom: "12px"
  },
  relevanceCard: {
    backgroundColor: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "12px",
    padding: "16px 20px",
    boxShadow: "3px 3px 0px #000000"
  },
  targetRolePill: {
    backgroundColor: "#e0e7ff",
    color: "#3730a3",
    border: "1px solid #000000",
    borderRadius: "4px",
    padding: "2px 6px",
    fontSize: "10px",
    fontWeight: "900"
  },
  statusPill: {
    border: "1px solid #000000",
    borderRadius: "4px",
    padding: "2px 6px",
    fontSize: "10px",
    fontWeight: "900"
  },
  relevanceScoreDial: {
    backgroundColor: "#fdfbf7",
    border: "2px solid #000000",
    borderRadius: "10px",
    padding: "8px 14px",
    textAlign: "center",
    boxShadow: "2px 2px 0px #000000"
  },
  radarCard: {
    backgroundColor: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "14px",
    padding: "16px",
    boxShadow: "4px 4px 0px #000000"
  },
  firmBadge: {
    backgroundColor: "#000000",
    color: "#ffffff",
    borderRadius: "6px",
    padding: "3px 8px",
    fontSize: "11px",
    fontWeight: "900"
  },
  matchRateBadge: {
    backgroundColor: "#bbf7d0",
    border: "1px solid #000000",
    borderRadius: "4px",
    padding: "2px 6px",
    fontSize: "10px",
    fontWeight: "900",
    color: "#166534"
  },
  stageBox: {
    backgroundColor: "#fdfbf7",
    border: "1.5px dashed #cbd5e1",
    borderRadius: "8px",
    padding: "8px 10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
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
  modalCard: {
    backgroundColor: "#ffffff",
    border: "3px solid #000000",
    borderRadius: "20px",
    boxShadow: "10px 10px 0px #000000",
    maxWidth: "540px",
    width: "100%",
    padding: "26px",
    fontFamily: "'Space Grotesk', system-ui, sans-serif"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottom: "2px solid #000000",
    paddingBottom: "14px",
    marginBottom: "16px"
  },
  avatarModal: {
    width: "46px",
    height: "46px",
    borderRadius: "12px",
    color: "#ffffff",
    border: "2px solid #000000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    fontSize: "16px",
    boxShadow: "2px 2px 0px #000000"
  },
  badgePillModal: {
    backgroundColor: "#ffea28",
    border: "1px solid #000000",
    borderRadius: "4px",
    padding: "2px 6px",
    fontSize: "10px",
    fontWeight: "900"
  },
  closeBtn: {
    background: "none",
    border: "2px solid #000000",
    borderRadius: "8px",
    width: "32px",
    height: "32px",
    fontWeight: "900",
    cursor: "pointer",
    boxShadow: "2px 2px 0px #000000"
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "10px",
    marginBottom: "14px"
  },
  statBox: {
    backgroundColor: "#fdfbf7",
    border: "2px solid #000000",
    borderRadius: "10px",
    padding: "10px",
    textAlign: "center",
    boxShadow: "2px 2px 0px #000000"
  },
  sectionHeading: {
    fontSize: "11px",
    fontWeight: "900",
    color: "#6b7280",
    textTransform: "uppercase",
    marginBottom: "4px"
  },
  repoBox: {
    backgroundColor: "#f1f5f9",
    border: "1.5px solid #000000",
    borderRadius: "8px",
    padding: "8px 12px",
    fontSize: "12px",
    fontWeight: "700"
  },
  techPillModal: {
    backgroundColor: "#fdfbf7",
    border: "1px solid #000000",
    borderRadius: "6px",
    padding: "3px 8px",
    fontSize: "11px",
    fontWeight: "800"
  },
  actionRow: {
    marginTop: "18px",
    borderTop: "2px solid #e2e8f0",
    paddingTop: "14px"
  },
  dmBtn: {
    width: "100%",
    backgroundColor: "#000000",
    color: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "10px",
    padding: "12px",
    fontSize: "13px",
    fontWeight: "900",
    cursor: "pointer",
    boxShadow: "3px 3px 0px #ff3d9a"
  }
};