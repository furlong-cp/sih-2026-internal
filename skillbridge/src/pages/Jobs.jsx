import React, { useState, useMemo } from "react";

// Official CDN logos & Fallbacks for Top Tech & HFT Firms
const COMPANY_PROFILES = {
  "Jane Street": {
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Jane_Street_Capital_Logo.svg",
    fallbackText: "JS",
    color: "#1e3a8a",
    type: "HFT / Quant",
  },
  "Citadel Securities": {
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/36/Citadel_Securities_Logo.svg",
    fallbackText: "CS",
    color: "#0f172a",
    type: "HFT / Market Maker",
  },
  "Tower Research Capital": {
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/eb/Tower_Research_Capital_Logo.svg",
    fallbackText: "TRC",
    color: "#0284c7",
    type: "HFT / Prop Trading",
  },
  "Hudson River Trading": {
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/52/Hudson_River_Trading_Logo.svg",
    fallbackText: "HRT",
    color: "#ea580c",
    type: "HFT / Quant",
  },
  "Jump Trading": {
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/30/Jump_Trading_logo.svg",
    fallbackText: "JT",
    color: "#000000",
    type: "HFT / Crypto & Prop",
  },
  "Optiver": {
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/77/Optiver_logo.svg",
    fallbackText: "OPT",
    color: "#dc2626",
    type: "Market Maker / Derivatives",
  },
  "Google": {
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    fallbackText: "G",
    color: "#ea4335",
    type: "Big Tech / Cloud & AI",
  },
  "Apple": {
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    fallbackText: "APL",
    color: "#000000",
    type: "Big Tech / Hardware & OS",
  },
  "Microsoft": {
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
    fallbackText: "MSFT",
    color: "#00a4ef",
    type: "Big Tech / Enterprise & AI",
  },
  "Meta": {
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
    fallbackText: "META",
    color: "#0668e1",
    type: "Big Tech / Distributed Systems",
  },
  "Salesforce": {
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg",
    fallbackText: "SFDC",
    color: "#00a1e0",
    type: "Enterprise SaaS / AI",
  },
  "Uber": {
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png",
    fallbackText: "UBER",
    color: "#000000",
    type: "Mobility & High QPS",
  },
  "Databricks": {
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/63/Databricks_Logo.png",
    fallbackText: "DBX",
    color: "#ff3621",
    type: "Data Systems / AI Infrastructure",
  },
  "Amazon": {
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    fallbackText: "AMZN",
    color: "#ff9900",
    type: "Big Tech / AWS & Distributed",
  },
};

const COMPANY_NAMES = Object.keys(COMPANY_PROFILES);

const ROLES_BY_CATEGORY = {
  Quant: [
    {
      title: "Quant Trader Intern",
      pay: "₹32L–40L / month (Intern)",
      breakdown: { base: "₹32,00,000 / mo", signon: "₹8,00,000 Housing/Relo", bonus: "Discretionary PnL Pool" },
      matchedSkills: ["Probability", "C++", "Python"],
      missingSkill: "Stochastic Calculus",
      gapBoost: "+6% Match Boost",
    },
    {
      title: "Quant Developer Intern",
      pay: "₹28L–36L / month (Intern)",
      breakdown: { base: "₹28,00,000 / mo", signon: "₹6,00,000 Housing", bonus: "Discretionary Performance Pool" },
      matchedSkills: ["Modern C++", "DSA", "Linux"],
      missingSkill: "Low-Latency Kernel Bypass",
      gapBoost: "+8% Match Boost",
    },
    {
      title: "Quantitative Researcher",
      pay: "₹1.4 Cr – 2.2 Cr CTC",
      breakdown: { base: "₹65 LPA Base", signon: "₹35 LPA Joining", bonus: "₹70–120 LPA Alpha Bonus" },
      matchedSkills: ["Machine Learning", "Probability", "Python"],
      missingSkill: "Stochastic Portfolio Theory",
      gapBoost: "+5% Match Boost",
    },
    {
      title: "Low-Latency Core Engineer",
      pay: "₹1.2 Cr – 1.8 Cr CTC",
      breakdown: { base: "₹55 LPA Base", signon: "₹25 LPA Sign-on", bonus: "₹50–90 LPA Discretionary" },
      matchedSkills: ["C++20", "Memory Models", "DSA"],
      missingSkill: "DPDK & Solarflare OpenOnload",
      gapBoost: "+7% Match Boost",
    },
  ],
  SWE: [
    {
      title: "Software Engineer Intern",
      pay: "₹1.4L–2.2L / month (Intern)",
      breakdown: { base: "₹1,50,000 / mo", signon: "₹50,000 Relocation", bonus: "Return Offer Fast-track" },
      matchedSkills: ["DSA", "Go", "Java"],
      missingSkill: "High QPS System Design",
      gapBoost: "+9% Match Boost",
    },
    {
      title: "Backend Systems Engineer",
      pay: "₹52 LPA – 78 LPA CTC",
      breakdown: { base: "₹36 LPA Base", signon: "₹10 LPA Stocks (RSU)", bonus: "₹12 LPA Annual Performance" },
      matchedSkills: ["Distributed Systems", "Kafka", "PostgreSQL"],
      missingSkill: "Raft Consensus Algorithm",
      gapBoost: "+6% Match Boost",
    },
    {
      title: "AI & Distributed Systems SWE",
      pay: "₹65 LPA – 95 LPA CTC",
      breakdown: { base: "₹45 LPA Base", signon: "₹25 LPA RSUs", bonus: "₹15 LPA Target Bonus" },
      matchedSkills: ["PyTorch", "C++", "Python"],
      missingSkill: "Distributed Tensor Parallelism (CUDA)",
      gapBoost: "+8% Match Boost",
    },
    {
      title: "Core Infrastructure Engineer",
      pay: "₹48 LPA – 72 LPA CTC",
      breakdown: { base: "₹32 LPA Base", signon: "₹12 LPA RSUs", bonus: "₹8 LPA Bonus" },
      matchedSkills: ["Docker", "Kubernetes", "Rust"],
      missingSkill: "eBPF Tracing & Kernel Observability",
      gapBoost: "+7% Match Boost",
    },
  ],
};

const LOCATIONS = [
  "Singapore · Relocation",
  "London · Relocation",
  "New York · On-site",
  "Bengaluru · Hybrid",
  "Hyderabad · On-site",
  "Gurugram · Hybrid",
  "Mumbai · On-site",
  "Remote · Global",
];

const generateComprehensiveJobs = () => {
  const jobs = [];
  for (let i = 1; i <= 1080; i++) {
    const compName = COMPANY_NAMES[i % COMPANY_NAMES.length];
    const compInfo = COMPANY_PROFILES[compName];
    const isQuantFirm = compInfo.type.includes("HFT") || compInfo.type.includes("Quant") || compInfo.type.includes("Market Maker");

    const rolePool = isQuantFirm ? ROLES_BY_CATEGORY.Quant : ROLES_BY_CATEGORY.SWE;
    const roleObj = rolePool[(i * 3) % rolePool.length];
    const location = LOCATIONS[(i * 5) % LOCATIONS.length];
    const matchScore = 74 + ((i * 17) % 25);

    jobs.push({
      id: `SB-JOB-${1000 + i}`,
      company: compName,
      companyLogo: compInfo.logo,
      companyType: compInfo.type,
      title: roleObj.title,
      salary: roleObj.pay,
      breakdown: roleObj.breakdown,
      matchedSkills: roleObj.matchedSkills,
      missingSkill: roleObj.missingSkill,
      gapBoost: roleObj.gapBoost,
      location: location,
      match: matchScore,
      posted: `${(i % 12) + 1}d ago`,
      isQuant: isQuantFirm,
    });
  }
  return jobs;
};

const ALL_JOBS = generateComprehensiveJobs();

const STAGES_PIPELINE = [
  "Application Submitted",
  "Automated OA / CoderPad",
  "Technical Round 1 (Low-Latency / DSA)",
  "Technical Round 2 (System Design / Probability)",
  "Offer Extended 🎉"
];

export default function JobsPage() {
  const [activeView, setActiveView] = useState("explore"); // "explore" | "my-applications"
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFirm, setSelectedFirm] = useState("All");
  const [selectedTrack, setSelectedTrack] = useState("All");
  const [minMatch, setMinMatch] = useState(70);
  const [currentPage, setCurrentPage] = useState(1);
  const [savedJobs, setSavedJobs] = useState(new Set());
  
  // Salary Breakdown Tooltip State
  const [activeSalaryModal, setActiveSalaryModal] = useState(null);
  const [expandedGapJobId, setExpandedGapJobId] = useState(null);

  // Default pre-loaded application with full metadata and timeline
  const [submittedApplications, setSubmittedApplications] = useState([
    {
      id: "APP-MOCK-1",
      fullName: "Alex Henderson",
      email: "alex@college.edu",
      job: ALL_JOBS[0], // Jane Street Quant Trader Intern
      appliedDate: "August 28, 2026",
      appliedTime: "10:45 AM IST",
      currentStageIndex: 1,
      status: "OA Link Sent",
    },
    {
      id: "APP-MOCK-2",
      fullName: "Alex Henderson",
      email: "alex@college.edu",
      job: ALL_JOBS[1], // Citadel Securities Low-Latency Core Engineer
      appliedDate: "August 26, 2026",
      appliedTime: "04:15 PM IST",
      currentStageIndex: 2,
      status: "Technical Round 1 Scheduled",
    }
  ]);
  const [activeApplyingJob, setActiveApplyingJob] = useState(null);

  const jobsPerPage = 9;

  const filteredJobs = useMemo(() => {
    return ALL_JOBS.filter((job) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.salary.toLowerCase().includes(q) ||
        job.matchedSkills.some((s) => s.toLowerCase().includes(q)) ||
        job.missingSkill.toLowerCase().includes(q);

      const matchesFirm = selectedFirm === "All" || job.company === selectedFirm;
      const matchesTrack =
        selectedTrack === "All" ||
        (selectedTrack === "Quant/HFT" && job.isQuant) ||
        (selectedTrack === "BigTech/SWE" && !job.isQuant);
      const matchesScore = job.match >= minMatch;

      return matchesSearch && matchesFirm && matchesTrack && matchesScore;
    });
  }, [searchQuery, selectedFirm, selectedTrack, minMatch]);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const displayedJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  const toggleSave = (id) => {
    setSavedJobs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleApplicationSubmit = (formData) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
    const formattedTime = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });

    const newApp = {
      id: `APP-${Date.now()}`,
      ...formData,
      job: activeApplyingJob,
      appliedDate: formattedDate,
      appliedTime: `${formattedTime} IST`,
      currentStageIndex: 0,
      status: "Under Review",
    };

    setSubmittedApplications((prev) => [newApp, ...prev]);
    setActiveApplyingJob(null);
    setActiveView("my-applications");
  };

  const isAlreadyApplied = (jobId) => {
    return submittedApplications.some((app) => app.job.id === jobId);
  };

  const advanceApplicationStage = (appId) => {
    setSubmittedApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          const nextIdx = Math.min(app.currentStageIndex + 1, STAGES_PIPELINE.length - 1);
          return {
            ...app,
            currentStageIndex: nextIdx,
            status: nextIdx === STAGES_PIPELINE.length - 1 ? "Offer Extended 🎉" : `${STAGES_PIPELINE[nextIdx]} Active`,
          };
        }
        return app;
      })
    );
  };

  return (
    <div style={styles.container}>
      {/* Top Header Banner with Navigation Tabs */}
      <div style={styles.headerBanner}>
        <div>
          <div style={styles.topBadgeRow}>
            <span style={styles.liveTag}>● REAL-TIME ATS PORTAL</span>
            <span style={styles.verifiedCount}>{ALL_JOBS.length} Verified Positions</span>
          </div>
          <h1 style={styles.headerTitle}>CAREER OPPORTUNITY RADAR</h1>
          <p style={styles.headerSub}>
            Direct algorithmic matching with top-tier HFT firms, Prop Desks, and Big Tech Engineering teams.
          </p>
        </div>
        
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            onClick={() => setActiveView("explore")}
            style={{
              ...styles.tabSwitchBtn,
              backgroundColor: activeView === "explore" ? "#000000" : "#ffffff",
              color: activeView === "explore" ? "#ffffff" : "#000000",
            }}
          >
            Explore Jobs ({filteredJobs.length})
          </button>
          <button
            onClick={() => setActiveView("my-applications")}
            style={{
              ...styles.tabSwitchBtn,
              backgroundColor: activeView === "my-applications" ? "#ff3d9a" : "#ffffff",
              color: activeView === "my-applications" ? "#ffffff" : "#000000",
            }}
          >
            My Applications ({submittedApplications.length})
          </button>
        </div>
      </div>

      {activeView === "explore" ? (
        <>
          {/* Filter Control Board */}
          <div style={styles.filterSection}>
            <input
              type="text"
              placeholder="🔍 Search roles, firms (Jane Street, Citadel, Google), skills (C++, DSA), or pay..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              style={styles.searchBar}
            />

            <div style={styles.filterRow}>
              <select
                value={selectedTrack}
                onChange={(e) => {
                  setSelectedTrack(e.target.value);
                  setCurrentPage(1);
                }}
                style={styles.dropdown}
              >
                <option value="All">All Tracks (Quant & SWE)</option>
                <option value="Quant/HFT">Quant / HFT / Market Making</option>
                <option value="BigTech/SWE">Big Tech / SWE / AI</option>
              </select>

              <select
                value={selectedFirm}
                onChange={(e) => {
                  setSelectedFirm(e.target.value);
                  setCurrentPage(1);
                }}
                style={styles.dropdown}
              >
                <option value="All">All Companies (14 Selected)</option>
                {COMPANY_NAMES.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>

              <div style={styles.sliderWrap}>
                <label style={styles.sliderLabel}>Min Skill Match: {minMatch}%</label>
                <input
                  type="range"
                  min="70"
                  max="95"
                  value={minMatch}
                  onChange={(e) => {
                    setMinMatch(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  style={styles.slider}
                />
              </div>
            </div>
          </div>

          {/* Job Cards Matrix */}
          <div style={styles.grid}>
            {displayedJobs.map((job) => {
              const applied = isAlreadyApplied(job.id);
              const isSaved = savedJobs.has(job.id);
              const isGapOpen = expandedGapJobId === job.id;

              return (
                <div key={job.id} style={styles.card}>
                  <div>
                    <div style={styles.cardTop}>
                      <div style={styles.logoAndCompany}>
                        <div style={styles.logoContainer}>
                          <img
                            src={job.companyLogo}
                            alt={job.company}
                            style={styles.companyLogoImg}
                            onError={(e) => {
                              e.target.style.display = "none";
                              if (e.target.nextSibling) {
                                e.target.nextSibling.style.display = "flex";
                              }
                            }}
                          />
                          <div
                            style={{
                              display: "none",
                              width: "100%",
                              height: "100%",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: "900",
                              fontSize: "11px",
                              color: "#ffffff",
                              backgroundColor: COMPANY_PROFILES[job.company]?.color || "#000000",
                              borderRadius: "4px",
                            }}
                          >
                            {COMPANY_PROFILES[job.company]?.fallbackText || job.company.substring(0, 2).toUpperCase()}
                          </div>
                        </div>
                        <div>
                          <span style={styles.companyBadge}>{job.company}</span>
                          <div style={styles.companyType}>{job.companyType}</div>
                        </div>
                      </div>
                      <div
                        style={{
                          ...styles.matchBadge,
                          backgroundColor: job.match >= 90 ? "#bbf7d0" : "#fed7aa",
                        }}
                      >
                        {job.match}% match
                      </div>
                    </div>

                    <h3 style={styles.jobTitle}>{job.title}</h3>
                    <div style={styles.locText}>📍 {job.location} · {job.posted}</div>

                    {/* Interactive Compensation Chip */}
                    <div
                      onClick={() => setActiveSalaryModal(job)}
                      title="Click for full CTC Breakdown"
                      style={{
                        ...styles.salaryTag,
                        backgroundColor: job.isQuant ? "#fef08a" : "#e0e7ff",
                        cursor: "pointer",
                      }}
                    >
                      <span style={{ marginRight: "6px" }}>{job.isQuant ? "⚡" : "💼"}</span>
                      {job.salary}
                      <span style={styles.breakdownBadge}>Breakdown ℹ️</span>
                    </div>

                    {/* Verified Matching Skills */}
                    <div style={styles.skillRow}>
                      {job.matchedSkills.map((skill, idx) => (
                        <span key={idx} style={styles.skillPill}>
                          ✓ {skill}
                        </span>
                      ))}
                    </div>

                    {/* Skill Gap Analyzer Widget */}
                    <div style={styles.gapContainer}>
                      <div
                        onClick={() => setExpandedGapJobId(isGapOpen ? null : job.id)}
                        style={styles.gapHeaderToggle}
                      >
                        <span style={{ fontSize: "11px", fontWeight: "900", color: "#6b7280" }}>
                          SKILL GAP ANALYSIS {isGapOpen ? "▲" : "▼"}
                        </span>
                        <span style={styles.gapBoostPill}>{job.gapBoost}</span>
                      </div>

                      {isGapOpen && (
                        <div style={styles.gapContent}>
                          <div style={{ fontSize: "12px", color: "#374151", marginBottom: "6px" }}>
                            Missing skill for <strong>100% bypass</strong>:
                          </div>
                          <div style={styles.missingSkillChip}>
                            ⚠️ {job.missingSkill}
                          </div>
                          <button
                            onClick={() => alert(`Launching assessment module for ${job.missingSkill}...`)}
                            style={styles.bridgeBtn}
                          >
                            Bridge this Gap (+{job.gapBoost.split(" ")[0]}) →
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={styles.cardActions}>
                    <button
                      onClick={() => !applied && setActiveApplyingJob(job)}
                      disabled={applied}
                      style={{
                        ...styles.applyBtn,
                        backgroundColor: applied ? "#22c55e" : "#000000",
                        color: "#ffffff",
                        cursor: applied ? "default" : "pointer",
                      }}
                    >
                      {applied ? "✓ Submitted" : "Quick Apply →"}
                    </button>
                    <button
                      onClick={() => toggleSave(job.id)}
                      style={{
                        ...styles.saveBtn,
                        backgroundColor: isSaved ? "#ffea28" : "#ffffff",
                      }}
                    >
                      {isSaved ? "★" : "☆"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={styles.pagination}>
              <button
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((p) => p - 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                style={styles.pageBtn}
              >
                ← Previous
              </button>
              <span style={styles.pageInfo}>
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({filteredJobs.length} total)
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage((p) => p + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                style={styles.pageBtn}
              >
                Next →
              </button>
            </div>
          )}
        </>
      ) : (
        /* MY APPLICATIONS TRACKER VIEW (SHOWS ALL APPLICATIONS & EXACT APPLIED DATES) */
        <div style={styles.applicationsTrackerView}>
          <div style={styles.trackerHeader}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <h2 style={{ margin: "0 0 4px 0", fontSize: "22px", fontWeight: "900" }}>
                  All Submitted Applications ({submittedApplications.length})
                </h2>
                <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>
                  Detailed tracking of your active ATS submissions, exact timestamps, and interview stages.
                </p>
              </div>

              <div style={styles.summaryStats}>
                <div style={styles.summaryItem}>
                  <span>Total Applied:</span> <strong>{submittedApplications.length}</strong>
                </div>
                <div style={styles.summaryItem}>
                  <span>Active Stages:</span> <strong>{submittedApplications.filter(a => a.currentStageIndex > 0).length}</strong>
                </div>
              </div>
            </div>
          </div>

          {submittedApplications.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>📋</div>
              <h3 style={{ margin: "0 0 6px 0", fontWeight: "900" }}>No applications submitted yet</h3>
              <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "#6b7280" }}>
                Explore open quant & SWE roles and submit your verified credentials.
              </p>
              <button
                onClick={() => setActiveView("explore")}
                style={styles.applyBtnSmall}
              >
                Explore Radar →
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
              {submittedApplications.map((app) => (
                <div key={app.id} style={styles.appPipelineCard}>
                  {/* Card Header & Application Details */}
                  <div style={styles.appPipelineHeader}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                        <span style={styles.companyBadge}>{app.job.company}</span>
                        <span style={styles.dateStampBadge}>
                          📅 Applied: <strong>{app.appliedDate}</strong> at {app.appliedTime}
                        </span>
                      </div>
                      <h3 style={{ margin: "4px 0", fontSize: "19px", fontWeight: "900" }}>{app.job.title}</h3>
                      <div style={{ fontSize: "13px", color: "#4b5563", fontWeight: "700" }}>
                        Package: <span style={{ color: "#16a34a" }}>{app.job.salary}</span> · Location: {app.job.location}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <span
                        style={{
                          ...styles.statusBadge,
                          backgroundColor: app.currentStageIndex === 4 ? "#bbf7d0" : "#fef08a",
                        }}
                      >
                        {app.status}
                      </span>
                      
                      {/* Interactive Stage Advancer */}
                      <button
                        onClick={() => advanceApplicationStage(app.id)}
                        disabled={app.currentStageIndex >= STAGES_PIPELINE.length - 1}
                        style={{
                          ...styles.demoAdvanceBtn,
                          opacity: app.currentStageIndex >= STAGES_PIPELINE.length - 1 ? 0.6 : 1,
                          cursor: app.currentStageIndex >= STAGES_PIPELINE.length - 1 ? "not-allowed" : "pointer"
                        }}
                      >
                        Advance Stage (Demo) ⏩
                      </button>
                    </div>
                  </div>

                  {/* Stage Progress Stepper */}
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
        </div>
      )}

      {/* SALARY BREAKDOWN MODAL */}
      {activeSalaryModal && (
        <div style={modalStyles.overlay} onClick={() => setActiveSalaryModal(null)}>
          <div style={modalStyles.salaryModalCard} onClick={(e) => e.stopPropagation()}>
            <div style={modalStyles.header}>
              <div>
                <div style={modalStyles.companyTag}>{activeSalaryModal.company} Compensation Package</div>
                <h2 style={modalStyles.roleHeading}>{activeSalaryModal.title}</h2>
              </div>
              <button onClick={() => setActiveSalaryModal(null)} style={modalStyles.closeBtn}>
                ✕
              </button>
            </div>

            <div style={modalStyles.salaryTotalBox}>
              <span style={{ fontSize: "12px", fontWeight: "800", color: "#4b5563" }}>TOTAL ESTIMATED COMPENSATION</span>
              <div style={{ fontSize: "28px", fontWeight: "900", color: "#16a34a" }}>
                {activeSalaryModal.salary}
              </div>
            </div>

            <div style={modalStyles.salaryBreakdownList}>
              <div style={modalStyles.salaryItem}>
                <span style={{ fontWeight: "700" }}>Base Component:</span>
                <strong style={{ fontWeight: "900" }}>{activeSalaryModal.breakdown.base}</strong>
              </div>
              <div style={modalStyles.salaryItem}>
                <span style={{ fontWeight: "700" }}>Relocation / Sign-On:</span>
                <strong style={{ fontWeight: "900" }}>{activeSalaryModal.breakdown.signon}</strong>
              </div>
              <div style={modalStyles.salaryItem}>
                <span style={{ fontWeight: "700" }}>Performance / Alpha Bonus:</span>
                <strong style={{ fontWeight: "900" }}>{activeSalaryModal.breakdown.bonus}</strong>
              </div>
            </div>

            <button
              onClick={() => setActiveSalaryModal(null)}
              style={modalStyles.submitFormBtn}
            >
              Close Breakdown
            </button>
          </div>
        </div>
      )}

      {/* JOB APPLICATION MODAL (WITH 1-CLICK VERIFICATION & EXACT TIMESTAMPING) */}
      {activeApplyingJob && (
        <ApplicationModal
          job={activeApplyingJob}
          onClose={() => setActiveApplyingJob(null)}
          onSubmit={handleApplicationSubmit}
        />
      )}
    </div>
  );
}

/* =========================================================
   APPLICATION MODAL COMPONENT
========================================================= */
function ApplicationModal({ job, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    fullName: "Alex Henderson",
    email: "alex@college.edu",
    phone: "+91 98765 43210",
    degree: "Mathematics & Computing",
    graduationYear: "2027",
    workAuth: "Citizen / Permanent Resident",
    codeforcesHandle: "tourist_fan",
    githubUrl: "https://github.com/alex-henderson",
    coverLetterNote: "",
  });

  const [verifiedCfData, setVerifiedCfData] = useState(null);
  const [isVerifyingCf, setIsVerifyingCf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const verifyCompetitiveProfile = () => {
    if (!formData.codeforcesHandle.trim()) {
      setError("Please enter a handle to verify.");
      return;
    }
    setError("");
    setIsVerifyingCf(true);
    setTimeout(() => {
      setIsVerifyingCf(false);
      setVerifiedCfData({
        handle: formData.codeforcesHandle,
        rank: "Candidate Master",
        rating: 1942,
        maxRating: 2018,
        solvedProblems: 480,
      });
    }, 600);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim()) {
      setError("Please complete your Full Name and Email Address.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSubmit({ ...formData, verifiedCredentials: verifiedCfData });
    }, 600);
  };

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modalCard}>
        <div style={modalStyles.header}>
          <div>
            <div style={modalStyles.companyTag}>{job.company} · Verified ATS Fast-Track</div>
            <h2 style={modalStyles.roleHeading}>{job.title}</h2>
            <div style={modalStyles.metaPay}>
              <span>💰 {job.salary}</span>
              <span style={{ margin: "0 8px" }}>·</span>
              <span>📍 {job.location}</span>
            </div>
          </div>
          <button onClick={onClose} style={modalStyles.closeBtn}>
            ✕
          </button>
        </div>

        {error && <div style={modalStyles.errorBox}>{error}</div>}

        <form onSubmit={handleFormSubmit} style={modalStyles.formBody}>
          <div style={modalStyles.sectionTitle}>1. Personal & Contact Details</div>
          
          <div style={modalStyles.grid2}>
            <div style={modalStyles.inputGroup}>
              <label style={modalStyles.label}>Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                style={modalStyles.input}
                required
              />
            </div>
            <div style={modalStyles.inputGroup}>
              <label style={modalStyles.label}>Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={modalStyles.input}
                required
              />
            </div>
          </div>

          <div style={modalStyles.grid2}>
            <div style={modalStyles.inputGroup}>
              <label style={modalStyles.label}>Current Degree & Major</label>
              <select
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                style={modalStyles.select}
              >
                <option value="Mathematics & Computing">Mathematics & Computing</option>
                <option value="B.Tech in Computer Science">B.Tech in Computer Science</option>
                <option value="Data Science & Artificial Intelligence">Data Science & AI</option>
                <option value="Electrical Engineering / ECE">Electrical / ECE</option>
              </select>
            </div>

            <div style={modalStyles.inputGroup}>
              <label style={modalStyles.label}>Graduation Batch</label>
              <select
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                style={modalStyles.select}
              >
                <option value="2028">2028 (Undergrad Year 1)</option>
                <option value="2027">2027 (Undergrad Year 2)</option>
                <option value="2026">2026 (Undergrad Year 3)</option>
                <option value="2025">2025 (Final Year / Graduated)</option>
              </select>
            </div>
          </div>

          <div style={modalStyles.sectionTitle}>2. 1-Click Proof of Work Verification</div>

          <div style={modalStyles.verificationContainer}>
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
              <div style={{ ...modalStyles.inputGroup, flex: 1 }}>
                <label style={modalStyles.label}>Codeforces / LeetCode Handle</label>
                <input
                  type="text"
                  name="codeforcesHandle"
                  placeholder="e.g. tourist / candidate_master"
                  value={formData.codeforcesHandle}
                  onChange={handleChange}
                  style={modalStyles.input}
                />
              </div>
              <button
                type="button"
                onClick={verifyCompetitiveProfile}
                disabled={isVerifyingCf}
                style={modalStyles.verifyHandleBtn}
              >
                {isVerifyingCf ? "Fetching API..." : "Verify Handle ⚡"}
              </button>
            </div>

            {verifiedCfData && (
              <div style={modalStyles.verifiedCard}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: "900", color: "#6b7280" }}>
                      VERIFIED COMPETITIVE RATING
                    </span>
                    <div style={{ fontSize: "16px", fontWeight: "900", color: "#7c3aed" }}>
                      {verifiedCfData.rank} ({verifiedCfData.rating} Rating)
                    </div>
                  </div>
                  <span style={modalStyles.verifiedShield}>✓ API VERIFIED</span>
                </div>
                <div style={{ fontSize: "12px", color: "#4b5563", marginTop: "4px" }}>
                  Peak: <strong>{verifiedCfData.maxRating}</strong> · Problems Solved: <strong>{verifiedCfData.solvedProblems}+</strong>
                </div>
              </div>
            )}
          </div>

          {/* SkillBridge Score Attachment Chip */}
          <div style={modalStyles.scoreAttachmentPill}>
            <div>
              <div style={{ fontWeight: "900", fontSize: "13px" }}>✓ Auto-attaching SkillBridge Verified Evidence</div>
              <div style={{ fontSize: "11px", color: "#4b5563" }}>
                Score: <strong>742 (Top 18%)</strong> · C++ (94%) · Probability (88%)
              </div>
            </div>
            <span style={modalStyles.verifiedShield}>ATTACHED 🛡️</span>
          </div>

          <div style={modalStyles.inputGroup}>
            <label style={modalStyles.label}>Low-Latency & Quant Project Highlights</label>
            <textarea
              name="coverLetterNote"
              rows="3"
              placeholder="e.g. Built an order book matching engine in Modern C++ using ring buffers with sub-microsecond latency..."
              value={formData.coverLetterNote}
              onChange={handleChange}
              style={modalStyles.textarea}
            />
          </div>

          <div style={modalStyles.actionsRow}>
            <button type="button" onClick={onClose} style={modalStyles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" style={modalStyles.submitFormBtn} disabled={loading}>
              {loading ? "Transmitting..." : "Submit Fast-Track Application →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================================================
   STYLES
========================================================= */
const styles = {
  container: {
    padding: "24px",
    width: "100%",
    color: "#111827",
    fontFamily: "'Space Grotesk', system-ui, sans-serif",
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
  verifiedCount: {
    fontSize: "11px",
    fontWeight: "800",
    color: "#6b7280",
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
  tabSwitchBtn: {
    border: "2px solid #000000",
    borderRadius: "10px",
    padding: "10px 18px",
    fontWeight: "900",
    fontSize: "13px",
    cursor: "pointer",
    boxShadow: "3px 3px 0px #000000",
    transition: "all 0.15s ease",
  },
  filterSection: {
    backgroundColor: "#ffffff",
    border: "2.5px solid #000000",
    borderRadius: "16px",
    padding: "18px 20px",
    boxShadow: "5px 5px 0px #000000",
    marginBottom: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  searchBar: {
    padding: "12px 16px",
    border: "2px solid #000000",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    backgroundColor: "#fdfbf7",
    boxShadow: "2px 2px 0px #000000",
    outline: "none",
  },
  filterRow: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  dropdown: {
    padding: "10px 14px",
    border: "2px solid #000000",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "700",
    backgroundColor: "#ffffff",
    boxShadow: "2px 2px 0px #000000",
    cursor: "pointer",
  },
  sliderWrap: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  sliderLabel: {
    fontSize: "12px",
    fontWeight: "800",
  },
  slider: {
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
    gap: "22px",
  },
  card: {
    backgroundColor: "#ffffff",
    border: "2.5px solid #000000",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "5px 5px 0px #000000",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "320px",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "8px",
  },
  logoAndCompany: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoContainer: {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    border: "1.5px solid #000000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    padding: "4px",
    boxShadow: "1.5px 1.5px 0px #000000",
  },
  companyLogoImg: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
  },
  companyBadge: {
    fontSize: "13px",
    fontWeight: "900",
    color: "#000000",
  },
  companyType: {
    fontSize: "10px",
    fontWeight: "700",
    color: "#6b7280",
  },
  dateStampBadge: {
    backgroundColor: "#f1f5f9",
    border: "1px solid #000000",
    borderRadius: "6px",
    padding: "2px 8px",
    fontSize: "11px",
    color: "#1e293b",
  },
  matchBadge: {
    border: "1.5px solid #000000",
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: "900",
  },
  jobTitle: {
    margin: "8px 0 2px 0",
    fontSize: "17px",
    fontWeight: "900",
  },
  locText: {
    fontSize: "12px",
    color: "#4b5563",
    fontWeight: "600",
    marginBottom: "10px",
  },
  salaryTag: {
    fontSize: "13px",
    fontWeight: "900",
    color: "#000000",
    border: "1.5px solid #000000",
    borderRadius: "8px",
    padding: "6px 10px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "12px",
    boxShadow: "2px 2px 0px #000000",
    width: "100%",
    boxSizing: "border-box",
  },
  breakdownBadge: {
    fontSize: "10px",
    fontWeight: "800",
    backgroundColor: "#ffffff",
    border: "1px solid #000000",
    borderRadius: "4px",
    padding: "2px 6px",
    marginLeft: "8px",
  },
  skillRow: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
    marginBottom: "12px",
  },
  skillPill: {
    backgroundColor: "#f1f5f9",
    border: "1.5px solid #000000",
    padding: "3px 8px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "800",
    color: "#0f172a",
  },
  gapContainer: {
    backgroundColor: "#fafafa",
    border: "1.5px solid #000000",
    borderRadius: "10px",
    padding: "8px 10px",
    marginBottom: "16px",
  },
  gapHeaderToggle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
  },
  gapBoostPill: {
    backgroundColor: "#ffea28",
    border: "1px solid #000000",
    borderRadius: "4px",
    padding: "2px 6px",
    fontSize: "10px",
    fontWeight: "900",
  },
  gapContent: {
    marginTop: "8px",
    paddingTop: "8px",
    borderTop: "1px dashed #d1d5db",
  },
  missingSkillChip: {
    backgroundColor: "#fee2e2",
    border: "1px solid #ef4444",
    borderRadius: "6px",
    padding: "4px 8px",
    fontSize: "11px",
    fontWeight: "800",
    color: "#991b1b",
    marginBottom: "8px",
  },
  bridgeBtn: {
    width: "100%",
    backgroundColor: "#000000",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    padding: "6px",
    fontSize: "11px",
    fontWeight: "800",
    cursor: "pointer",
  },
  cardActions: {
    display: "flex",
    gap: "10px",
  },
  applyBtn: {
    flex: 1,
    padding: "10px",
    border: "2px solid #000000",
    borderRadius: "10px",
    fontWeight: "800",
    fontSize: "13px",
    boxShadow: "2px 2px 0px #000000",
  },
  saveBtn: {
    width: "42px",
    border: "2px solid #000000",
    borderRadius: "10px",
    fontWeight: "900",
    fontSize: "16px",
    cursor: "pointer",
    boxShadow: "2px 2px 0px #000000",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
    marginTop: "36px",
  },
  pageBtn: {
    backgroundColor: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "8px",
    padding: "9px 16px",
    fontWeight: "900",
    fontSize: "13px",
    cursor: "pointer",
    boxShadow: "3px 3px 0px #000000",
  },
  pageInfo: {
    fontSize: "13px",
    fontWeight: "700",
  },
  applicationsTrackerView: {
    backgroundColor: "#ffffff",
    border: "2.5px solid #000000",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "5px 5px 0px #000000",
  },
  trackerHeader: {
    marginBottom: "22px",
    borderBottom: "2px solid #000000",
    paddingBottom: "16px",
  },
  summaryStats: {
    display: "flex",
    gap: "14px",
  },
  summaryItem: {
    backgroundColor: "#fdfbf7",
    border: "1.5px solid #000000",
    borderRadius: "8px",
    padding: "6px 12px",
    fontSize: "12px",
    boxShadow: "2px 2px 0px #000000",
  },
  appPipelineCard: {
    border: "2px solid #000000",
    borderRadius: "14px",
    padding: "22px",
    boxShadow: "5px 5px 0px #000000",
    backgroundColor: "#ffffff",
  },
  appPipelineHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "22px",
    flexWrap: "wrap",
    gap: "12px",
  },
  demoAdvanceBtn: {
    backgroundColor: "#7c3aed",
    color: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "8px",
    padding: "6px 12px",
    fontSize: "11px",
    fontWeight: "900",
    boxShadow: "2px 2px 0px #000000",
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
  statusBadge: {
    border: "1.5px solid #000000",
    borderRadius: "6px",
    padding: "4px 10px",
    fontSize: "11px",
    fontWeight: "900",
    color: "#000000",
  },
  emptyState: {
    textAlign: "center",
    padding: "48px 20px",
  },
  applyBtnSmall: {
    backgroundColor: "#000000",
    color: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "8px",
    padding: "8px 16px",
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
    maxWidth: "650px",
    width: "100%",
    maxHeight: "90vh",
    overflowY: "auto",
    padding: "28px",
    fontFamily: "'Space Grotesk', system-ui, sans-serif",
  },
  salaryModalCard: {
    backgroundColor: "#ffffff",
    border: "3px solid #000000",
    borderRadius: "20px",
    boxShadow: "10px 10px 0px #000000",
    maxWidth: "480px",
    width: "100%",
    padding: "28px",
    fontFamily: "'Space Grotesk', system-ui, sans-serif",
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
    marginBottom: "20px",
  },
  salaryItem: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: "6px",
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
    fontSize: "22px",
    fontWeight: "900",
  },
  metaPay: {
    fontSize: "12px",
    fontWeight: "800",
    color: "#000000",
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
  sectionTitle: {
    fontSize: "13px",
    fontWeight: "900",
    color: "#000000",
    margin: "14px 0 8px 0",
    borderLeft: "4px solid #ff3d9a",
    paddingLeft: "8px",
  },
  formBody: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    textAlign: "left",
  },
  label: {
    fontSize: "11px",
    fontWeight: "800",
    color: "#374151",
  },
  input: {
    padding: "10px 12px",
    border: "2px solid #000000",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    backgroundColor: "#fdfbf7",
    boxShadow: "2px 2px 0px #000000",
    outline: "none",
  },
  select: {
    padding: "10px 12px",
    border: "2px solid #000000",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "700",
    backgroundColor: "#ffffff",
    boxShadow: "2px 2px 0px #000000",
    cursor: "pointer",
  },
  textarea: {
    padding: "10px 12px",
    border: "2px solid #000000",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    backgroundColor: "#fdfbf7",
    boxShadow: "2px 2px 0px #000000",
    outline: "none",
    resize: "vertical",
  },
  verificationContainer: {
    backgroundColor: "#faf5ff",
    border: "2px solid #000000",
    borderRadius: "12px",
    padding: "12px",
    boxShadow: "3px 3px 0px #000000",
    margin: "4px 0",
  },
  verifyHandleBtn: {
    backgroundColor: "#7c3aed",
    color: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "12px",
    fontWeight: "900",
    cursor: "pointer",
    boxShadow: "2px 2px 0px #000000",
    whiteSpace: "nowrap",
  },
  verifiedCard: {
    marginTop: "10px",
    backgroundColor: "#ffffff",
    border: "1.5px solid #7c3aed",
    borderRadius: "8px",
    padding: "10px 12px",
  },
  scoreAttachmentPill: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    border: "2px solid #000000",
    borderRadius: "10px",
    padding: "10px 14px",
    boxShadow: "3px 3px 0px #000000",
    margin: "6px 0",
  },
  verifiedShield: {
    backgroundColor: "#bbf7d0",
    border: "1.5px solid #000000",
    borderRadius: "6px",
    padding: "4px 8px",
    fontSize: "10px",
    fontWeight: "900",
  },
  actionsRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "16px",
    borderTop: "2px solid #e5e7eb",
    paddingTop: "14px",
  },
  cancelBtn: {
    backgroundColor: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "10px",
    padding: "10px 16px",
    fontWeight: "800",
    fontSize: "13px",
    cursor: "pointer",
    boxShadow: "2px 2px 0px #000000",
  },
  submitFormBtn: {
    backgroundColor: "#000000",
    color: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "10px",
    padding: "10px 20px",
    fontWeight: "900",
    fontSize: "13px",
    cursor: "pointer",
    boxShadow: "4px 4px 0px #ff3d9a",
    width: "100%",
  },
  errorBox: {
    backgroundColor: "#fee2e2",
    border: "2px solid #ef4444",
    boxShadow: "3px 3px 0px #ef4444",
    color: "#991b1b",
    padding: "8px 12px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "800",
    marginBottom: "10px",
  },
};