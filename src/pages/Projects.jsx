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
    description: "A deterministic, memory-aligned limit order book matching engine engineered in modern C++20. Implements lock-free SPSC queues, cache-line padding to eliminate false sharing, and zero-allocation critical paths.",
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
    description: "High-performance option pricing framework simulating continuous-time stochastic volatility under the Heston model using finite-difference Crank-Nicolson PDE discretization and CUDA-parallelized Monte Carlo simulations.",
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
    description: "A fault-tolerant, linearizable distributed key-value storage engine implementing the complete Raft consensus protocol, including leader election, log replication, snapshotting, and dynamic membership transitions.",
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
    description: "A battle-tested competitive programming and high-throughput string/geometry indexer. Contains production implementations of Suffix Automata, 2D Dynamic Segment Trees, and Heavy-Light Tree Decompositions.",
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
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button onClick={() => setIsAddModalOpen(true)} style={styles.addProjectBtn}>+ Add New Project</button>
        </div>
      </div>

      <div style={styles.recommendationsContainer}>
        <div style={styles.sectionHeader}>
          <div>
            <span style={styles.sectionKicker}>PORTFOLIO ROADMAP</span>
            <h3 style={styles.sectionHeading}>Recommended Engineering Projects</h3>
          </div>
          <span style={styles.targetQuantPill}>Target Match: 96%</span>
        </div>

        <div style={styles.recGrid}>
          {RECOMMENDED_ROADMAPS.map((rec, rIdx) => (
            <div key={rIdx} style={styles.recCard}>
              <div style={styles.recTop}>
                <span style={styles.recTag}>{rec.track}</span>
                <span style={styles.recBoostBadge}>{rec.boost}</span>
              </div>
              <h4 style={styles.recTitle}>{rec.title}</h4>
              <p style={styles.recDesc}>{rec.desc}</p>
              <div style={styles.recTechRow}>
                {rec.tech.map((t, tIdx) => <span key={tIdx} style={styles.recTechPill}>{t}</span>)}
              </div>
              <div style={styles.recFooter}>
                <span style={styles.targetText}>Target: <strong>{rec.targetFirms}</strong></span>
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
                >Start Build →</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.filterSection}>
        <input
          type="text"
          placeholder="Search projects by title, stack, or concept..."
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
                backgroundColor: activeCategory === cat ? "#e7e7e7" : "#ffffff",
                color: "#1a1a1a",
                borderBottom: activeCategory === cat ? "2px solid #3b73af" : "2px solid transparent"
              }}
            >{cat}</button>
          ))}
        </div>
      </div>

      <div style={styles.grid}>
        {filteredProjects.map((prj) => (
          <div key={prj.id} style={styles.projectCard}>
            <div>
              <div style={styles.cardTop}>
                <div style={styles.cardMeta}>
                  <span style={styles.categoryBadge}>{prj.category}</span>
                  <span style={styles.verifiedPill}>✓ {prj.status}</span>
                </div>
                <div style={styles.ghStats}>
                  <span>★ {prj.stars}</span>
                  <span>⑂ {prj.forks}</span>
                </div>
              </div>

              <h3 style={styles.projectTitle}>{prj.title}</h3>

              <div style={styles.metricsBox}>
                <div style={styles.metricItem}>
                  <span style={styles.metricLabel}>BENCHMARK SLA</span>
                  <strong style={styles.metricVal}>{prj.benchmark}</strong>
                </div>
                <div style={styles.metricItem}>
                  <span style={styles.metricLabel}>THROUGHPUT</span>
                  <strong style={styles.metricValSuccess}>{prj.throughput}</strong>
                </div>
              </div>

              <p style={styles.projectDesc}>{prj.description}</p>

              <div style={styles.techStackRow}>
                {prj.techStack.map((tech, tIdx) => <span key={tIdx} style={styles.techPill}>{tech}</span>)}
              </div>
            </div>

            <div style={styles.cardActions}>
              <button onClick={() => setActiveModalProject(prj)} style={styles.inspectBtn}>Inspect Architecture</button>
              <a href={prj.repoUrl} target="_blank" rel="noopener noreferrer" style={styles.githubLinkBtn}>GitHub Repo ↗</a>
            </div>
          </div>
        ))}
      </div>

      {activeModalProject && (
        <div style={modalStyles.overlay} onClick={() => setActiveModalProject(null)}>
          <div style={modalStyles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={modalStyles.header}>
              <div>
                <div style={modalStyles.categoryHeader}>{activeModalProject.category} · Technical Audit</div>
                <h2 style={modalStyles.roleHeading}>{activeModalProject.title}</h2>
                <div style={modalStyles.metaLine}>
                  Tracking ID: <strong>{activeModalProject.id}</strong> · {activeModalProject.difficulty}
                </div>
              </div>
              <button onClick={() => setActiveModalProject(null)} style={modalStyles.closeBtn}>×</button>
            </div>

            <div style={modalStyles.perfGrid}>
              <div style={modalStyles.perfBox}>
                <span style={modalStyles.perfLabel}>LATENCY SLA</span>
                <div style={modalStyles.perfGreen}>{activeModalProject.benchmark}</div>
              </div>
              <div style={modalStyles.perfBox}>
                <span style={modalStyles.perfLabel}>THROUGHPUT</span>
                <div style={modalStyles.perfBlue}>{activeModalProject.throughput}</div>
              </div>
              <div style={modalStyles.perfBox}>
                <span style={modalStyles.perfLabel}>GITHUB PROOF</span>
                <div style={modalStyles.perfValue}>★ {activeModalProject.stars} · ⑂ {activeModalProject.forks}</div>
              </div>
            </div>

            <div style={modalStyles.sectionBlock}>
              <div style={modalStyles.sectionTitle}>Key Engineering &amp; Architecture Highlights</div>
              <div style={modalStyles.archList}>
                {activeModalProject.architectureDetails.map((item, idx) => (
                  <div key={idx} style={modalStyles.archItem}>
                    <span style={modalStyles.check}>✓</span><span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={modalStyles.sectionBlock}>
              <div style={modalStyles.sectionTitle}>Production Technologies Used</div>
              <div style={styles.techStackRow}>
                {activeModalProject.techStack.map((tech, tIdx) => <span key={tIdx} style={styles.techPill}>{tech}</span>)}
              </div>
            </div>

            <div style={modalStyles.actionRow}>
              <a href={activeModalProject.repoUrl} target="_blank" rel="noopener noreferrer" style={modalStyles.primaryRepoBtn}>Open Source Code on GitHub ↗</a>
              <button
                onClick={() => {
                  alert("Project credentials and benchmark telemetry attached to your live ATS application pipeline!");
                  setActiveModalProject(null);
                }}
                style={modalStyles.attachBtn}
              >Attach Proof to ATS Applications</button>
            </div>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <div style={modalStyles.overlay} onClick={() => setIsAddModalOpen(false)}>
          <div style={modalStyles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={modalStyles.header}>
              <div>
                <div style={modalStyles.categoryHeader}>SkillBridge Showcase</div>
                <h2 style={modalStyles.roleHeading}>Add &amp; Verify GitHub Repository</h2>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} style={modalStyles.closeBtn}>×</button>
            </div>

            <form onSubmit={handleCreateProject} style={modalStyles.formBody}>
              <div style={modalStyles.inputGroup}>
                <label style={modalStyles.label}>Project Title *</label>
                <input type="text" placeholder="e.g. Distributed Consensus Engine in Modern C++" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} style={modalStyles.input} required />
              </div>

              <div style={modalStyles.grid2}>
                <div style={modalStyles.inputGroup}>
                  <label style={modalStyles.label}>Domain Track</label>
                  <select value={newProject.category} onChange={(e) => setNewProject({ ...newProject, category: e.target.value })} style={modalStyles.select}>
                    <option value="Low-Latency & HFT">Low-Latency & HFT</option>
                    <option value="Quantitative Finance">Quantitative Finance</option>
                    <option value="Distributed Systems">Distributed Systems</option>
                    <option value="Algorithms & CP">Algorithms & CP</option>
                  </select>
                </div>
                <div style={modalStyles.inputGroup}>
                  <label style={modalStyles.label}>Benchmark SLA</label>
                  <input type="text" placeholder="e.g. < 950ns p99 Tick-to-Trade" value={newProject.benchmark} onChange={(e) => setNewProject({ ...newProject, benchmark: e.target.value })} style={modalStyles.input} />
                </div>
              </div>

              <div style={modalStyles.inputGroup}>
                <label style={modalStyles.label}>GitHub Repository URL *</label>
                <input type="url" placeholder="https://github.com/username/project" value={newProject.repoUrl} onChange={(e) => setNewProject({ ...newProject, repoUrl: e.target.value })} style={modalStyles.input} required />
              </div>

              <div style={modalStyles.inputGroup}>
                <label style={modalStyles.label}>Tech Stack (Comma Separated)</label>
                <input type="text" placeholder="e.g. C++20, DPDK, SIMD, Lock-Free" value={newProject.techStack} onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value })} style={modalStyles.input} />
              </div>

              <div style={modalStyles.inputGroup}>
                <label style={modalStyles.label}>Architecture &amp; Engineering Summary</label>
                <textarea rows="3" placeholder="Summarize the core algorithms, cache alignment, and concurrency model..." value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} style={modalStyles.textarea} />
              </div>

              <div style={modalStyles.actionRow}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} style={modalStyles.cancelBtn}>Cancel</button>
                <button type="submit" style={modalStyles.submitBtn}>Verify &amp; Attach Project</button>
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
    padding: "18px 20px",
    width: "100%",
    color: "#1a1a1a",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "13px",
    lineHeight: 1.4,
    boxSizing: "border-box",
    backgroundColor: "#f3f3f3",
    minHeight: "100%"
  },
  headerBanner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    border: "1px solid #c8c8c8",
    borderRadius: "2px",
    padding: "16px 18px",
    marginBottom: "12px",
    flexWrap: "wrap",
    gap: "12px"
  },
  topBadgeRow: { display: "flex", gap: "8px", alignItems: "center", marginBottom: "5px" },
  liveTag: { fontSize: "11px", fontWeight: "700", color: "#666" },
  verifiedCount: { fontSize: "11px", color: "#444", backgroundColor: "#f0f0f0", border: "1px solid #c8c8c8", padding: "2px 7px", borderRadius: "2px" },
  headerTitle: { margin: 0, fontSize: "21px", fontWeight: "700", color: "#222" },
  headerSub: { margin: "4px 0 0", fontSize: "12px", color: "#666", maxWidth: "800px" },
  addProjectBtn: { backgroundColor: "#3b73af", color: "#fff", border: "1px solid #2e5d8f", borderRadius: "2px", padding: "8px 13px", fontSize: "12px", fontWeight: "700", cursor: "pointer" },

  recommendationsContainer: { backgroundColor: "#fff", border: "1px solid #c8c8c8", borderRadius: "2px", padding: "14px 16px", marginBottom: "12px" },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "11px", flexWrap: "wrap", gap: "8px" },
  sectionKicker: { fontSize: "10px", fontWeight: "700", color: "#777", letterSpacing: "0.5px" },
  sectionHeading: { margin: "2px 0 0", fontSize: "16px", fontWeight: "700", color: "#222" },
  targetQuantPill: { backgroundColor: "#eaf3fb", border: "1px solid #b9d2e8", color: "#2e5d8f", borderRadius: "2px", padding: "3px 7px", fontSize: "11px", fontWeight: "700" },
  recGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "10px" },
  recCard: { backgroundColor: "#fafafa", border: "1px solid #d0d0d0", borderRadius: "2px", padding: "12px", display: "flex", flexDirection: "column", justifyContent: "space-between" },
  recTop: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" },
  recTag: { fontSize: "10px", fontWeight: "700", color: "#777", textTransform: "uppercase" },
  recBoostBadge: { color: "#287a3d", backgroundColor: "#edf8ef", border: "1px solid #b9d9c0", borderRadius: "2px", padding: "1px 5px", fontSize: "10px", fontWeight: "700" },
  recTitle: { margin: "5px 0 5px", fontSize: "14px", fontWeight: "700", color: "#222" },
  recDesc: { margin: "0 0 9px", fontSize: "12px", color: "#666", lineHeight: 1.45 },
  recTechRow: { display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "10px" },
  recTechPill: { backgroundColor: "#fff", border: "1px solid #d0d0d0", borderRadius: "2px", padding: "2px 5px", fontSize: "10px", color: "#555" },
  recFooter: { display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #ddd", paddingTop: "8px", gap: "8px", flexWrap: "wrap" },
  targetText: { fontSize: "10px", color: "#666" },
  recActionBtn: { backgroundColor: "#fff", color: "#3b73af", border: "1px solid #b8c9da", borderRadius: "2px", padding: "5px 8px", fontSize: "11px", fontWeight: "700", cursor: "pointer" },

  filterSection: { backgroundColor: "#fff", border: "1px solid #c8c8c8", borderRadius: "2px", padding: "10px 12px 0", marginBottom: "12px" },
  searchBar: { width: "100%", boxSizing: "border-box", padding: "8px 10px", border: "1px solid #bdbdbd", borderRadius: "2px", fontSize: "12px", color: "#222", outline: "none", marginBottom: "8px" },
  filterRow: { display: "flex", gap: "2px", flexWrap: "wrap" },
  filterTabBtn: { border: "1px solid transparent", borderRadius: "2px 2px 0 0", padding: "7px 11px", fontSize: "12px", cursor: "pointer" },

  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "12px" },
  projectCard: { backgroundColor: "#fff", border: "1px solid #c8c8c8", borderRadius: "2px", padding: "15px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "330px" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "9px", gap: "8px" },
  cardMeta: { display: "flex", gap: "7px", alignItems: "center", flexWrap: "wrap" },
  categoryBadge: { fontSize: "10px", fontWeight: "700", color: "#666", textTransform: "uppercase" },
  verifiedPill: { color: "#287a3d", backgroundColor: "#edf8ef", border: "1px solid #b9d9c0", borderRadius: "2px", padding: "1px 5px", fontSize: "10px", fontWeight: "700" },
  ghStats: { display: "flex", gap: "8px", fontSize: "11px", color: "#666", whiteSpace: "nowrap" },
  projectTitle: { margin: "0 0 10px", fontSize: "17px", lineHeight: 1.3, fontWeight: "700", color: "#222" },
  metricsBox: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0", backgroundColor: "#f7f7f7", border: "1px solid #d0d0d0", borderRadius: "2px", padding: "8px", marginBottom: "11px" },
  metricItem: { display: "flex", flexDirection: "column", gap: "2px", padding: "0 7px" },
  metricLabel: { fontSize: "9px", fontWeight: "700", color: "#777", letterSpacing: "0.4px" },
  metricVal: { fontSize: "12px", fontWeight: "700", color: "#2e5d8f" },
  metricValSuccess: { fontSize: "12px", fontWeight: "700", color: "#287a3d" },
  projectDesc: { fontSize: "12px", color: "#555", lineHeight: 1.5, margin: "0 0 12px" },
  techStackRow: { display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "12px" },
  techPill: { backgroundColor: "#f4f4f4", border: "1px solid #d0d0d0", borderRadius: "2px", padding: "2px 6px", fontSize: "10px", color: "#555" },
  cardActions: { display: "flex", gap: "8px", borderTop: "1px solid #ddd", paddingTop: "11px", marginTop: "auto" },
  inspectBtn: { flex: 1, backgroundColor: "#f1f1f1", color: "#333", border: "1px solid #bdbdbd", borderRadius: "2px", padding: "8px 10px", fontWeight: "700", fontSize: "11px", cursor: "pointer" },
  githubLinkBtn: { backgroundColor: "#fff", color: "#3b73af", border: "1px solid #b8c9da", borderRadius: "2px", padding: "8px 11px", fontWeight: "700", fontSize: "11px", textDecoration: "none", display: "inline-flex", alignItems: "center" }
};

const modalStyles = {
  overlay: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.48)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "16px", boxSizing: "border-box" },
  modalCard: { backgroundColor: "#fff", border: "1px solid #aaa", borderRadius: "2px", maxWidth: "650px", width: "100%", padding: "18px", fontFamily: "Arial, Helvetica, sans-serif", maxHeight: "90vh", overflowY: "auto", boxSizing: "border-box" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #ccc", paddingBottom: "11px", marginBottom: "13px", gap: "12px" },
  categoryHeader: { fontSize: "10px", fontWeight: "700", color: "#777", textTransform: "uppercase" },
  roleHeading: { margin: "3px 0 4px", fontSize: "19px", lineHeight: 1.3, fontWeight: "700", color: "#222" },
  metaLine: { fontSize: "11px", color: "#666" },
  closeBtn: { backgroundColor: "#f5f5f5", border: "1px solid #bbb", borderRadius: "2px", width: "28px", height: "28px", fontSize: "17px", lineHeight: 1, color: "#444", cursor: "pointer" },
  perfGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "14px" },
  perfBox: { backgroundColor: "#f7f7f7", border: "1px solid #d0d0d0", borderRadius: "2px", padding: "9px", textAlign: "center" },
  perfLabel: { display: "block", fontSize: "9px", fontWeight: "700", color: "#777", marginBottom: "2px" },
  perfGreen: { fontSize: "16px", fontWeight: "700", color: "#287a3d" },
  perfBlue: { fontSize: "16px", fontWeight: "700", color: "#3b73af" },
  perfValue: { fontSize: "14px", fontWeight: "700", color: "#444" },
  sectionBlock: { margin: "14px 0", textAlign: "left" },
  sectionTitle: { fontSize: "11px", fontWeight: "700", color: "#333", marginBottom: "7px", textTransform: "uppercase" },
  archList: { display: "flex", flexDirection: "column", gap: "6px" },
  archItem: { backgroundColor: "#fafafa", border: "1px solid #d5d5d5", borderRadius: "2px", padding: "7px 9px", fontSize: "11px", color: "#444", display: "flex", alignItems: "flex-start" },
  check: { color: "#287a3d", fontWeight: "700", marginRight: "7px" },
  actionRow: { display: "flex", gap: "8px", marginTop: "17px", borderTop: "1px solid #ddd", paddingTop: "12px", flexWrap: "wrap" },
  primaryRepoBtn: { flex: 1, backgroundColor: "#3b73af", color: "#fff", border: "1px solid #2e5d8f", borderRadius: "2px", padding: "9px 11px", fontWeight: "700", fontSize: "12px", textAlign: "center", textDecoration: "none" },
  attachBtn: { backgroundColor: "#f1f1f1", color: "#333", border: "1px solid #bbb", borderRadius: "2px", padding: "9px 11px", fontWeight: "700", fontSize: "12px", cursor: "pointer" },
  formBody: { display: "flex", flexDirection: "column", gap: "11px", textAlign: "left" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "4px" },
  label: { fontSize: "11px", fontWeight: "700", color: "#444" },
  input: { padding: "8px 9px", border: "1px solid #bdbdbd", borderRadius: "2px", fontSize: "12px", color: "#222", backgroundColor: "#fff", outline: "none", boxSizing: "border-box", width: "100%" },
  select: { padding: "8px 9px", border: "1px solid #bdbdbd", borderRadius: "2px", fontSize: "12px", color: "#222", backgroundColor: "#fff", boxSizing: "border-box", width: "100%" },
  textarea: { padding: "8px 9px", border: "1px solid #bdbdbd", borderRadius: "2px", fontSize: "12px", color: "#222", backgroundColor: "#fff", outline: "none", resize: "vertical", boxSizing: "border-box", width: "100%" },
  cancelBtn: { backgroundColor: "#fff", color: "#444", border: "1px solid #bbb", borderRadius: "2px", padding: "8px 15px", fontWeight: "700", fontSize: "12px", cursor: "pointer" },
  submitBtn: { flex: 1, backgroundColor: "#3b73af", color: "#fff", border: "1px solid #2e5d8f", borderRadius: "2px", padding: "8px 15px", fontWeight: "700", fontSize: "12px", cursor: "pointer" }
};
