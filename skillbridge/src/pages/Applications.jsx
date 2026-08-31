import React, { useState } from "react";

const STAGES_PIPELINE = [
  "Application Submitted",
  "Automated OA / CoderPad",
  "Technical Round 1 (Low-Latency / DSA)",
  "Technical Round 2 (System Design / Probability)",
  "Offer Extended 🎉"
];

const DETAILED_APPLICATIONS = [
  {
    id: "APP-2026-001",
    company: "Jane Street",
    logoColor: "#1e3a8a",
    initials: "JS",
    title: "Quant Trader Intern (Summer 2027)",
    appliedYear: "2026",
    appliedDate: "August 28, 2026",
    appliedTime: "10:45 AM IST",
    targetBatch: "Class of 2027 / 2028",
    workType: "On-site · Relocation Covered",
    location: "Singapore / Hong Kong Hub",
    salary: "₹32L–40L / month (Intern)",
    salaryBreakdown: {
      base: "₹32,00,000 / month",
      relocation: "₹8,00,000 Housing & Flight Stipend",
      bonus: "Discretionary PnL Pool & Full-time PPO Fast-track"
    },
    currentStageIndex: 1,
    status: "OA Link Active (CoderPad)",
    matchScore: 96,
    companyStats: {
      headcount: "2,500+ Global",
      acceptanceRate: "0.8% Selection Rate",
      hiringPace: "Avg. 14 Days to Decision",
      primaryStack: "OCaml, Modern C++, Linux Kernel"
    },
    notes: "Verified Candidate Master (1942) Codeforces profile auto-attached."
  },
  {
    id: "APP-2026-002",
    company: "Citadel Securities",
    logoColor: "#0f172a",
    initials: "CS",
    title: "Low-Latency Core Engineer (HFT)",
    appliedYear: "2026",
    appliedDate: "August 26, 2026",
    appliedTime: "04:15 PM IST",
    targetBatch: "Immediate / 2027 Intern",
    workType: "Hybrid (4 Days On-site)",
    location: "Bengaluru · Technology Center",
    salary: "₹1.2 Cr – 1.8 Cr CTC",
    salaryBreakdown: {
      base: "₹55 LPA Base",
      relocation: "₹25 LPA Sign-on / Joining",
      bonus: "₹50–90 LPA Discretionary Performance Pool"
    },
    currentStageIndex: 2,
    status: "Round 1: Low-Latency C++ Scheduled",
    matchScore: 94,
    companyStats: {
      headcount: "4,000+ Worldwide",
      acceptanceRate: "1.2% Selection Rate",
      hiringPace: "Avg. 21 Days Pipeline",
      primaryStack: "C++20, DPDK, Solarflare OpenOnload, FPGA"
    },
    notes: "High match in C++ (94%) and Probability Systems."
  },
  {
    id: "APP-2026-003",
    company: "Tower Research Capital",
    logoColor: "#0284c7",
    initials: "TRC",
    title: "Quant Developer Intern",
    appliedYear: "2026",
    appliedDate: "August 24, 2026",
    appliedTime: "02:30 PM IST",
    targetBatch: "Summer 2027",
    workType: "Hybrid",
    location: "Gurugram · DLF CyberCity",
    salary: "₹28L–36L / month (Intern)",
    salaryBreakdown: {
      base: "₹28,00,000 / month",
      relocation: "₹6,00,000 Executive Housing",
      bonus: "Alpha Sharing & Return Offer Priority"
    },
    currentStageIndex: 0,
    status: "Under Review by Campus Team",
    matchScore: 91,
    companyStats: {
      headcount: "1,200+ Engineers",
      acceptanceRate: "1.5% Selection Rate",
      hiringPace: "Avg. 18 Days Pipeline",
      primaryStack: "Modern C++, Distributed Memory, Python"
    },
    notes: "Order matching engine project repository verified."
  },
  {
    id: "APP-2026-004",
    company: "Google",
    logoColor: "#ea4335",
    initials: "G",
    title: "Software Engineer Intern (Systems & Cloud)",
    appliedYear: "2026",
    appliedDate: "August 20, 2026",
    appliedTime: "11:00 AM IST",
    targetBatch: "Class of 2027",
    workType: "Hybrid",
    location: "Bengaluru / Hyderabad Hub",
    salary: "₹1.4L–2.2L / month (Intern)",
    salaryBreakdown: {
      base: "₹1,50,000 / month",
      relocation: "₹75,000 Relocation allowance",
      bonus: "Full PPO conversion potential (₹52 LPA CTC)"
    },
    currentStageIndex: 4,
    status: "Offer Extended 🎉",
    matchScore: 95,
    companyStats: {
      headcount: "180,000+ Worldwide",
      acceptanceRate: "0.2% General Selection",
      hiringPace: "Avg. 30 Days Pipeline",
      primaryStack: "Go, C++, Distributed Spanner, Borg"
    },
    notes: "All 3 technical rounds cleared with Strong Hire."
  }
];

export default function ApplicationsPage({
  applications = [],
  onAdvanceStage,
  onExploreJobs
}) {
  const [filterYear, setFilterYear] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalApp, setActiveModalApp] = useState(null);

  const appList = applications.length > 0 ? applications : DETAILED_APPLICATIONS;

  // Filter Logic (Year, Status, Firm/Role)
  const filteredApps = appList.filter((app) => {
    const matchesSearch =
      app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesYear = filterYear === "All" || app.appliedYear === filterYear;

    const matchesStatus =
      filterStatus === "All" ||
      (filterStatus === "In Progress" && app.currentStageIndex < 4) ||
      (filterStatus === "Offers" && app.currentStageIndex === 4);

    return matchesSearch && matchesYear && matchesStatus;
  });

  return (
    <div style={styles.container}>
      {/* Top Banner */}
      <div style={styles.headerBanner}>
        <div>
          <div style={styles.topBadgeRow}>
            <span style={styles.liveTag}>● REAL-TIME ATS ENGINE</span>
            <span style={styles.yearBadge}>ACADEMIC CYCLE: 2026–2027</span>
          </div>
          <h1 style={styles.headerTitle}>CANDIDATE APPLICATION TRACKER</h1>
          <p style={styles.headerSub}>
            Complete end-to-end recruitment audit trail, compensation packages, and live firm analytics.
          </p>
        </div>

        {/* Global Pipeline Statistics */}
        <div style={styles.summaryStats}>
          <div style={styles.summaryItem}>
            <span>Applications:</span> <strong>{appList.length}</strong>
          </div>
          <div style={styles.summaryItem}>
            <span>Active Rounds:</span> <strong>{appList.filter((a) => a.currentStageIndex > 0 && a.currentStageIndex < 4).length}</strong>
          </div>
          <div style={{ ...styles.summaryItem, backgroundColor: "#bbf7d0" }}>
            <span>Offers:</span> <strong style={{ color: "#15803d" }}>{appList.filter((a) => a.currentStageIndex === 4).length}</strong>
          </div>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div style={styles.filterSection}>
        <input
          type="text"
          placeholder="🔍 Search firm (Jane Street, Citadel, Google), location, or role title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchBar}
        />

        <div style={styles.filterRow}>
          {/* Year Filter */}
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            style={styles.dropdown}
          >
            <option value="All">All Years (2026)</option>
            <option value="2026">Applied in 2026</option>
            <option value="2025">Applied in 2025</option>
          </select>

          {/* Status Pills */}
          {["All", "In Progress", "Offers"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              style={{
                ...styles.filterTabBtn,
                backgroundColor: filterStatus === tab ? "#000000" : "#ffffff",
                color: filterStatus === tab ? "#ffffff" : "#000000",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Card Feed */}
      {filteredApps.length === 0 ? (
        <div style={styles.emptyCard}>
          <div style={{ fontSize: "40px", marginBottom: "10px" }}>📋</div>
          <h3 style={{ margin: "0 0 6px 0", fontWeight: "900" }}>No applications matching criteria</h3>
          <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "#6b7280" }}>
            Explore verified quant and software openings to submit your credentials.
          </p>
          <button onClick={onExploreJobs} style={styles.exploreBtn}>
            Explore Jobs Radar →
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {filteredApps.map((app) => (
            <div key={app.id} style={styles.appCard}>
              {/* Top Header & Firm Details */}
              <div style={styles.cardHeader}>
                <div style={styles.firmInfoWrap}>
                  <div
                    style={{
                      ...styles.logoInitials,
                      backgroundColor: app.logoColor || "#000000",
                    }}
                  >
                    {app.initials || app.company.substring(0, 2).toUpperCase()}
                  </div>

                  <div>
                    <div style={styles.metaBadgeRow}>
                      <span style={styles.companyName}>{app.company}</span>
                      <span style={styles.yearPill}>Year: {app.appliedYear}</span>
                      <span style={styles.dateBadge}>
                        📅 {app.appliedDate} · {app.appliedTime}
                      </span>
                    </div>

                    <h3 style={styles.jobTitle}>{app.title}</h3>

                    <div style={styles.subMetaRow}>
                      <span style={styles.batchTag}>🎯 Target: {app.targetBatch}</span>
                      <span>·</span>
                      <span>📍 {app.location} ({app.workType})</span>
                    </div>
                  </div>
                </div>

                {/* Status & Compensation Summary */}
                <div style={styles.statusAndActionWrap}>
                  <div
                    onClick={() => setActiveModalApp(app)}
                    title="Click for full CTC Breakdown"
                    style={styles.salaryTag}
                  >
                    💰 {app.salary}
                    <span style={styles.infoIcon}>ℹ️ Breakdown</span>
                  </div>

                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span
                      style={{
                        ...styles.statusBadge,
                        backgroundColor: app.currentStageIndex === 4 ? "#bbf7d0" : "#fef08a",
                      }}
                    >
                      {app.status}
                    </span>

                    <button
                      onClick={() => onAdvanceStage && onAdvanceStage(app.id)}
                      disabled={app.currentStageIndex >= STAGES_PIPELINE.length - 1}
                      style={{
                        ...styles.advanceStageBtn,
                        opacity: app.currentStageIndex >= STAGES_PIPELINE.length - 1 ? 0.5 : 1,
                        cursor: app.currentStageIndex >= STAGES_PIPELINE.length - 1 ? "not-allowed" : "pointer",
                      }}
                    >
                      Advance Stage (Demo) ⏩
                    </button>
                  </div>
                </div>
              </div>

              {/* Company Live Statistics Box */}
              {app.companyStats && (
                <div style={styles.companyStatsGrid}>
                  <div style={styles.statCell}>
                    <span style={styles.statLabel}>Global Headcount</span>
                    <strong style={styles.statValue}>{app.companyStats.headcount}</strong>
                  </div>
                  <div style={styles.statCell}>
                    <span style={styles.statLabel}>Historical Selection Ratio</span>
                    <strong style={styles.statValue}>{app.companyStats.acceptanceRate}</strong>
                  </div>
                  <div style={styles.statCell}>
                    <span style={styles.statLabel}>ATS Turnaround Pace</span>
                    <strong style={styles.statValue}>{app.companyStats.hiringPace}</strong>
                  </div>
                  <div style={styles.statCell}>
                    <span style={styles.statLabel}>Core Production Stack</span>
                    <strong style={{ ...styles.statValue, fontSize: "11px" }}>{app.companyStats.primaryStack}</strong>
                  </div>
                </div>
              )}

              {/* 5-Stage Stepper */}
              <div style={styles.stepperContainer}>
                {STAGES_PIPELINE.map((stageName, idx) => {
                  const isCompleted = idx < app.currentStageIndex;
                  const isCurrent = idx === app.currentStageIndex;

                  return (
                    <div key={idx} style={styles.stepItem}>
                      <div style={styles.stepCircleWrap}>
                        <div
                          style={{
                            ...styles.stepCircle,
                            backgroundColor: isCompleted ? "#22c55e" : isCurrent ? "#000000" : "#e5e7eb",
                            color: isCompleted || isCurrent ? "#ffffff" : "#9ca3af",
                          }}
                        >
                          {isCompleted ? "✓" : `0${idx + 1}`}
                        </div>
                        {idx < STAGES_PIPELINE.length - 1 && (
                          <div
                            style={{
                              ...styles.stepLine,
                              backgroundColor: idx < app.currentStageIndex ? "#22c55e" : "#e5e7eb",
                            }}
                          />
                        )}
                      </div>
                      <div
                        style={{
                          ...styles.stepLabel,
                          fontWeight: isCurrent ? "900" : "600",
                          color: isCurrent ? "#000000" : "#6b7280",
                        }}
                      >
                        {stageName}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CTC & APPLICATION AUDIT MODAL */}
      {activeModalApp && (
        <div style={modalStyles.overlay} onClick={() => setActiveModalApp(null)}>
          <div style={modalStyles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={modalStyles.header}>
              <div>
                <div style={modalStyles.companyTag}>
                  {activeModalApp.company} · Application Audit ({activeModalApp.appliedYear})
                </div>
                <h2 style={modalStyles.roleHeading}>{activeModalApp.title}</h2>
                <div style={{ fontSize: "12px", color: "#4b5563" }}>
                  Tracking ID: <strong>{activeModalApp.id}</strong> · Submitted: {activeModalApp.appliedDate}
                </div>
              </div>
              <button onClick={() => setActiveModalApp(null)} style={modalStyles.closeBtn}>
                ✕
              </button>
            </div>

            {/* Total Compensation Banner */}
            <div style={modalStyles.salaryTotalBox}>
              <span style={{ fontSize: "11px", fontWeight: "800", color: "#6b7280", letterSpacing: "1px" }}>
                OFFER PACKAGE BREAKDOWN
              </span>
              <div style={{ fontSize: "26px", fontWeight: "900", color: "#16a34a", marginTop: "4px" }}>
                {activeModalApp.salary}
              </div>
            </div>

            {/* Breakdown List */}
            <div style={modalStyles.salaryBreakdownList}>
              <div style={modalStyles.salaryItem}>
                <span style={{ fontWeight: "700" }}>Base Component:</span>
                <strong style={{ fontWeight: "900" }}>{activeModalApp.salaryBreakdown.base}</strong>
              </div>
              <div style={modalStyles.salaryItem}>
                <span style={{ fontWeight: "700" }}>Housing / Relocation Support:</span>
                <strong style={{ fontWeight: "900" }}>{activeModalApp.salaryBreakdown.relocation}</strong>
              </div>
              <div style={modalStyles.salaryItem}>
                <span style={{ fontWeight: "700" }}>Performance / Alpha Pool:</span>
                <strong style={{ fontWeight: "900" }}>{activeModalApp.salaryBreakdown.bonus}</strong>
              </div>
            </div>

            {/* Candidate Evidence Attached */}
            <div style={modalStyles.candidateProofBox}>
              <div style={{ fontWeight: "900", fontSize: "12px", marginBottom: "4px" }}>
                ATTACHED CREDENTIALS & AUDIT LOG
              </div>
              <p style={{ margin: 0, fontSize: "12px", color: "#4b5563" }}>
                {activeModalApp.notes}
              </p>
            </div>

            <button
              onClick={() => setActiveModalApp(null)}
              style={modalStyles.closeModalBtn}
            >
              Close Details
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
    padding: "22px 28px",
    boxShadow: "5px 5px 0px #000000",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "16px",
  },
  topBadgeRow: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    marginBottom: "6px",
  },
  liveTag: {
    fontSize: "11px",
    fontWeight: "900",
    color: "#ef4444",
    letterSpacing: "0.5px",
  },
  yearBadge: {
    fontSize: "11px",
    fontWeight: "900",
    backgroundColor: "#ffea28",
    border: "1px solid #000000",
    padding: "2px 8px",
    borderRadius: "6px",
  },
  headerTitle: {
    margin: "0 0 4px 0",
    fontSize: "24px",
    fontWeight: "900",
    letterSpacing: "-0.5px",
  },
  headerSub: {
    margin: 0,
    fontSize: "13px",
    color: "#4b5563",
  },
  summaryStats: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  summaryItem: {
    backgroundColor: "#fdfbf7",
    border: "1.5px solid #000000",
    borderRadius: "8px",
    padding: "6px 12px",
    fontSize: "12px",
    boxShadow: "2px 2px 0px #000000",
  },
  filterSection: {
    backgroundColor: "#ffffff",
    border: "2.5px solid #000000",
    borderRadius: "16px",
    padding: "16px 20px",
    boxShadow: "5px 5px 0px #000000",
    marginBottom: "22px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "14px",
    flexWrap: "wrap",
  },
  searchBar: {
    flex: 1,
    minWidth: "260px",
    padding: "10px 14px",
    border: "2px solid #000000",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    backgroundColor: "#fdfbf7",
    boxShadow: "2px 2px 0px #000000",
    outline: "none",
  },
  filterRow: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  dropdown: {
    padding: "9px 12px",
    border: "2px solid #000000",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "800",
    backgroundColor: "#ffffff",
    boxShadow: "2px 2px 0px #000000",
    cursor: "pointer",
  },
  filterTabBtn: {
    border: "2px solid #000000",
    borderRadius: "8px",
    padding: "8px 14px",
    fontSize: "12px",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow: "2px 2px 0px #000000",
  },
  appCard: {
    backgroundColor: "#ffffff",
    border: "2.5px solid #000000",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "5px 5px 0px #000000",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "18px",
    flexWrap: "wrap",
    gap: "16px",
  },
  firmInfoWrap: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  logoInitials: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    border: "2px solid #000000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "900",
    boxShadow: "2px 2px 0px #000000",
  },
  metaBadgeRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "4px",
    flexWrap: "wrap",
  },
  companyName: {
    fontSize: "13px",
    fontWeight: "900",
    textTransform: "uppercase",
    color: "#000000",
  },
  yearPill: {
    backgroundColor: "#e0e7ff",
    border: "1px solid #000000",
    borderRadius: "4px",
    padding: "2px 6px",
    fontSize: "10px",
    fontWeight: "900",
  },
  dateBadge: {
    backgroundColor: "#f1f5f9",
    border: "1px solid #000000",
    borderRadius: "4px",
    padding: "2px 6px",
    fontSize: "11px",
    color: "#334155",
    fontWeight: "700",
  },
  jobTitle: {
    margin: "2px 0 4px 0",
    fontSize: "18px",
    fontWeight: "900",
  },
  subMetaRow: {
    fontSize: "12px",
    color: "#4b5563",
    fontWeight: "600",
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  batchTag: {
    backgroundColor: "#fdfbf7",
    border: "1px solid #cbd5e1",
    borderRadius: "4px",
    padding: "1px 6px",
    fontWeight: "700",
  },
  statusAndActionWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "8px",
  },
  salaryTag: {
    backgroundColor: "#fef08a",
    border: "1.5px solid #000000",
    borderRadius: "8px",
    padding: "6px 10px",
    fontSize: "13px",
    fontWeight: "900",
    boxShadow: "2px 2px 0px #000000",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  infoIcon: {
    fontSize: "10px",
    backgroundColor: "#ffffff",
    border: "1px solid #000000",
    borderRadius: "4px",
    padding: "1px 4px",
  },
  statusBadge: {
    border: "1.5px solid #000000",
    borderRadius: "6px",
    padding: "4px 10px",
    fontSize: "11px",
    fontWeight: "900",
    color: "#000000",
  },
  advanceStageBtn: {
    backgroundColor: "#7c3aed",
    color: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "8px",
    padding: "6px 12px",
    fontSize: "11px",
    fontWeight: "900",
    boxShadow: "2px 2px 0px #000000",
  },
  companyStatsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "10px",
    backgroundColor: "#f8fafc",
    border: "1.5px solid #000000",
    borderRadius: "10px",
    padding: "12px",
    marginBottom: "20px",
  },
  statCell: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  statLabel: {
    fontSize: "10px",
    fontWeight: "800",
    color: "#64748b",
    textTransform: "uppercase",
  },
  statValue: {
    fontSize: "12px",
    fontWeight: "900",
    color: "#0f172a",
  },
  stepperContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "8px",
  },
  stepItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  stepCircleWrap: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    marginBottom: "8px",
  },
  stepCircle: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    border: "2px solid #000000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "900",
    margin: "0 auto",
    zIndex: 2,
  },
  stepLine: {
    flex: 1,
    height: "3px",
    margin: "0 -50% 0 -50%",
    zIndex: 1,
  },
  stepLabel: {
    fontSize: "11px",
    lineHeight: "1.3",
  },
  emptyCard: {
    backgroundColor: "#ffffff",
    border: "2.5px solid #000000",
    borderRadius: "16px",
    padding: "48px 20px",
    textAlign: "center",
    boxShadow: "5px 5px 0px #000000",
  },
  exploreBtn: {
    backgroundColor: "#000000",
    color: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "8px",
    padding: "10px 18px",
    fontWeight: "800",
    fontSize: "13px",
    cursor: "pointer",
    boxShadow: "3px 3px 0px #ff3d9a",
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
    fontFamily: "'Space Grotesk', system-ui, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottom: "2px solid #000000",
    paddingBottom: "14px",
    marginBottom: "16px",
  },
  companyTag: {
    fontSize: "11px",
    fontWeight: "900",
    color: "#6b7280",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  roleHeading: {
    margin: "2px 0 4px 0",
    fontSize: "20px",
    fontWeight: "900",
  },
  closeBtn: {
    background: "none",
    border: "2px solid #000000",
    borderRadius: "8px",
    width: "32px",
    height: "32px",
    fontWeight: "900",
    cursor: "pointer",
    boxShadow: "2px 2px 0px #000000",
  },
  salaryTotalBox: {
    backgroundColor: "#fdfbf7",
    border: "2px solid #000000",
    borderRadius: "12px",
    padding: "16px",
    textAlign: "center",
    margin: "16px 0",
    boxShadow: "3px 3px 0px #000000",
  },
  salaryBreakdownList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "16px",
  },
  salaryItem: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: "6px",
  },
  candidateProofBox: {
    backgroundColor: "#f1f5f9",
    border: "1.5px solid #000000",
    borderRadius: "10px",
    padding: "10px 14px",
    marginBottom: "20px",
  },
  closeModalBtn: {
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