import React, { useState, useMemo } from "react";

const INITIAL_PROJECTS = [
  {
    id: "PRJ-HFT-01",
    title: "Ultra Low-Latency L3 Order Book & Matching Engine",
    category: "Low-Latency & HFT",
    difficulty: "Hard (HFT Core)",
    status: "Verified On-Chain",
    stars: 342,
    forks: 88,
    repoUrl: "https://github.com/torvalds/orderbook-cpp20",
    techStack: ["C++20", "Lock-Free Ring Buffers", "DPDK", "SIMD AVX-512", "CMake"],
    benchmark: "820ns p99 Tick-to-Trade Latency",
    throughput: "4.8M Orders / sec",
    description:
      "A deterministic, memory-aligned limit order book matching engine engineered in modern C++20. Implements lock-free SPSC queues, cache-line padding to eliminate false sharing, and zero-allocation critical paths.",
    architectureDetails: [
      "Zero dynamic heap allocations in execution hot loops using pre-allocated static memory arenas.",
      "Custom kernel-bypass userspace network ingress utilizing DPDK ring buffers.",
      "Price-time priority matching with continuous bid-ask spread cross resolution in O(1) amortized.",
      "Nanosecond-level telemetry with hardware TSC instruction stamping."
    ],
    badges: ["Top 0.5% Systems Repo", "Jane Street & Citadel Validated"]
  },
  {
    id: "PRJ-QUANT-02",
    title: "Stochastic Volatility & Local Heston PDE Surface Pricer",
    category: "Quantitative Finance",
    difficulty: "Hard (Quant Research)",
    status: "Verified On-Chain",
    stars: 215,
    forks: 46,
    repoUrl: "https://github.com/torvalds/heston-pde-pricer",
    techStack: ["Python", "CUDA C++", "NumPy / SciPy", "PyTorch", "OpenMP"],
    benchmark: "45x GPU Acceleration over CPU",
    throughput: "100K Paths / 12ms",
    description:
      "High-performance option pricing framework simulating continuous-time stochastic volatility under the Heston model using finite-difference Crank-Nicolson PDE discretization and CUDA-parallelized Monte Carlo simulations.",
    architectureDetails: [
      "Vectorized CUDA kernel execution for multi-asset geometric Brownian jump-diffusion paths.",
      "Automated implied volatility surface calibration using non-linear least-squares Levenberg-Marquardt.",
      "Analytical Fourier inversion via Carr-Madan formulas for rapid European call benchmarking.",
      "Real-time Greeks derivation with algorithmic automatic differentiation."
    ],
    badges: ["Quant Research Standard", "Tower & Optiver Endorsed"]
  },
  {
    id: "PRJ-SYS-03",
    title: "Distributed Raft Consensus Key-Value Store",
    category: "Distributed Systems",
    difficulty: "Hard (Systems Core)",
    status: "Verified On-Chain",
    stars: 480,
    forks: 124,
    repoUrl: "https://github.com/torvalds/spanner-raft-kv",
    techStack: ["Go", "gRPC", "Protobuf", "RocksDB", "Docker"],
    benchmark: "Linearizable Reads in < 2.4ms",
    throughput: "65K QPS per Cluster",
    description:
      "A fault-tolerant, linearizable distributed key-value storage engine implementing the complete Raft consensus protocol, including leader election, log replication, snapshotting, and dynamic membership transitions.",
    architectureDetails: [
      "Strict leader completeness and log matching property enforcement tolerating up to (N-1)/2 node crashes.",
      "Async pipeline log flushing with embedded LSM-tree storage backend (RocksDB).",
      "Lease-based leader read optimizations bypassing consensus roundtrips without stale read anomalies.",
      "Full Jepsen testing verification verifying zero data loss under simulated network partitions."
    ],
    badges: ["Google & Meta Level Architecture", "Linearizability Tested"]
  },
  {
    id: "PRJ-ALGO-04",
    title: "High-QPS Suffix Automaton & Geometric Segment Tree Engine",
    category: "Algorithms & CP",
    difficulty: "Medium-Hard",
    status: "Verified Live",
    stars: 184,
    forks: 32,
    repoUrl: "https://github.com/torvalds/advanced-dsa-cpp",
    techStack: ["C++17", "Segment Trees", "Suffix Automaton", "Treap", "HLD"],
    benchmark: "O(log N) Query Complexity",
    throughput: "Sub-millisecond Batch Solves",
    description:
      "A battle-tested competitive programming and high-throughput string/geometry indexer. Contains production implementations of Suffix Automata, 2D Dynamic Segment Trees, and Heavy-Light Tree Decompositions.",
    architectureDetails: [
      "Online linear time O(N) Suffix Automaton construction for substring search and distinct pattern counting.",
      "Lazy propagation 2D Range Update Segment Tree supporting range sums and min/max queries.",
      "Persistent Treap allowing historical version rollbacks and split/merge operations in logarithmic time."
    ],
    badges: ["Candidate Master Standard", "Codeforces Verified"]
  }
];

const RECOMMENDED_ROADMAPS = [
  {
    track: "Quant Dev / Low-Latency HFT",
    title: "NASDAQ ITCH 5.0 Binary Feed Handler",
    desc: "Zero-copy byte parser mapping L3 market data with DPDK userspace buffers in sub-120ns.",
    tech: ["C++20", "DPDK", "Binary Protocol", "POSIX SHM"],
    boost: "+14% Quant Match",
    targetFirms: "Jane Street, Citadel Securities, HRT"
  },
  {
    track: "Quant Research & Pricing",
    title: "CUDA Monte Carlo Jump-Diffusion Surface Engine",
    desc: "GPU-accelerated pricing engine for stochastic volatility derivatives with Carr-Madan Fourier inversion.",
    tech: ["CUDA C++", "Python", "PyTorch", "PDE Solvers"],
    boost: "+16% Quant Match",
    targetFirms: "Optiver, Two Sigma, Jump Trading"
  },
  {
    track: "Distributed Systems & Infra",
    title: "LSM-Tree Key-Value Storage Engine",
    desc: "High-throughput storage engine implementing Write-Ahead Logging (WAL) and Bloom filter SSTables.",
    tech: ["Modern C++", "Go", "SkipList", "Linux io_uring"],
    boost: "+12% Systems Match",
    targetFirms: "Google, Databricks, Meta"
  }
];

export default function ProjectsPage({ onNavigate }) {
  const [projectsList, setProjectsList] = useState(INITIAL_PROJECTS);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalProject, setActiveModalProject] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Project Form State
  const [newProject, setNewProject] = useState({
    title: "",
    category: "Low-Latency & HFT",
    repoUrl: "",
    techStack: "",
    benchmark: "",
    description: ""
  });

  const categories = ["All", "Low-Latency & HFT", "Quantitative Finance", "Distributed Systems", "Algorithms & CP"];

  const filteredProjects = useMemo(() => {
    return projectsList.filter((prj) => {
      const matchesCategory = activeCategory === "All" || prj.category === activeCategory;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        prj.title.toLowerCase().includes(query) ||
        prj.category.toLowerCase().includes(query) ||
        prj.techStack.some((t) => t.toLowerCase().includes(query)) ||
        prj.description.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [projectsList, activeCategory, searchQuery]);

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProject.title.trim() || !newProject.repoUrl.trim()) return;

    const created = {
      id: `PRJ-CUSTOM-${Date.now().toString().slice(-4)}`,
      title: newProject.title,
      category: newProject.category,
      difficulty: "Verified Candidate Project",
      status: "Verified On-Chain",
      stars: 1,
      forks: 0,
      repoUrl: newProject.repoUrl,
      techStack: newProject.techStack.split(",").map((s) => s.trim()).filter(Boolean),
      benchmark: newProject.benchmark || "Benchmarking in Progress",
      throughput: "Production Verified",
      description: newProject.description || "Production-grade project repository verified and linked to ATS resume.",
      architectureDetails: [
        "Repository validated against SkillBridge code authenticity guidelines.",
        "Deterministic benchmark telemetry attached to candidate profile."
      ],
      badges: ["Candidate Showcase", "Verified Proof-of-Work"]
    };

    setProjectsList([created, ...projectsList]);
    setIsAddModalOpen(false);
    setNewProject({
      title: "",
      category: "Low-Latency & HFT",
      repoUrl: "",
      techStack: "",
      benchmark: "",
      description: ""
    });
  };

  return (
    <div style={styles.container}>
      {/* Top Header Banner */}
      <div style={styles.headerBanner}>
        <div>
          <div style={styles.topBadgeRow}>
            <span style={styles.liveTag}>● PROOF-OF-WORK CODE HUB</span>
            <span style={styles.verifiedCount}>{projectsList.length} Verified Repositories</span>
          </div>
          <h1 style={styles.headerTitle}>PROJECTS &amp; ARCHITECTURE SHOWCASE</h1>
          <p style={styles.headerSub}>
            Inspect real, benchmarked low-latency C++ engines, quantitative PDE pricers, and distributed consensus nodes attached to your ATS profile.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            onClick={() => setIsAddModalOpen(true)}
            style={styles.addProjectBtn}
          >
            + Add New Project ⚡
          </button>
        </div>
      </div>

      {/* AI-Recommended Target Role Project Roadmaps Widget */}
      <div style={styles.recommendationsContainer}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
          <div>
            <span style={{ fontSize: "11px", fontWeight: "900", color: "#7c3aed", letterSpacing: "1px" }}>
              🎯 AI PORTFOLIO ROADMAP (MATCHED TO YOUR TARGET QUANT &amp; SWE ROLES)
            </span>
            <h3 style={{ margin: "2px 0 0 0", fontSize: "18px", fontWeight: "900" }}>
              High-Impact Engineering Projects Recommended for Top 0.5% Quant / Prop Desks
            </h3>
          </div>
          <span style={styles.targetQuantPill}>Target Match: 96%</span>
        </div>

        <div style={styles.recGrid}>
          {RECOMMENDED_ROADMAPS.map((rec, rIdx) => (
            <div key={rIdx} style={styles.recCard}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={styles.recTag}>{rec.track}</span>
                <span style={styles.recBoostBadge}>{rec.boost}</span>
              </div>
              <h4 style={styles.recTitle}>{rec.title}</h4>
              <p style={styles.recDesc}>{rec.desc}</p>

              <div style={styles.recTechRow}>
                {rec.tech.map((t, tIdx) => (
                  <span key={tIdx} style={styles.recTechPill}>
                    {t}
                  </span>
                ))}
              </div>

              <div style={styles.recFooter}>
                <span style={{ fontSize: "11px", color: "#4b5563" }}>
                  Target: <strong>{rec.targetFirms}</strong>
                </span>
                <button
                  onClick={() => {
                    setNewProject({
                      title: rec.title,
                      category: rec.track.includes("Quant Dev") ? "Low-Latency & HFT" : rec.track.includes("Research") ? "Quantitative Finance" : "Distributed Systems",
                      repoUrl: "https://github.com/torvalds/",
                      techStack: rec.tech.join(", "),
                      benchmark: "In Progress",
                      description: rec.desc
                    });
                    setIsAddModalOpen(true);
                  }}
                  style={styles.recActionBtn}
                >
                  Start Build →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Control Section */}
      <div style={styles.filterSection}>
        <input
          type="text"
          placeholder="🔍 Search projects by title, stack (C++, DPDK, Raft, CUDA), or concept..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchBar}
        />

        <div style={styles.filterRow}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                ...styles.filterTabBtn,
                backgroundColor: activeCategory === cat ? "#000000" : "#ffffff",
                color: activeCategory === cat ? "#ffffff" : "#000000",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div style={styles.grid}>
        {filteredProjects.map((prj) => (
          <div key={prj.id} style={styles.projectCard}>
            <div>
              {/* Card Top */}
              <div style={styles.cardTop}>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span style={styles.categoryBadge}>{prj.category}</span>
                  <span style={styles.verifiedPill}>✓ {prj.status}</span>
                </div>

                <div style={styles.ghStats}>
                  <span>⭐ {prj.stars}</span>
                  <span>🍴 {prj.forks}</span>
                </div>
              </div>

              {/* Title */}
              <h3 style={styles.projectTitle}>{prj.title}</h3>

              {/* Performance Metrics Box */}
              <div style={styles.metricsBox}>
                <div style={styles.metricItem}>
                  <span style={styles.metricLabel}>BENCHMARK SLA</span>
                  <strong style={styles.metricVal}>{prj.benchmark}</strong>
                </div>
                <div style={styles.metricItem}>
                  <span style={styles.metricLabel}>THROUGHPUT</span>
                  <strong style={{ ...styles.metricVal, color: "#16a34a" }}>{prj.throughput}</strong>
                </div>
              </div>

              {/* Description */}
              <p style={styles.projectDesc}>{prj.description}</p>

              {/* Tech Stack Pills */}
              <div style={styles.techStackRow}>
                {prj.techStack.map((tech, tIdx) => (
                  <span key={tIdx} style={styles.techPill}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={styles.cardActions}>
              <button
                onClick={() => setActiveModalProject(prj)}
                style={styles.inspectBtn}
              >
                Inspect Architecture 🔍
              </button>

              <a
                href={prj.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.githubLinkBtn}
              >
                GitHub Repo ↗
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* DETAILED ARCHITECTURE & RECRUITER AUDIT MODAL */}
      {activeModalProject && (
        <div style={modalStyles.overlay} onClick={() => setActiveModalProject(null)}>
          <div style={modalStyles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={modalStyles.header}>
              <div>
                <div style={modalStyles.categoryHeader}>{activeModalProject.category} · Technical Audit</div>
                <h2 style={modalStyles.roleHeading}>{activeModalProject.title}</h2>
                <div style={{ fontSize: "12px", color: "#4b5563" }}>
                  Tracking ID: <strong>{activeModalProject.id}</strong> · {activeModalProject.difficulty}
                </div>
              </div>
              <button onClick={() => setActiveModalProject(null)} style={modalStyles.closeBtn}>
                ✕
              </button>
            </div>

            {/* Performance Banner */}
            <div style={modalStyles.perfGrid}>
              <div style={modalStyles.perfBox}>
                <span style={{ fontSize: "11px", fontWeight: "800", color: "#6b7280" }}>LATENCY SLA</span>
                <div style={{ fontSize: "18px", fontWeight: "900", color: "#16a34a" }}>
                  {activeModalProject.benchmark}
                </div>
              </div>
              <div style={modalStyles.perfBox}>
                <span style={{ fontSize: "11px", fontWeight: "800", color: "#6b7280" }}>THROUGHPUT</span>
                <div style={{ fontSize: "18px", fontWeight: "900", color: "#7c3aed" }}>
                  {activeModalProject.throughput}
                </div>
              </div>
              <div style={modalStyles.perfBox}>
                <span style={{ fontSize: "11px", fontWeight: "800", color: "#6b7280" }}>GITHUB PROOF</span>
                <div style={{ fontSize: "16px", fontWeight: "900" }}>
                  ⭐ {activeModalProject.stars} · 🍴 {activeModalProject.forks}
                </div>
              </div>
            </div>

            {/* Deep Technical Architecture Breakdown */}
            <div style={{ margin: "16px 0", textAlign: "left" }}>
              <div style={modalStyles.sectionTitle}>Key Engineering &amp; Architecture Highlights</div>
              <div style={modalStyles.archList}>
                {activeModalProject.architectureDetails.map((item, idx) => (
                  <div key={idx} style={modalStyles.archItem}>
                    <span style={{ color: "#16a34a", fontWeight: "900", marginRight: "8px" }}>✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div style={{ margin: "14px 0", textAlign: "left" }}>
              <div style={modalStyles.sectionTitle}>Production Technologies Used</div>
              <div style={styles.techStackRow}>
                {activeModalProject.techStack.map((tech, tIdx) => (
                  <span key={tIdx} style={styles.techPill}>
                    ⚡ {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div style={modalStyles.actionRow}>
              <a
                href={activeModalProject.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={modalStyles.primaryRepoBtn}
              >
                Open Source Code on GitHub ↗
              </a>
              <button
                onClick={() => {
                  alert("Project credentials and benchmark telemetry attached to your live ATS application pipeline!");
                  setActiveModalProject(null);
                }}
                style={modalStyles.attachBtn}
              >
                Attach Proof to ATS Applications 🛡️
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW PROJECT MODAL */}
      {isAddModalOpen && (
        <div style={modalStyles.overlay} onClick={() => setIsAddModalOpen(false)}>
          <div style={modalStyles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={modalStyles.header}>
              <div>
                <div style={modalStyles.categoryHeader}>SkillBridge Showcase</div>
                <h2 style={modalStyles.roleHeading}>Add &amp; Verify GitHub Repository</h2>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} style={modalStyles.closeBtn}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} style={modalStyles.formBody}>
              <div style={modalStyles.inputGroup}>
                <label style={modalStyles.label}>Project Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Distributed Consensus Engine in Modern C++"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  style={modalStyles.input}
                  required
                />
              </div>

              <div style={modalStyles.grid2}>
                <div style={modalStyles.inputGroup}>
                  <label style={modalStyles.label}>Domain Track</label>
                  <select
                    value={newProject.category}
                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                    style={modalStyles.select}
                  >
                    <option value="Low-Latency & HFT">Low-Latency & HFT</option>
                    <option value="Quantitative Finance">Quantitative Finance</option>
                    <option value="Distributed Systems">Distributed Systems</option>
                    <option value="Algorithms & CP">Algorithms & CP</option>
                  </select>
                </div>

                <div style={modalStyles.inputGroup}>
                  <label style={modalStyles.label}>Benchmark SLA</label>
                  <input
                    type="text"
                    placeholder="e.g. < 950ns p99 Tick-to-Trade"
                    value={newProject.benchmark}
                    onChange={(e) => setNewProject({ ...newProject, benchmark: e.target.value })}
                    style={modalStyles.input}
                  />
                </div>
              </div>

              <div style={modalStyles.inputGroup}>
                <label style={modalStyles.label}>GitHub Repository URL *</label>
                <input
                  type="url"
                  placeholder="https://github.com/username/project"
                  value={newProject.repoUrl}
                  onChange={(e) => setNewProject({ ...newProject, repoUrl: e.target.value })}
                  style={modalStyles.input}
                  required
                />
              </div>

              <div style={modalStyles.inputGroup}>
                <label style={modalStyles.label}>Tech Stack (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="e.g. C++20, DPDK, SIMD, Lock-Free"
                  value={newProject.techStack}
                  onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value })}
                  style={modalStyles.input}
                />
              </div>

              <div style={modalStyles.inputGroup}>
                <label style={modalStyles.label}>Architecture &amp; Engineering Summary</label>
                <textarea
                  rows="3"
                  placeholder="Summarize the core algorithms, cache alignment, and concurrency model..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  style={modalStyles.textarea}
                />
              </div>

              <div style={modalStyles.actionRow}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={modalStyles.cancelBtn}
                >
                  Cancel
                </button>
                <button type="submit" style={modalStyles.submitBtn}>
                  Verify &amp; Attach Project 🚀
                </button>
              </div>
            </form>
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
    color: "#7c3aed",
    letterSpacing: "0.5px",
  },
  verifiedCount: {
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
  addProjectBtn: {
    backgroundColor: "#000000",
    color: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "10px",
    padding: "12px 18px",
    fontSize: "13px",
    fontWeight: "900",
    cursor: "pointer",
    boxShadow: "3px 3px 0px #ff3d9a",
  },
  recommendationsContainer: {
    backgroundColor: "#ffffff",
    border: "2.5px solid #000000",
    borderRadius: "16px",
    padding: "20px 22px",
    boxShadow: "5px 5px 0px #000000",
    marginBottom: "22px",
  },
  targetQuantPill: {
    backgroundColor: "#fef08a",
    border: "1px solid #000000",
    borderRadius: "6px",
    padding: "3px 8px",
    fontSize: "11px",
    fontWeight: "900",
  },
  recGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "14px",
  },
  recCard: {
    backgroundColor: "#fdfbf7",
    border: "2px solid #000000",
    borderRadius: "12px",
    padding: "16px",
    boxShadow: "3px 3px 0px #000000",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  recTag: {
    fontSize: "10px",
    fontWeight: "900",
    textTransform: "uppercase",
    color: "#6b7280",
  },
  recBoostBadge: {
    backgroundColor: "#bbf7d0",
    border: "1px solid #000000",
    borderRadius: "4px",
    padding: "1px 6px",
    fontSize: "10px",
    fontWeight: "900",
    color: "#166534",
  },
  recTitle: {
    margin: "4px 0 6px 0",
    fontSize: "15px",
    fontWeight: "900",
  },
  recDesc: {
    margin: "0 0 10px 0",
    fontSize: "12px",
    color: "#4b5563",
    lineHeight: "1.4",
  },
  recTechRow: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
    marginBottom: "12px",
  },
  recTechPill: {
    backgroundColor: "#ffffff",
    border: "1px solid #000000",
    borderRadius: "4px",
    padding: "2px 6px",
    fontSize: "10px",
    fontWeight: "800",
  },
  recFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px dashed #cbd5e1",
    paddingTop: "10px",
  },
  recActionBtn: {
    backgroundColor: "#000000",
    color: "#ffffff",
    border: "1.5px solid #000000",
    borderRadius: "6px",
    padding: "6px 10px",
    fontSize: "11px",
    fontWeight: "900",
    cursor: "pointer",
    boxShadow: "2px 2px 0px #ff3d9a",
  },
  filterSection: {
    backgroundColor: "#ffffff",
    border: "2.5px solid #000000",
    borderRadius: "16px",
    padding: "16px 20px",
    boxShadow: "5px 5px 0px #000000",
    marginBottom: "22px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  searchBar: {
    padding: "12px 16px",
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
    gap: "10px",
    flexWrap: "wrap",
  },
  filterTabBtn: {
    border: "2px solid #000000",
    borderRadius: "8px",
    padding: "8px 16px",
    fontSize: "12px",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow: "2px 2px 0px #000000",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
    gap: "22px",
  },
  projectCard: {
    backgroundColor: "#ffffff",
    border: "2.5px solid #000000",
    borderRadius: "16px",
    padding: "22px",
    boxShadow: "5px 5px 0px #000000",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "340px",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  categoryBadge: {
    fontSize: "11px",
    fontWeight: "900",
    textTransform: "uppercase",
    color: "#6b7280",
  },
  verifiedPill: {
    backgroundColor: "#bbf7d0",
    border: "1px solid #000000",
    borderRadius: "6px",
    padding: "2px 6px",
    fontSize: "10px",
    fontWeight: "900",
    color: "#166534",
  },
  ghStats: {
    display: "flex",
    gap: "8px",
    fontSize: "11px",
    fontWeight: "800",
    backgroundColor: "#fdfbf7",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    padding: "2px 6px",
  },
  projectTitle: {
    margin: "0 0 10px 0",
    fontSize: "18px",
    fontWeight: "900",
    lineHeight: "1.3",
  },
  metricsBox: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
    backgroundColor: "#fdfbf7",
    border: "1.5px solid #000000",
    borderRadius: "10px",
    padding: "10px",
    marginBottom: "12px",
  },
  metricItem: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  metricLabel: {
    fontSize: "9px",
    fontWeight: "900",
    color: "#6b7280",
    letterSpacing: "0.5px",
  },
  metricVal: {
    fontSize: "12px",
    fontWeight: "900",
    color: "#000000",
  },
  projectDesc: {
    fontSize: "12px",
    color: "#4b5563",
    lineHeight: "1.5",
    margin: "0 0 14px 0",
  },
  techStackRow: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
    marginBottom: "16px",
  },
  techPill: {
    backgroundColor: "#f1f5f9",
    border: "1px solid #000000",
    borderRadius: "6px",
    padding: "3px 8px",
    fontSize: "11px",
    fontWeight: "800",
  },
  cardActions: {
    display: "flex",
    gap: "10px",
    borderTop: "1px dashed #e2e8f0",
    paddingTop: "14px",
  },
  inspectBtn: {
    flex: 1,
    backgroundColor: "#ffea28",
    color: "#000000",
    border: "2px solid #000000",
    borderRadius: "8px",
    padding: "10px",
    fontWeight: "900",
    fontSize: "12px",
    cursor: "pointer",
    boxShadow: "2px 2px 0px #000000",
  },
  githubLinkBtn: {
    backgroundColor: "#ffffff",
    color: "#000000",
    border: "2px solid #000000",
    borderRadius: "8px",
    padding: "10px 14px",
    fontWeight: "900",
    fontSize: "12px",
    textDecoration: "none",
    cursor: "pointer",
    boxShadow: "2px 2px 0px #000000",
    display: "inline-flex",
    alignItems: "center",
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
    maxWidth: "600px",
    width: "100%",
    padding: "28px",
    fontFamily: "'Space Grotesk', system-ui, sans-serif",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottom: "2px solid #000000",
    paddingBottom: "14px",
    marginBottom: "16px",
  },
  categoryHeader: {
    fontSize: "11px",
    fontWeight: "900",
    color: "#6b7280",
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
  perfGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1.2fr",
    gap: "10px",
    marginBottom: "16px",
  },
  perfBox: {
    backgroundColor: "#fdfbf7",
    border: "2px solid #000000",
    borderRadius: "10px",
    padding: "10px",
    textAlign: "center",
    boxShadow: "2px 2px 0px #000000",
  },
  sectionTitle: {
    fontSize: "12px",
    fontWeight: "900",
    color: "#000000",
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  archList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  archItem: {
    backgroundColor: "#f8fafc",
    border: "1.5px solid #000000",
    borderRadius: "8px",
    padding: "8px 12px",
    fontSize: "12px",
    fontWeight: "600",
    display: "flex",
    alignItems: "flex-start",
  },
  actionRow: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
    borderTop: "2px solid #e2e8f0",
    paddingTop: "16px",
    flexWrap: "wrap",
  },
  primaryRepoBtn: {
    flex: 1,
    backgroundColor: "#000000",
    color: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "10px",
    padding: "12px",
    fontWeight: "900",
    fontSize: "13px",
    textAlign: "center",
    textDecoration: "none",
    boxShadow: "3px 3px 0px #ff3d9a",
  },
  attachBtn: {
    backgroundColor: "#bbf7d0",
    color: "#166534",
    border: "2px solid #000000",
    borderRadius: "10px",
    padding: "12px",
    fontWeight: "900",
    fontSize: "13px",
    cursor: "pointer",
    boxShadow: "3px 3px 0px #000000",
  },
  formBody: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    textAlign: "left",
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
  cancelBtn: {
    backgroundColor: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "10px",
    padding: "10px 18px",
    fontWeight: "800",
    fontSize: "13px",
    cursor: "pointer",
    boxShadow: "2px 2px 0px #000000",
  },
  submitBtn: {
    flex: 1,
    backgroundColor: "#000000",
    color: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "10px",
    padding: "10px 20px",
    fontWeight: "900",
    fontSize: "13px",
    cursor: "pointer",
    boxShadow: "4px 4px 0px #ff3d9a",
  },
};