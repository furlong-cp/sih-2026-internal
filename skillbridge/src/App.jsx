import { useEffect, useState, useMemo } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import JobsPage from "./pages/Jobs";
import ApplicationsPage from "./pages/Applications";
import AssessmentsPage from "./pages/Assessments";
import SkillProfilePage from "./pages/SkillProfile";
import ProjectsPage from "./pages/Projects";
import CareerCopilotPage from "./pages/CareerCopilot";
import MessagesPage from "./pages/Messages";
import CommunityPage from "./pages/Community";
import LeaderboardPage from "./pages/Leaderboard";

function App() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");
  const [tabLoading, setTabLoading] = useState(false);

  const [skillScore, setSkillScore] = useState(0);
  const [applications, setApplications] = useState([]);

  const [cursor, setCursor] = useState({ x: -500, y: -500 });
  // Global theme — light by default
const [darkMode, setDarkMode] = useState(() => {
  return localStorage.getItem("skillbridge-theme") === "dark";
});

useEffect(() => {
  const root = document.documentElement;

  if (darkMode) {
    root.setAttribute("data-theme", "dark");
    localStorage.setItem("skillbridge-theme", "dark");
  } else {
    root.setAttribute("data-theme", "light");
    localStorage.setItem("skillbridge-theme", "light");
  }
}, [darkMode]);

const handleToggleTheme = () => {
  setDarkMode((prev) => !prev);
};

  useEffect(() => {
    const moveCursor = (event) => {
      setCursor({ x: event.clientX, y: event.clientY });
      document.documentElement.style.setProperty("--mouse-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${event.clientY}px`);
    };

    window.addEventListener("mousemove", moveCursor);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 7000);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      clearTimeout(timer);
    };
  }, []);

  const handleNavigate = (tabName) => {
    if (tabName === activeTab && !tabLoading) {
      setTabLoading(true);
      setTimeout(() => setTabLoading(false), 350);
      return;
    }
    setTabLoading(true);
    setTimeout(() => {
      setActiveTab(tabName);
      setTabLoading(false);
    }, 400);
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setCurrentUser(null);
    setShowOnboarding(false);
    setSkillScore(0);
    setApplications([]);
    setActiveTab("Home");
  };

  const handleAdvanceStage = (appId) => {
    const stageNames = [
      "Application Submitted",
      "Automated OA / CoderPad",
      "Technical Round 1 (Low-Latency / DSA)",
      "Technical Round 2 (System Design / Probability)",
      "Offer Extended 🎉",
    ];

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          const nextIdx = Math.min(app.currentStageIndex + 1, stageNames.length - 1);
          return {
            ...app,
            currentStageIndex: nextIdx,
            status: nextIdx === stageNames.length - 1 ? "Offer Extended 🎉" : `${stageNames[nextIdx]} Active`,
          };
        }
        return app;
      })
    );
  };

  const handleOnboardingComplete = (details) => {
    setCurrentUser((prev) => ({
      ...prev,
      ...details,
    }));
    setShowOnboarding(false);
  };

  return (
    <>
      <div className="ambient-background">
        <div className="noise-layer" />
        <div className="ambient-orb orb-one" />
        <div className="ambient-orb orb-two" />
        <div className="ambient-orb orb-three" />
        <div className="ambient-orb orb-four" />
        <div className="ambient-shape shape-one" />
        <div className="ambient-shape shape-two" />
        <div className="ambient-shape shape-three" />
      </div>

      <div className="cursor-aura" style={{ left: cursor.x, top: cursor.y }} />
      <div className="cursor-core" style={{ left: cursor.x, top: cursor.y }} />

      {/* 7-Second Intro Screen */}
      {loading && <LoadingScreen />}

      {/* Auth Screen */}
      {!loading && !authenticated && (
        <LoginScreen
          onLoginSuccess={(user, isNewSignup) => {
            setCurrentUser(user);
            setSkillScore(user.initialScore || 0);
            setAuthenticated(true);
            if (isNewSignup) {
              setShowOnboarding(true);
            }
          }}
        />
      )}

      {/* Post-Signup Onboarding Wizard */}
      {!loading && authenticated && showOnboarding && (
        <OnboardingWizard
          user={currentUser}
          onComplete={handleOnboardingComplete}
        />
      )}

      {/* Authenticated Command Center */}
      {!loading && authenticated && !showOnboarding && (
        <div className="app app-visible">
          <Navbar
  user={currentUser}
  activeTab={activeTab}
  onTabSelect={handleNavigate}
  onLogout={handleLogout}
  darkMode={darkMode}
  onToggleTheme={handleToggleTheme}
/>

          <div className="app-body">
            <Sidebar
              activeTab={activeTab}
              onTabSelect={handleNavigate}
            />

            {tabLoading ? (
              <div style={spiralStyles.container}>
                <div style={spiralStyles.spiral} />
                <div style={spiralStyles.text}>Syncing Command Center...</div>
              </div>
            ) : (
              <main style={{ flex: 1, width: "100%", overflowY: "auto" }}>
                {activeTab === "Home" && (
                  <Home
                    user={currentUser}
                    onNavigate={handleNavigate}
                    applicationsCount={applications.length}
                    score={skillScore}
                  />
                )}

                {activeTab === "Jobs" && (
                  <JobsPage
                    applications={applications}
                    onApplicationSubmit={(newApp) => setApplications([newApp, ...applications])}
                    onAdvanceStage={handleAdvanceStage}
                  />
                )}

                {activeTab === "Applications" && (
                  <ApplicationsPage
                    applications={applications}
                    onAdvanceStage={handleAdvanceStage}
                    onExploreJobs={() => handleNavigate("Jobs")}
                  />
                )}

                {activeTab === "Assessments" && (
                  <AssessmentsPage
                    score={skillScore}
                    onScoreUpdate={(delta) => setSkillScore((prev) => prev + delta)}
                  />
                )}

                {activeTab === "Skill Profile" && (
                  <SkillProfilePage
                    user={currentUser}
                    score={skillScore}
                    onNavigate={handleNavigate}
                  />
                )}

                {activeTab === "Projects" && (
                  <ProjectsPage
                    user={currentUser}
                    onNavigate={handleNavigate}
                  />
                )}

                {activeTab === "Career Copilot" && (
                  <CareerCopilotPage
                    user={currentUser}
                    score={skillScore}
                    onNavigate={handleNavigate}
                  />
                )}

                {activeTab === "Messages" && (
                  <MessagesPage
                    user={currentUser}
                    onNavigate={handleNavigate}
                  />
                )}

                {activeTab === "Community" && (
                  <CommunityPage
                    user={currentUser}
                    onNavigate={handleNavigate}
                  />
                )}

                {activeTab === "Leaderboard" && (
                  <LeaderboardPage
                    user={currentUser}
                    score={skillScore}
                    onNavigate={handleNavigate}
                  />
                )}

                {/* Catch-all for unbuilt routes */}
                {activeTab !== "Home" &&
                  activeTab !== "Jobs" &&
                  activeTab !== "Applications" &&
                  activeTab !== "Assessments" &&
                  activeTab !== "Skill Profile" &&
                  activeTab !== "Projects" &&
                  activeTab !== "Career Copilot" &&
                  activeTab !== "Messages" &&
                  activeTab !== "Community" &&
                  activeTab !== "Leaderboard" && (
                    <div style={{ padding: "40px", textAlign: "center", fontFamily: "'Space Grotesk', sans-serif" }}>
                      <h2>{activeTab} Module</h2>
                      <p style={{ color: "#64748b" }}>This section is currently being populated.</p>
                    </div>
                  )}
              </main>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function OnboardingWizard({ user, onComplete }) {
  const [college, setCollege] = useState("National Institute of Technology Warangal (NITW)");
  const [branch, setBranch] = useState("Mathematics & Computing");
  const [currentLocation, setCurrentLocation] = useState("Hanamkonda / Hyderabad, India");
  const [workLocation, setWorkLocation] = useState("Singapore / Global Remote");

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete({
      college,
      branch,
      currentLocation,
      workLocation,
    });
  };

  return (
    <div style={wizardStyles.overlay}>
      <div style={wizardStyles.card}>
        <div style={wizardStyles.badgeIcon}>🎓</div>
        <h2 style={{ margin: "4px 0 2px 0", fontSize: "22px", fontWeight: "900" }}>
          COMPLETE YOUR ACADEMIC &amp; LOCATION PROFILE
        </h2>
        <p style={{ margin: "0 0 16px 0", fontSize: "12px", color: "#4b5563" }}>
          This calibrates your ATS match rates, company relocation eligibility, and Copilot advice.
        </p>

        <form onSubmit={handleSubmit} style={wizardStyles.form}>
          <div style={wizardStyles.inputGroup}>
            <label style={wizardStyles.label}>College / University *</label>
            <input
              type="text"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              placeholder="e.g. NIT Warangal / IIT Guwahati / BITS Pilani"
              style={wizardStyles.input}
              required
            />
          </div>

          <div style={wizardStyles.inputGroup}>
            <label style={wizardStyles.label}>Engineering Branch / Degree Major *</label>
            <input
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              placeholder="e.g. Mathematics & Computing / Computer Science / DSAI"
              style={wizardStyles.input}
              required
            />
          </div>

          <div style={wizardStyles.grid2}>
            <div style={wizardStyles.inputGroup}>
              <label style={wizardStyles.label}>Current City / Location *</label>
              <input
                type="text"
                value={currentLocation}
                onChange={(e) => setCurrentLocation(e.target.value)}
                placeholder="e.g. Hyderabad / Bengaluru / Delhi"
                style={wizardStyles.input}
                required
              />
            </div>

            <div style={wizardStyles.inputGroup}>
              <label style={wizardStyles.label}>Target Work Location *</label>
              <select
                value={workLocation}
                onChange={(e) => setWorkLocation(e.target.value)}
                style={wizardStyles.select}
              >
                <option value="Singapore / Global Remote">Singapore (Relocation)</option>
                <option value="London / UK">London / UK (Relocation)</option>
                <option value="New York / US">New York / US</option>
                <option value="Bengaluru / Hyderabad (India)">Bengaluru / Hyderabad (India)</option>
                <option value="Gurugram / Mumbai (India)">Gurugram / Mumbai (India)</option>
                <option value="Global Remote">Global Remote</option>
              </select>
            </div>
          </div>

          <button type="submit" style={wizardStyles.submitBtn}>
            Enter Career OS Command Center ⚡
          </button>
        </form>
      </div>
    </div>
  );
}

const wizardStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    backdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "20px",
  },
  card: {
    backgroundColor: "#ffffff",
    border: "3px solid #000000",
    borderRadius: "20px",
    boxShadow: "10px 10px 0px #000000",
    maxWidth: "540px",
    width: "100%",
    padding: "32px",
    textAlign: "center",
    fontFamily: "'Space Grotesk', system-ui, sans-serif",
  },
  badgeIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    background: "#ffea28",
    border: "2px solid #000000",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    marginBottom: "10px",
    boxShadow: "2px 2px 0px #000000",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    textAlign: "left",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  label: {
    fontSize: "11px",
    fontWeight: "800",
    color: "#111827",
  },
  input: {
    backgroundColor: "#fdfbf7",
    border: "2px solid #000000",
    borderRadius: "8px",
    padding: "10px 12px",
    fontSize: "13px",
    fontWeight: "700",
    outline: "none",
  },
  select: {
    backgroundColor: "#fdfbf7",
    border: "2px solid #000000",
    borderRadius: "8px",
    padding: "10px 12px",
    fontSize: "12px",
    fontWeight: "700",
    outline: "none",
    cursor: "pointer",
  },
  submitBtn: {
    marginTop: "8px",
    backgroundColor: "#000000",
    color: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "10px",
    padding: "13px",
    fontSize: "13px",
    fontWeight: "900",
    cursor: "pointer",
    boxShadow: "4px 4px 0px #ff3d9a",
  },
};

function LoadingScreen() {
  const [statIndex, setStatIndex] = useState(0);

  const stats = [
    { number: "100K+", text: "candidates placed" },
    { number: "2.4M+", text: "skills verified" },
    { number: "48K+", text: "projects showcased" },
    { number: "12K+", text: "companies hiring" },
  ];

  useEffect(() => {
    const delays = [2500, 1100, 1100, 1100];
    const timer = setTimeout(() => {
      setStatIndex((current) => {
        if (current === stats.length - 1) return current;
        return current + 1;
      });
    }, delays[statIndex]);

    return () => clearTimeout(timer);
  }, [statIndex]);

  return (
    <div className="loading-screen">
      <div className="intro-color-field" />
      <div className="intro-blob blob-pink" />
      <div className="intro-blob blob-blue" />
      <div className="intro-blob blob-yellow" />
      <div className="intro-blob blob-green" />
      <div className="intro-blob blob-purple" />

      <div className="checker checker-one" />
      <div className="checker checker-two" />
      <div className="dots dots-one" />
      <div className="dots dots-two" />
      <div className="squiggle squiggle-one">〰〰〰</div>
      <div className="squiggle squiggle-two">〰〰</div>

      <div className="intro-top-brand">
        <div className="intro-logo">
          <div style={inlineLogoStyles.introBadge}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M4 17L10 11L14 15L20 7" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="20" cy="7" r="3" fill="#000000" />
            </svg>
          </div>
        </div>
        <strong>SKILLBRIDGE</strong>
        <span>CAREER OS</span>
      </div>

      <div className="global-flight">
        <div className="flight-origin">
          🇮🇳 <span>INDIA</span>
        </div>
        <div className="flight-path">
          <div className="flight-line" />
          <div className="flight-plane">✈️</div>
          <div className="flight-spark spark-one">✦</div>
          <div className="flight-spark spark-two">✦</div>
        </div>
        <div className="flight-destination">
          🌎 <span>WORLD</span>
        </div>
      </div>

      <div className="photo-card photo-sydney">
        <img
          src="https://images.unsplash.com/photo-1524293581917-878a6d017c71?auto=format&fit=crop&w=700&q=80"
          alt="Sydney"
        />
        <div className="photo-overlay">
          🇦🇺 <strong>SYDNEY</strong>
          <small>Internship secured</small>
        </div>
      </div>

      <div className="photo-card photo-newyork">
        <img
          src="https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=700&q=80"
          alt="New York"
        />
        <div className="photo-overlay">
          🇺🇸 <strong>NEW YORK</strong>
          <small>Quant Developer</small>
        </div>
      </div>

      <div className="photo-card photo-singapore">
        <img
          src="https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=700&q=80"
          alt="Singapore"
        />
        <div className="photo-overlay">
          🇸🇬 <strong>SINGAPORE</strong>
          <small>Software Engineer</small>
        </div>
      </div>

      <div className="photo-card photo-toronto">
        <img
          src="https://images.unsplash.com/photo-1517090504586-fde19ea6066f?auto=format&fit=crop&w=700&q=80"
          alt="Toronto"
        />
        <div className="photo-overlay">
          🇨🇦 <strong>TORONTO</strong>
          <small>Backend Engineer</small>
        </div>
      </div>

      <div className="main-stat-card">
        <div className="stat-mini-label">SKILLBRIDGE NETWORK</div>
        <div className="main-stat-number" key={statIndex}>
          {stats[statIndex].number}
        </div>
        <div className="main-stat-text">{stats[statIndex].text}</div>

        <div className="stat-avatars">
          <div>AK</div>
          <div>RS</div>
          <div>JM</div>
          <div>NP</div>
          <div>VK</div>
          <span>+100K</span>
        </div>

        <div className="stat-progress">
          <div />
        </div>
      </div>

      <div className="sticker sticker-internship">
        <span>🚀</span>
        <strong>
          BRO GOT THE
          <br />
          INTERNSHIP
        </strong>
      </div>

      <div className="sticker sticker-dsa">
        <span>POV:</span>
        <strong>
          DSA
          <br />
          FINALLY
          <br />
          PAID OFF 😭
        </strong>
      </div>

      <div className="sticker sticker-github">
        <span>INTERVIEWER:</span>
        <strong>
          "Show me
          <br />
          your projects"
        </strong>
        <small>me opening GitHub 💀</small>
      </div>

      <div className="offer-ticket">
        <div className="offer-top">
          NEW OFFER <span>✓</span>
        </div>
        <strong>₹18L</strong>
        <span>Quant Developer</span>
        <small>0 → OFFER</small>
      </div>

      <div className="mini-terminal">
        <div className="terminal-bar">
          <i />
          <i />
          <i />
          <span>skillbridge.cpp</span>
        </div>
        <div className="terminal-code">
          <span>
            <b>01</b> solve(problem);
          </span>
          <span>
            <b>02</b> optimize();
          </span>
          <span>
            <b>03</b> submit();
          </span>
          <span className="accepted">✓ ACCEPTED</span>
        </div>
      </div>

      <div className="growth-card">
        <span>CAREER GROWTH</span>
        <strong>+84%</strong>
        <svg viewBox="0 0 240 90">
          <polyline
            points="5,78 30,70 55,72 80,55 105,61 130,39 155,44 180,25 205,30 235,5"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
        </svg>
      </div>

      <div className="floating-tag tag-one">💻 C++</div>
      <div className="floating-tag tag-two">📈 PROBABILITY</div>
      <div className="floating-tag tag-three">🧠 DSA</div>
      <div className="floating-tag tag-four">☁️ REMOTE</div>
      <div className="floating-tag tag-five">💼 OFFER</div>

      <div className="loading-panel">
        <div className="panel-logo">
          <div style={inlineLogoStyles.panelBadge}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M4 17L10 11L14 15L20 7" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="20" cy="7" r="2.5" fill="#ffffff" />
            </svg>
          </div>
          <span>SkillBridge</span>
        </div>
        <div className="panel-line" />
        <div className="panel-message">
          Connecting
          <br />
          <strong>talent ↔ opportunity</strong>
        </div>
        <div className="panel-status">
          <span>
            {statIndex === 0
              ? "BUILDING GLOBAL NETWORK"
              : "SYNCING CAREER DATA"}
          </span>
          <span>{Math.min(96, 25 + statIndex * 22)}%</span>
        </div>
      </div>

      <div className="intro-bottom">
        <span>BUILD</span>
        <b>→</b>
        <span>PROVE</span>
        <b>→</b>
        <span>CONNECT</span>
        <b>→</b>
        <span>GROW</span>
      </div>

      <div className="tiny-note note-one">YOUR SKILLS ARE THE RESUME</div>
      <div className="tiny-note note-two">01 / CAREER</div>
      <div className="tiny-note note-three">MADE FOR BUILDERS</div>
    </div>
  );
}

const ALL_SWE_ROLES = [
  { id: "qdev", title: "Quantitative Developer (C++ / HFT)", category: "Quant & HFT", targetFirms: "Jane Street, Citadel, Tower, HRT" },
  { id: "qres", title: "Quantitative Researcher / Trader", category: "Quant & HFT", targetFirms: "Optiver, Two Sigma, Jump, DE Shaw" },
  { id: "fpga", title: "Low-Latency FPGA / Hardware Engineer", category: "Quant & HFT", targetFirms: "Citadel Securities, Optiver, HRT" },
  { id: "strat", title: "Quantitative Trading Strategist", category: "Quant & HFT", targetFirms: "Akuna Capital, DRW, IMC Trading" },
  { id: "sys", title: "Core Distributed Systems Engineer", category: "Systems & Backend", targetFirms: "Google, Meta, Databricks, AWS" },
  { id: "backend", title: "High-Throughput Backend Engineer (Go / Java)", category: "Systems & Backend", targetFirms: "Uber, Stripe, Salesforce, Netflix" },
  { id: "os_kernel", title: "Operating Systems & Linux Kernel Engineer", category: "Systems & Backend", targetFirms: "Apple, Red Hat, Meta, Cloudflare" },
  { id: "db_eng", title: "Database & Storage Engine Engineer", category: "Systems & Backend", targetFirms: "Snowflake, MongoDB, CockroachDB" },
  { id: "compiler", title: "Compiler Engineer (LLVM / Rust)", category: "Systems & Backend", targetFirms: "Apple, NVIDIA, Google, Jane Street" },
  { id: "ai_infra", title: "AI / HPC Infrastructure & CUDA Engineer", category: "AI & Machine Learning", targetFirms: "NVIDIA, OpenAI, Anthropic, Meta" },
  { id: "mle", title: "Machine Learning Engineer (NLP / LLMs)", category: "AI & Machine Learning", targetFirms: "Google DeepMind, Microsoft, Apple" },
  { id: "data_eng", title: "Distributed Data & Stream Processing Engineer", category: "AI & Machine Learning", targetFirms: "Databricks, Netflix, Spotify" },
  { id: "fullstack", title: "Full-Stack Product Engineer (React / Node / Go)", category: "Web & Product", targetFirms: "Airbnb, Vercel, Linear, Stripe" },
  { id: "frontend", title: "High-Performance Frontend Systems Engineer", category: "Web & Product", targetFirms: "Figma, Vercel, Canva, Meta" },
  { id: "mobile", title: "Mobile Systems Engineer (iOS / Android / Rust)", category: "Web & Product", targetFirms: "Apple, Uber, Duolingo, WhatsApp" },
  { id: "devops", title: "Site Reliability & Cloud Infrastructure Engineer", category: "Cloud & DevOps", targetFirms: "AWS, Cloudflare, Google Cloud" },
  { id: "sec_eng", title: "Security Systems & Cryptography Engineer", category: "Security & Web3", targetFirms: "Ethereum Foundation, Palantir, CrowdStrike" },
  { id: "web3_core", title: "Protocol / Smart Contract Core Engineer", category: "Security & Web3", targetFirms: "Polygon, Solana, Chainlink, Coinbase" },
];

function LoginScreen({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  const [cfHandleInput, setCfHandleInput] = useState("");
  const [lcHandleInput, setLcHandleInput] = useState("");
  const [ghHandleInput, setGhHandleInput] = useState("");

  const [roleSearch, setRoleSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState(ALL_SWE_ROLES[0]);
  const [targetYear, setTargetYear] = useState("2027 (Internship)");
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredRoles = useMemo(() => {
    if (!roleSearch.trim()) return ALL_SWE_ROLES;
    const q = roleSearch.toLowerCase();
    return ALL_SWE_ROLES.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.targetFirms.toLowerCase().includes(q)
    );
  }, [roleSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim() || (isSignUp && !name.trim())) {
      setError("Please fill in all required fields!");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(
        {
          email,
          name: isSignUp ? name : (email.includes("@") ? email.split("@")[0] : "Candidate"),
          targetCareer: isSignUp ? selectedRole.title : "Quantitative Developer (C++ / HFT)",
          targetYear: isSignUp ? targetYear : "2027 (Internship)",
          cfHandle: isSignUp ? (cfHandleInput.trim() || "furlong") : "furlong",
          leetcodeHandle: isSignUp ? (lcHandleInput.trim() || "neal_wu") : "neal_wu",
          githubHandle: isSignUp ? (ghHandleInput.trim() || "torvalds") : "torvalds",
          initialScore: 0,
          token: "sb-auth-token-verified",
        },
        isSignUp
      );
    }, 500);
  };

  return (
    <div style={nbStyles.viewport}>
      <div style={{ ...nbStyles.bgCircle, ...nbStyles.blobPink }} />
      <div style={{ ...nbStyles.bgCircle, ...nbStyles.blobPurple }} />
      <div style={{ ...nbStyles.bgCircle, ...nbStyles.blobYellow }} />

      <div style={{ ...nbStyles.card, maxWidth: isSignUp ? "560px" : "440px" }}>
        <div style={nbStyles.header}>
          <div style={nbStyles.topLogoWrap}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M4 17L10 11L14 15L20 7" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="20" cy="7" r="3" fill="#000000" />
            </svg>
          </div>
          <h1 style={nbStyles.title}>SKILLBRIDGE</h1>
          <p style={nbStyles.subtitle}>
            {isSignUp ? "CREATE CANDIDATE ACCOUNT · CONNECT PROFILES" : "CAREER OS · ENTER COMMAND CENTER"}
          </p>
        </div>

        {error && <div style={nbStyles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={nbStyles.form}>
          {isSignUp && (
            <>
              <div style={nbStyles.inputGroup}>
                <label style={nbStyles.label}>Full Name *</label>
                <input
                  type="text"
                  placeholder="Alex Henderson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={nbStyles.input}
                  required
                />
              </div>

              <div style={nbStyles.inputGroup}>
                <label style={nbStyles.label}>
                  🎯 Target SWE / Quant Track ({ALL_SWE_ROLES.length} Specializations) *
                </label>

                <div
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  style={nbStyles.selectedRolePill}
                >
                  <div>
                    <div style={{ fontSize: "10px", fontWeight: "900", color: "#7c3aed" }}>
                      {selectedRole.category.toUpperCase()}
                    </div>
                    <div style={{ fontSize: "13px", fontWeight: "900", color: "#000000" }}>
                      {selectedRole.title}
                    </div>
                    <div style={{ fontSize: "10px", color: "#6b7280" }}>
                      Target: {selectedRole.targetFirms}
                    </div>
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: "900" }}>
                    {isRoleDropdownOpen ? "▲ Close" : "▼ Search / Change"}
                  </span>
                </div>

                {isRoleDropdownOpen && (
                  <div style={nbStyles.roleDropdownMenu}>
                    <input
                      type="text"
                      placeholder="🔍 Search roles (C++, HFT, Distributed, ML, Web3, iOS)..."
                      value={roleSearch}
                      onChange={(e) => setRoleSearch(e.target.value)}
                      style={nbStyles.roleSearchInput}
                      autoFocus
                    />

                    <div style={nbStyles.rolesScrollContainer}>
                      {filteredRoles.map((role) => (
                        <div
                          key={role.id}
                          onClick={() => {
                            setSelectedRole(role);
                            setIsRoleDropdownOpen(false);
                            setRoleSearch("");
                          }}
                          style={{
                            ...nbStyles.roleOptionItem,
                            backgroundColor: selectedRole.id === role.id ? "#ffea28" : "#ffffff",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "10px", fontWeight: "900", color: "#6b7280" }}>
                              {role.category}
                            </span>
                            {selectedRole.id === role.id && (
                              <span style={{ fontSize: "10px", fontWeight: "900", color: "#16a34a" }}>
                                ✓ SELECTED
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: "12px", fontWeight: "900", color: "#000000", marginTop: "2px" }}>
                            {role.title}
                          </div>
                          <div style={{ fontSize: "10px", color: "#4b5563" }}>
                            Firms: {role.targetFirms}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div style={nbStyles.handlesSection}>
                <div style={{ fontSize: "11px", fontWeight: "900", color: "#000000", marginBottom: "6px" }}>
                  🔗 CONNECT YOUR COMPETITIVE &amp; CODE PROFILES:
                </div>

                <div style={nbStyles.grid3}>
                  <div style={nbStyles.inputGroup}>
                    <label style={nbStyles.labelSmall}>Codeforces Handle</label>
                    <input
                      type="text"
                      placeholder="e.g. furlong"
                      value={cfHandleInput}
                      onChange={(e) => setCfHandleInput(e.target.value)}
                      style={nbStyles.inputSmall}
                    />
                  </div>

                  <div style={nbStyles.inputGroup}>
                    <label style={nbStyles.labelSmall}>LeetCode Handle</label>
                    <input
                      type="text"
                      placeholder="e.g. neal_wu"
                      value={lcHandleInput}
                      onChange={(e) => setLcHandleInput(e.target.value)}
                      style={nbStyles.inputSmall}
                    />
                  </div>

                  <div style={nbStyles.inputGroup}>
                    <label style={nbStyles.labelSmall}>GitHub Username</label>
                    <input
                      type="text"
                      placeholder="e.g. torvalds"
                      value={ghHandleInput}
                      onChange={(e) => setGhHandleInput(e.target.value)}
                      style={nbStyles.inputSmall}
                    />
                  </div>
                </div>
              </div>

              <div style={nbStyles.inputGroup}>
                <label style={nbStyles.label}>Target Batch / Cycle</label>
                <select
                  value={targetYear}
                  onChange={(e) => setTargetYear(e.target.value)}
                  style={nbStyles.select}
                >
                  <option value="2027 (Internship)">2027 (Summer Internship Target)</option>
                  <option value="2028 (Internship)">2028 (Summer Internship Target)</option>
                  <option value="2026 (Immediate / Full-time)">2026 (Immediate / New Grad)</option>
                  <option value="2030 (Long-Term Quant Career)">2030 (Long-Term Quant Career)</option>
                </select>
              </div>
            </>
          )}

          <div style={nbStyles.inputGroup}>
            <label style={nbStyles.label}>College / Personal Email *</label>
            <input
              type="email"
              placeholder="alex@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={nbStyles.input}
              required
            />
          </div>

          <div style={isSignUp ? nbStyles.grid2 : nbStyles.inputGroup}>
            <div style={nbStyles.inputGroup}>
              <label style={nbStyles.label}>Password *</label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={nbStyles.input}
                required
              />
            </div>

            {isSignUp && (
              <div style={nbStyles.inputGroup}>
                <label style={nbStyles.label}>Confirm Password *</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={nbStyles.input}
                  required
                />
              </div>
            )}
          </div>

          <button type="submit" style={nbStyles.submitButton} disabled={loading}>
            {loading ? "AUTHENTICATING..." : isSignUp ? "CONTINUE TO LOCATION & BRANCH SETUP ➔" : "ENTER COMMAND CENTER ⚡"}
          </button>
        </form>

        <div style={nbStyles.footerSection}>
          <span style={nbStyles.footerText}>
            {isSignUp ? "Already have an account?" : "New to SkillBridge?"}
          </span>
          <button
            type="button"
            onClick={() => {
              setError("");
              setIsSignUp(!isSignUp);
              setIsRoleDropdownOpen(false);
            }}
            style={nbStyles.switchButton}
          >
            {isSignUp ? "Log In here" : "Create Account & Enter Handles"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spiralSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const inlineLogoStyles = {
  introBadge: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    background: "#ffea28",
    border: "2px solid #000000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "2px 2px 0px #000000",
  },
  panelBadge: {
    width: "28px",
    height: "28px",
    borderRadius: "8px",
    background: "#ff3d9a",
    border: "1.5px solid #000000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

const nbStyles = {
  viewport: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f7f4ed",
    position: "relative",
    overflow: "hidden",
    padding: "20px",
    fontFamily: "'Space Grotesk', system-ui, sans-serif",
    color: "#111827",
  },
  bgCircle: {
    position: "absolute",
    borderRadius: "50%",
    pointerEvents: "none",
  },
  blobPink: {
    width: "260px",
    height: "260px",
    background: "#ff3d9a",
    top: "-50px",
    left: "-50px",
  },
  blobPurple: {
    width: "300px",
    height: "300px",
    background: "#8b5cf6",
    top: "-80px",
    right: "35%",
  },
  blobYellow: {
    width: "280px",
    height: "280px",
    background: "#ffde38",
    bottom: "-60px",
    left: "10%",
  },
  card: {
    width: "100%",
    backgroundColor: "#ffffff",
    border: "3px solid #000000",
    borderRadius: "20px",
    padding: "28px",
    boxShadow: "8px 8px 0px #000000",
    zIndex: 20,
    maxHeight: "92vh",
    overflowY: "auto",
  },
  header: {
    textAlign: "center",
    marginBottom: "14px",
  },
  topLogoWrap: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    background: "#ffea28",
    border: "2px solid #000000",
    boxShadow: "3px 3px 0px #000000",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "8px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "900",
    letterSpacing: "-0.5px",
    margin: "0 0 4px 0",
    color: "#000000",
  },
  subtitle: {
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1px",
    color: "#4b5563",
    margin: 0,
  },
  errorBox: {
    backgroundColor: "#fee2e2",
    border: "2px solid #ef4444",
    boxShadow: "3px 3px 0px #ef4444",
    color: "#991b1b",
    padding: "10px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "700",
    marginBottom: "14px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },
  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
    gap: "8px",
  },
  handlesSection: {
    backgroundColor: "#fdfbf7",
    border: "1.5px dashed #000000",
    borderRadius: "10px",
    padding: "10px 12px",
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
    color: "#111827",
  },
  labelSmall: {
    fontSize: "10px",
    fontWeight: "800",
    color: "#4b5563",
  },
  input: {
    backgroundColor: "#fdfbf7",
    border: "2px solid #000000",
    borderRadius: "10px",
    padding: "10px 12px",
    color: "#000000",
    fontSize: "13px",
    fontWeight: "600",
    outline: "none",
    boxShadow: "2px 2px 0px #000000",
  },
  inputSmall: {
    backgroundColor: "#ffffff",
    border: "1.5px solid #000000",
    borderRadius: "6px",
    padding: "6px 8px",
    color: "#000000",
    fontSize: "11px",
    fontWeight: "700",
    outline: "none",
  },
  select: {
    backgroundColor: "#fdfbf7",
    border: "2px solid #000000",
    borderRadius: "10px",
    padding: "10px 12px",
    color: "#000000",
    fontSize: "12px",
    fontWeight: "700",
    outline: "none",
    boxShadow: "2px 2px 0px #000000",
    cursor: "pointer",
  },
  selectedRolePill: {
    backgroundColor: "#fdfbf7",
    border: "2px solid #000000",
    borderRadius: "10px",
    padding: "10px 14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    boxShadow: "2px 2px 0px #000000",
  },
  roleDropdownMenu: {
    backgroundColor: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "12px",
    padding: "10px",
    boxShadow: "4px 4px 0px #000000",
    marginTop: "6px",
  },
  roleSearchInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "8px 12px",
    border: "2px solid #000000",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "700",
    backgroundColor: "#fef08a",
    outline: "none",
    marginBottom: "8px",
  },
  rolesScrollContainer: {
    maxHeight: "160px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  roleOptionItem: {
    border: "1.5px solid #000000",
    borderRadius: "8px",
    padding: "8px 10px",
    cursor: "pointer",
    transition: "background 0.1s ease",
  },
  submitButton: {
    marginTop: "6px",
    backgroundColor: "#000000",
    color: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "12px",
    padding: "13px",
    fontSize: "13px",
    fontWeight: "900",
    cursor: "pointer",
    boxShadow: "4px 4px 0px #ff3d9a",
  },
  footerSection: {
    marginTop: "16px",
    textAlign: "center",
    fontSize: "13px",
    fontWeight: "700",
  },
  footerText: {
    color: "#6b7280",
    marginRight: "6px",
  },
  switchButton: {
    background: "none",
    border: "none",
    color: "#000000",
    fontWeight: "900",
    textDecoration: "underline",
    cursor: "pointer",
    padding: 0,
  },
};

const spiralStyles = {
  container: {
    flex: 1,
    minHeight: "75vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
  },
  spiral: {
    width: "48px",
    height: "48px",
    border: "4px solid rgba(0, 0, 0, 0.1)",
    borderTop: "4px solid #ff3d9a",
    borderRight: "4px solid #ffea28",
    borderBottom: "4px solid #8b5cf6",
    borderRadius: "50%",
    animation: "spiralSpin 0.6s linear infinite",
  },
  text: {
    fontSize: "14px",
    fontWeight: "900",
    color: "#111827",
    fontFamily: "'Space Grotesk', system-ui, sans-serif",
  },
};

export default App;