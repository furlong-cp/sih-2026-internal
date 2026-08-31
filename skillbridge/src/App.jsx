import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import JobsPage from "./pages/Jobs";
import ApplicationsPage from "./pages/Applications";
import AssessmentsPage from "./pages/Assessments";

function App() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Active view routing state
  const [activeTab, setActiveTab] = useState("Home");
  const [tabLoading, setTabLoading] = useState(false);

  // User SkillBridge Score State (dynamically updated by assessments)
  const [skillScore, setSkillScore] = useState(742);

  // Global shared applications state
  const [applications, setApplications] = useState([
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
        bonus: "Discretionary PnL Pool & Full-time PPO Fast-track",
      },
      currentStageIndex: 1,
      status: "OA Link Active (CoderPad)",
      matchScore: 96,
      companyStats: {
        headcount: "2,500+ Global",
        acceptanceRate: "0.8% Selection Rate",
        hiringPace: "Avg. 14 Days to Decision",
        primaryStack: "OCaml, Modern C++, Linux Kernel",
      },
      notes: "Verified Candidate Master (1942) Codeforces profile auto-attached.",
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
        bonus: "₹50–90 LPA Discretionary Performance Pool",
      },
      currentStageIndex: 2,
      status: "Round 1: Low-Latency C++ Scheduled",
      matchScore: 94,
      companyStats: {
        headcount: "4,000+ Worldwide",
        acceptanceRate: "1.2% Selection Rate",
        hiringPace: "Avg. 21 Days Pipeline",
        primaryStack: "C++20, DPDK, Solarflare OpenOnload, FPGA",
      },
      notes: "High match in C++ (94%) and Probability Systems.",
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
        bonus: "Alpha Sharing & Return Offer Priority",
      },
      currentStageIndex: 0,
      status: "Under Review by Campus Team",
      matchScore: 91,
      companyStats: {
        headcount: "1,200+ Engineers",
        acceptanceRate: "1.5% Selection Rate",
        hiringPace: "Avg. 18 Days Pipeline",
        primaryStack: "Modern C++, Distributed Memory, Python",
      },
      notes: "Order matching engine project repository verified.",
    },
  ]);

  const [cursor, setCursor] = useState({ x: -500, y: -500 });

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

      {/* Neo-Brutalist Login Screen */}
      {!loading && !authenticated && (
        <LoginScreen
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setAuthenticated(true);
          }}
        />
      )}

      {/* Authenticated Dashboard */}
      {!loading && authenticated && (
        <div className="app app-visible">
          <Navbar
            user={currentUser}
            activeTab={activeTab}
            onTabSelect={handleNavigate}
            onLogout={handleLogout}
          />

          <div className="app-body">
            <Sidebar
              activeTab={activeTab}
              onTabSelect={handleNavigate}
            />

            {/* Viewport Router */}
            {tabLoading ? (
              <div style={spiralStyles.container}>
                <div style={spiralStyles.spiral} />
                <div style={spiralStyles.text}>Syncing Command Center...</div>
              </div>
            ) : (
              <main style={{ flex: 1, width: "100%", overflowY: "auto" }}>
                {activeTab === "Home" && (
                  <Home user={currentUser} onNavigate={handleNavigate} />
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

                {/* Catch-all for unbuilt routes */}
                {activeTab !== "Home" &&
                  activeTab !== "Jobs" &&
                  activeTab !== "Applications" &&
                  activeTab !== "Assessments" && (
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

/* =========================================================
   FULL 7-SECOND LOADING SCREEN
========================================================= */
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

/* =========================================================
   NEO-BRUTALIST AUTH SCREEN
========================================================= */
function LoginScreen({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim() || (isSignUp && !name.trim())) {
      setError("Please fill in all fields!");
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
      onLoginSuccess({
        email,
        name: isSignUp ? name : email.split("@")[0],
        token: "sb-auth-token-verified",
      });
    }, 500);
  };

  return (
    <div style={nbStyles.viewport}>
      <div style={{ ...nbStyles.bgCircle, ...nbStyles.blobPink }} />
      <div style={{ ...nbStyles.bgCircle, ...nbStyles.blobPurple }} />
      <div style={{ ...nbStyles.bgCircle, ...nbStyles.blobYellow }} />

      <div style={nbStyles.card}>
        <div style={nbStyles.header}>
          <div style={nbStyles.topLogoWrap}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M4 17L10 11L14 15L20 7" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="20" cy="7" r="3" fill="#000000" />
            </svg>
          </div>
          <h1 style={nbStyles.title}>SKILLBRIDGE</h1>
          <p style={nbStyles.subtitle}>CAREER OS · BUILD · PROVE · CONNECT</p>
        </div>

        {error && <div style={nbStyles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={nbStyles.form}>
          {isSignUp && (
            <div style={nbStyles.inputGroup}>
              <label style={nbStyles.label}>Full Name</label>
              <input
                type="text"
                placeholder="Alex Henderson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={nbStyles.input}
                required
              />
            </div>
          )}

          <div style={nbStyles.inputGroup}>
            <label style={nbStyles.label}>College / Personal Email</label>
            <input
              type="email"
              placeholder="alex@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={nbStyles.input}
              required
            />
          </div>

          <div style={nbStyles.inputGroup}>
            <label style={nbStyles.label}>Password</label>
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
              <label style={nbStyles.label}>Confirm Password</label>
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

          <button type="submit" style={nbStyles.submitButton} disabled={loading}>
            {loading ? "AUTHENTICATING..." : isSignUp ? "JOIN THE NETWORK 🚀" : "ENTER COMMAND CENTER ⚡"}
          </button>
        </form>

        <div style={nbStyles.footerSection}>
          <span style={nbStyles.footerText}>
            {isSignUp ? "Already registered?" : "New to SkillBridge?"}
          </span>
          <button
            type="button"
            onClick={() => {
              setError("");
              setIsSignUp(!isSignUp);
            }}
            style={nbStyles.switchButton}
          >
            {isSignUp ? "Log In" : "Create an Account"}
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

/* Inline Badges */
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

/* Neo-Brutalist Layout Styles */
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
    padding: "24px",
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
    maxWidth: "440px",
    backgroundColor: "#ffffff",
    border: "3px solid #000000",
    borderRadius: "20px",
    padding: "36px 30px",
    boxShadow: "8px 8px 0px #000000",
    zIndex: 20,
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
  },
  topLogoWrap: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    background: "#ffea28",
    border: "2px solid #000000",
    boxShadow: "3px 3px 0px #000000",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "12px",
  },
  title: {
    fontSize: "26px",
    fontWeight: "900",
    letterSpacing: "-0.5px",
    margin: "0 0 4px 0",
    color: "#000000",
  },
  subtitle: {
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1.5px",
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
    marginBottom: "16px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    textAlign: "left",
  },
  label: {
    fontSize: "12px",
    fontWeight: "800",
    color: "#111827",
  },
  input: {
    backgroundColor: "#fdfbf7",
    border: "2px solid #000000",
    borderRadius: "10px",
    padding: "12px 14px",
    color: "#000000",
    fontSize: "14px",
    fontWeight: "600",
    outline: "none",
    boxShadow: "2px 2px 0px #000000",
  },
  submitButton: {
    marginTop: "8px",
    backgroundColor: "#000000",
    color: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "12px",
    padding: "14px",
    fontSize: "14px",
    fontWeight: "900",
    cursor: "pointer",
    boxShadow: "4px 4px 0px #ff3d9a",
  },
  footerSection: {
    marginTop: "20px",
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

/* Spiral Transition Styles */
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