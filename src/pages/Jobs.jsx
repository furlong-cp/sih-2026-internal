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
  
  const [activeSalaryModal, setActiveSalaryModal] = useState(null);
  const [expandedGapJobId, setExpandedGapJobId] = useState(null);

  const [submittedApplications, setSubmittedApplications] = useState([
    {
      id: "APP-MOCK-1",
      fullName: "Alex Henderson",
      email: "alex@college.edu",
      job: ALL_JOBS[0],
      appliedDate: "August 28, 2026",
      appliedTime: "10:45 AM IST",
      currentStageIndex: 1,
      status: "OA Link Sent",
    }
  ]);
  const [activeApplyingJob, setActiveApplyingJob] = useState(null);

  const jobsPerPage = 15;

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

  const handleApplicationSubmit = (formData) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    const formattedTime = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

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

  return (
    <div style={cfStyles.pageContainer}>
      {/* Codeforces Style Top Navigation / Header Banner */}
      <div style={cfStyles.cfHeader}>
        <div style={cfStyles.cfHeaderLeft}>
          <span style={cfStyles.cfLogoText}>SkillBridge</span>
          <span style={cfStyles.cfSubLogo}>[Jobs Arena]</span>
        </div>
        <div style={cfStyles.cfNavTabs}>
          <button
            onClick={() => setActiveView("explore")}
            style={{
              ...cfStyles.cfNavBtn,
              backgroundColor: activeView === "explore" ? "#3b82f6" : "#e5e7eb",
              color: activeView === "explore" ? "#ffffff" : "#1f2937",
            }}
          >
            Problemset / Open Roles ({filteredJobs.length})
          </button>
          <button
            onClick={() => setActiveView("my-applications")}
            style={{
              ...cfStyles.cfNavBtn,
              backgroundColor: activeView === "my-applications" ? "#3b82f6" : "#e5e7eb",
              color: activeView === "my-applications" ? "#ffffff" : "#1f2937",
            }}
          >
            Submissions & Pipeline ({submittedApplications.length})
          </button>
        </div>
      </div>

      {activeView === "explore" ? (
        <div style={cfStyles.mainContent}>
          {/* CF Filter Panel */}
          <div style={cfStyles.filterTableContainer}>
            <div style={cfStyles.filterTableHeader}>Job Search & Filters</div>
            <div style={cfStyles.filterTableBody}>
              <input
                type="text"
                placeholder="Search by title, firm (Jane Street, Citadel), or technology (C++20, Kafka)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                style={cfStyles.cfSearchInput}
              />
              <div style={cfStyles.filterGridRow}>
                <select
                  value={selectedTrack}
                  onChange={(e) => {
                    setSelectedTrack(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={cfStyles.cfSelect}
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
                  style={cfStyles.cfSelect}
                >
                  <option value="All">All Companies ({COMPANY_NAMES.length})</option>
                  {COMPANY_NAMES.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>

                <div style={cfStyles.sliderGroup}>
                  <span style={cfStyles.sliderLabelText}>Min Match: <strong>{minMatch}%</strong></span>
                  <input
                    type="range"
                    min="70"
                    max="95"
                    value={minMatch}
                    onChange={(e) => {
                      setMinMatch(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    style={cfStyles.cfSlider}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Codeforces Style Problem/Job Table */}
          <div style={cfStyles.tableContainer}>
            <table style={cfStyles.cfTable}>
              <thead>
                <tr style={cfStyles.tableHeaderRow}>
                  <th style={{ ...cfStyles.thCell, width: "60px" }}>#ID</th>
                  <th style={{ ...cfStyles.thCell, width: "160px" }}>Firm</th>
                  <th style={cfStyles.thCell}>Position / Role & Tech Stack</th>
                  <th style={{ ...cfStyles.thCell, width: "180px" }}>Estimated Comp</th>
                  <th style={{ ...cfStyles.thCell, width: "100px", textAlign: "center" }}>Match</th>
                  <th style={{ ...cfStyles.thCell, width: "120px", textAlign: "center" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {displayedJobs.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={cfStyles.emptyCell}>
                      No positions match your criteria. Try adjusting filters.
                    </td>
                  </tr>
                ) : (
                  displayedJobs.map((job, idx) => {
                    const applied = isAlreadyApplied(job.id);
                    const isSaved = savedJobs.has(job.id);
                    const isGapOpen = expandedGapJobId === job.id;

                    return (
                      <React.Fragment key={job.id}>
                        <tr style={{ backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f9fafb" }}>
                          <td style={cfStyles.tdCell}>
                            <span style={cfStyles.idBadge}>{job.id.replace("SB-JOB-", "")}</span>
                          </td>
                          <td style={cfStyles.tdCell}>
                            <div style={{ fontWeight: "700", color: "#1d4ed8" }}>{job.company}</div>
                            <div style={{ fontSize: "10px", color: "#6b7280" }}>{job.companyType}</div>
                          </td>
                          <td style={cfStyles.tdCell}>
                            <div style={cfStyles.jobTitleRow}>
                              <span style={{ fontWeight: "bold", fontSize: "14px", color: "#111827" }}>{job.title}</span>
                              <button
                                onClick={() => toggleSave(job.id)}
                                style={cfStyles.bookmarkBtn}
                              >
                                {isSaved ? "★" : "☆"}
                              </button>
                            </div>
                            <div style={{ fontSize: "11px", color: "#4b5563", marginTop: "2px" }}>
                              📍 {job.location} · <span style={{ color: "#2563eb" }}>{job.posted}</span>
                            </div>
                            <div style={cfStyles.skillChipsRow}>
                              {job.matchedSkills.map((sk) => (
                                <span key={sk} style={cfStyles.skillChip}>✓ {sk}</span>
                              ))}
                              <button
                                onClick={() => setExpandedGapJobId(isGapOpen ? null : job.id)}
                                style={cfStyles.missingSkillToggle}
                              >
                                ⚡ Missing: {job.missingSkill} ({job.gapBoost})
                              </button>
                            </div>
                          </td>
                          <td style={cfStyles.tdCell}>
                            <div style={{ fontWeight: "800", color: "#16a34a", fontSize: "12px" }}>{job.salary}</div>
                            <button
                              onClick={() => setActiveSalaryModal(job)}
                              style={cfStyles.breakdownLinkBtn}
                            >
                              Breakdown ℹ️
                            </button>
                          </td>
                          <td style={{ ...cfStyles.tdCell, textAlign: "center" }}>
                            <span style={{
                              ...cfStyles.ratingBadge,
                              backgroundColor: job.match >= 90 ? "#dcfce7" : "#fef3c7",
                              color: job.match >= 90 ? "#166534" : "#92400e",
                            }}>
                              {job.match}%
                            </span>
                          </td>
                          <td style={{ ...cfStyles.tdCell, textAlign: "center" }}>
                            <button
                              onClick={() => !applied && setActiveApplyingJob(job)}
                              disabled={applied}
                              style={{
                                ...cfStyles.applyActionBtn,
                                backgroundColor: applied ? "#16a34a" : "#1d4ed8",
                                cursor: applied ? "default" : "pointer",
                              }}
                            >
                              {applied ? "Submitted ✓" : "Register →"}
                            </button>
                          </td>
                        </tr>

                        {isGapOpen && (
                          <tr style={{ backgroundColor: "#fffbeb" }}>
                            <td colSpan="6" style={{ padding: "10px 16px", fontSize: "12px", borderBottom: "1px solid #e5e7eb" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span>
                                  Mastering <strong>{job.missingSkill}</strong> gives you a <span style={{ color: "#16a34a", fontWeight: "bold" }}>{job.gapBoost}</span> shortlisting probability boost.
                                </span>
                                <button
                                  onClick={() => alert(`Launching Quick-Prep Module for ${job.missingSkill}`)}
                                  style={cfStyles.quickPrepInlineBtn}
                                >
                                  Launch Accelerator 🚀
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={cfStyles.paginationContainer}>
              <button
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((p) => p - 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                style={{ ...cfStyles.pageBtn, opacity: currentPage === 1 ? 0.4 : 1 }}
              >
                &larr; Prev
              </button>
              <span style={{ fontSize: "12px", fontWeight: "700" }}>
                Page {currentPage} of {totalPages} ({filteredJobs.length} total entries)
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage((p) => p + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                style={{ ...cfStyles.pageBtn, opacity: currentPage === totalPages ? 0.4 : 1 }}
              >
                Next &rarr;
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Submissions / My Applications View (CF Status Table Style) */
        <div style={cfStyles.mainContent}>
          <div style={cfStyles.filterTableContainer}>
            <div style={cfStyles.filterTableHeader}>My Submissions Status Tracker ({submittedApplications.length})</div>
          </div>

          <div style={cfStyles.tableContainer}>
            <table style={cfStyles.cfTable}>
              <thead>
                <tr style={cfStyles.tableHeaderRow}>
                  <th style={{ ...cfStyles.thCell, width: "80px" }}>#ID</th>
                  <th style={{ ...cfStyles.thCell, width: "160px" }}>When</th>
                  <th style={{ ...cfStyles.thCell }}>Who & Role</th>
                  <th style={{ ...cfStyles.thCell, width: "200px" }}>Verdict / Status</th>
                  <th style={{ ...cfStyles.thCell, width: "140px", textAlign: "center" }}>Simulate Next</th>
                </tr>
              </thead>
              <tbody>
                {submittedApplications.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={cfStyles.emptyCell}>No submissions recorded. Apply to positions to populate tracker.</td>
                  </tr>
                ) : (
                  submittedApplications.map((app, idx) => (
                    <tr key={app.id} style={{ backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f9fafb" }}>
                      <td style={cfStyles.tdCell}><span style={cfStyles.idBadge}>{app.id}</span></td>
                      <td style={cfStyles.tdCell}>
                        <div style={{ fontSize: "11px", fontWeight: "700" }}>{app.appliedDate}</div>
                        <div style={{ fontSize: "10px", color: "#6b7280" }}>{app.appliedTime}</div>
                      </td>
                      <td style={cfStyles.tdCell}>
                        <div style={{ fontWeight: "800", color: "#111827" }}>{app.job.title} at {app.job.company}</div>
                        <div style={{ fontSize: "11px", color: "#4b5563" }}>{app.fullName} ({app.email})</div>
                      </td>
                      <td style={cfStyles.tdCell}>
                        <span style={{
                          ...cfStyles.verdictBadge,
                          backgroundColor: app.currentStageIndex === 4 ? "#dcfce7" : "#eff6ff",
                          color: app.currentStageIndex === 4 ? "#166534" : "#1e40af",
                        }}>
                          {app.status}
                        </span>
                        <div style={{ fontSize: "10px", color: "#6b7280", marginTop: "3px" }}>
                          Stage {app.currentStageIndex + 1} of {STAGES_PIPELINE.length}: {STAGES_PIPELINE[app.currentStageIndex]}
                        </div>
                      </td>
                      <td style={{ ...cfStyles.tdCell, textAlign: "center" }}>
                        <button
                          onClick={() => advanceApplicationStage(app.id)}
                          disabled={app.currentStageIndex >= STAGES_PIPELINE.length - 1}
                          style={{
                            ...cfStyles.advanceBtn,
                            opacity: app.currentStageIndex >= STAGES_PIPELINE.length - 1 ? 0.4 : 1,
                          }}
                        >
                          Advance ⏩
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Salary Breakdown Modal */}
      {activeSalaryModal && (
        <div style={cfStyles.modalOverlay} onClick={() => setActiveSalaryModal(null)}>
          <div style={cfStyles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={cfStyles.modalHeader}>
              <div>
                <span style={{ fontSize: "10px", fontWeight: "800", color: "#2563eb" }}>VERIFIED COMPENSATION</span>
                <h3 style={{ margin: "2px 0 0 0", fontSize: "18px", fontWeight: "900" }}>{activeSalaryModal.company}</h3>
                <div style={{ fontSize: "12px", color: "#4b5563" }}>{activeSalaryModal.title}</div>
              </div>
              <button onClick={() => setActiveSalaryModal(null)} style={cfStyles.modalCloseBtn}>✕</button>
            </div>

            <div style={cfStyles.modalCompBox}>
              <div style={{ fontSize: "11px", fontWeight: "800", color: "#4b5563" }}>ESTIMATED TOTAL PACKAGE</div>
              <div style={{ fontSize: "22px", fontWeight: "900", color: "#16a34a", marginTop: "2px" }}>
                {activeSalaryModal.salary}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px", marginBottom: "20px" }}>
              <div style={cfStyles.modalRow}><span>Base / Stipend:</span><strong>{activeSalaryModal.breakdown.base}</strong></div>
              <div style={cfStyles.modalRow}><span>Sign-on / Relo:</span><strong>{activeSalaryModal.breakdown.signon}</strong></div>
              <div style={cfStyles.modalRow}><span>Bonus / PnL Pool:</span><strong>{activeSalaryModal.breakdown.bonus}</strong></div>
            </div>

            <button onClick={() => setActiveSalaryModal(null)} style={cfStyles.modalCloseActionBtn}>Close</button>
          </div>
        </div>
      )}

      {/* Application Express Modal */}
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

function ApplicationModal({ job, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    fullName: "Alex Henderson",
    email: "alex@college.edu",
    phone: "+91 98765 43210",
    degree: "Mathematics & Computing",
    graduationYear: "2027",
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
    }, 500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim()) {
      setError("Please complete your Full Name and Email Address.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSubmit({ ...formData, verifiedCredentials: verifiedCfData });
    }, 400);
  };

  return (
    <div style={cfStyles.modalOverlay} onClick={onClose}>
      <div style={cfStyles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div style={cfStyles.modalHeader}>
          <div>
            <span style={{ fontSize: "10px", fontWeight: "800", color: "#2563eb" }}>EXPRESS REGISTRATION</span>
            <h3 style={{ margin: "2px 0 0 0", fontSize: "18px", fontWeight: "900" }}>{job.title}</h3>
            <div style={{ fontSize: "12px", color: "#4b5563" }}>{job.company} · {job.location}</div>
          </div>
          <button onClick={onClose} style={cfStyles.modalCloseBtn}>✕</button>
        </div>

        {error && <div style={cfStyles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div>
              <label style={cfStyles.formLabel}>Full Name *</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required style={cfStyles.formInput} />
            </div>
            <div>
              <label style={cfStyles.formLabel}>Email Address *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required style={cfStyles.formInput} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div>
              <label style={cfStyles.formLabel}>Degree Program</label>
              <input type="text" name="degree" value={formData.degree} onChange={handleChange} style={cfStyles.formInput} />
            </div>
            <div>
              <label style={cfStyles.formLabel}>Graduation Year</label>
              <input type="text" name="graduationYear" value={formData.graduationYear} onChange={handleChange} style={cfStyles.formInput} />
            </div>
          </div>

          <div>
            <label style={cfStyles.formLabel}>Codeforces Handle (Instant API Verification)</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                name="codeforcesHandle"
                value={formData.codeforcesHandle}
                onChange={handleChange}
                placeholder="e.g. tourist"
                style={{ ...cfStyles.formInput, flex: 1 }}
              />
              <button type="button" onClick={verifyCompetitiveProfile} disabled={isVerifyingCf} style={cfStyles.verifyHandleBtn}>
                {isVerifyingCf ? "Verifying..." : "Verify CF ⚡"}
              </button>
            </div>
            {verifiedCfData && (
              <div style={cfStyles.verifiedBox}>
                ✅ Verified: <strong>{verifiedCfData.handle}</strong> | Rank: <strong>{verifiedCfData.rank}</strong> | Rating: <span style={{ color: "#2563eb" }}>{verifiedCfData.rating}</span>
              </div>
            )}
          </div>

          <div>
            <label style={cfStyles.formLabel}>GitHub / Portfolio URL</label>
            <input type="url" name="githubUrl" value={formData.githubUrl} onChange={handleChange} style={cfStyles.formInput} />
          </div>

          <div>
            <label style={cfStyles.formLabel}>Cover Note / Low-Latency Experience (Optional)</label>
            <textarea
              name="coverLetterNote"
              value={formData.coverLetterNote}
              onChange={handleChange}
              rows={2}
              placeholder="Highlight C++ concurrency or competitive programming achievements..."
              style={{ ...cfStyles.formInput, resize: "vertical" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "10px" }}>
            <button type="button" onClick={onClose} style={cfStyles.cancelBtn}>Cancel</button>
            <button type="submit" disabled={loading} style={cfStyles.submitBtn}>
              {loading ? "Transmitting..." : "Submit Application 🚀"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* Codeforces Table & UI Styling Theme */
const cfStyles = {
  pageContainer: {
    backgroundColor: "#f3f4f6",
    minHeight: "100vh",
    padding: "20px",
    fontFamily: "system-ui, -apple-system, sans-serif",
    color: "#1f2937",
  },
  cfHeader: {
    backgroundColor: "#ffffff",
    borderBottom: "3px solid #1d4ed8",
    padding: "16px 24px",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  cfHeaderLeft: {
    display: "flex",
    alignItems: "baseline",
    gap: "12px",
  },
  cfLogoText: {
    fontSize: "22px",
    fontWeight: "900",
    color: "#1d4ed8",
    letterSpacing: "-0.5px",
  },
  cfSubLogo: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#6b7280",
  },
  cfNavTabs: {
    display: "flex",
    gap: "8px",
  },
  cfNavBtn: {
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "700",
    border: "1px solid #d1d5db",
    cursor: "pointer",
  },
  mainContent: {
    maxWidth: "1280px",
    margin: "0 auto",
  },
  filterTableContainer: {
    backgroundColor: "#ffffff",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    overflow: "hidden",
    marginBottom: "16px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  },
  filterTableHeader: {
    backgroundColor: "#1f2937",
    color: "#ffffff",
    padding: "10px 16px",
    fontSize: "12px",
    fontWeight: "800",
  },
  filterTableBody: {
    padding: "14px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  cfSearchInput: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "13px",
    outline: "none",
  },
  filterGridRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "12px",
    alignItems: "center",
  },
  cfSelect: {
    padding: "9px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "12px",
    backgroundColor: "#ffffff",
    fontWeight: "600",
  },
  sliderGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    backgroundColor: "#f9fafb",
    padding: "6px 10px",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
  },
  sliderLabelText: {
    fontSize: "11px",
    color: "#4b5563",
  },
  cfSlider: {
    width: "100%",
    accentColor: "#1d4ed8",
    cursor: "pointer",
  },
  tableContainer: {
    backgroundColor: "#ffffff",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  cfTable: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    fontSize: "13px",
  },
  tableHeaderRow: {
    backgroundColor: "#e5e7eb",
    color: "#1f2937",
    borderBottom: "2px solid #d1d5db",
  },
  thCell: {
    padding: "10px 14px",
    fontSize: "12px",
    fontWeight: "800",
  },
  tdCell: {
    padding: "10px 14px",
    borderBottom: "1px solid #e5e7eb",
    verticalAlign: "middle",
  },
  emptyCell: {
    textAlign: "center",
    padding: "40px",
    color: "#6b7280",
    fontSize: "13px",
  },
  idBadge: {
    backgroundColor: "#eff6ff",
    color: "#1d4ed8",
    padding: "2px 6px",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: "800",
    fontFamily: "monospace",
  },
  jobTitleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bookmarkBtn: {
    background: "none",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    color: "#eab308",
  },
  skillChipsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginTop: "6px",
  },
  skillChip: {
    fontSize: "10px",
    backgroundColor: "#f3f4f6",
    color: "#374151",
    padding: "2px 6px",
    borderRadius: "4px",
    fontWeight: "700",
  },
  missingSkillToggle: {
    fontSize: "10px",
    backgroundColor: "#fef3c7",
    color: "#92400e",
    border: "1px solid #fde68a",
    borderRadius: "4px",
    padding: "2px 6px",
    fontWeight: "700",
    cursor: "pointer",
  },
  quickPrepInlineBtn: {
    fontSize: "11px",
    backgroundColor: "#d97706",
    color: "#ffffff",
    border: "none",
    borderRadius: "4px",
    padding: "4px 10px",
    fontWeight: "700",
    cursor: "pointer",
  },
  breakdownLinkBtn: {
    background: "none",
    border: "none",
    color: "#2563eb",
    fontSize: "11px",
    fontWeight: "700",
    cursor: "pointer",
    padding: 0,
    marginTop: "2px",
    textDecoration: "underline",
  },
  ratingBadge: {
    padding: "3px 8px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: "800",
    display: "inline-block",
  },
  applyActionBtn: {
    padding: "6px 12px",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "800",
  },
  paginationContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "16px",
    padding: "0 4px",
  },
  pageBtn: {
    padding: "6px 14px",
    backgroundColor: "#ffffff",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },
  verdictBadge: {
    padding: "3px 8px",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: "800",
    display: "inline-block",
  },
  advanceBtn: {
    padding: "4px 10px",
    backgroundColor: "#1f2937",
    color: "#ffffff",
    border: "none",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: "700",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(2px)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  modalCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    width: "100%",
    maxWidth: "500px",
    padding: "24px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "16px",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: "12px",
  },
  modalCloseBtn: {
    background: "none",
    border: "none",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    color: "#6b7280",
  },
  modalCompBox: {
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    padding: "12px",
    textAlign: "center",
    marginBottom: "16px",
  },
  modalRow: {
    display: "flex",
    justifyContent: "space-between",
    paddingBottom: "6px",
    borderBottom: "1px solid #f3f4f6",
  },
  modalCloseActionBtn: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#1f2937",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "800",
    cursor: "pointer",
  },
  formLabel: {
    display: "block",
    fontSize: "11px",
    fontWeight: "700",
    color: "#374151",
    marginBottom: "4px",
  },
  formInput: {
    width: "100%",
    padding: "9px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "12px",
    outline: "none",
    backgroundColor: "#f9fafb",
  },
  verifyHandleBtn: {
    padding: "0 12px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "700",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  verifiedBox: {
    marginTop: "6px",
    padding: "8px",
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "6px",
    fontSize: "11px",
    color: "#166534",
  },
  cancelBtn: {
    padding: "9px 16px",
    backgroundColor: "#f3f4f6",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
    color: "#374151",
  },
  submitBtn: {
    padding: "9px 16px",
    backgroundColor: "#1d4ed8",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "800",
    cursor: "pointer",
  },
  errorBox: {
    backgroundColor: "#fee2e2",
    border: "1px solid #fecaca",
    color: "#dc2626",
    padding: "8px 12px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "700",
    marginBottom: "12px",
  },
};