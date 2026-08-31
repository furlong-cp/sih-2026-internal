import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";

function App() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [cursor, setCursor] = useState({
    x: -500,
    y: -500,
  });

  useEffect(() => {
    const moveCursor = (event) => {
      setCursor({
        x: event.clientX,
        y: event.clientY,
      });

      document.documentElement.style.setProperty(
        "--mouse-x",
        `${event.clientX}px`
      );

      document.documentElement.style.setProperty(
        "--mouse-y",
        `${event.clientY}px`
      );
    };

    window.addEventListener("mousemove", moveCursor);

    /* 7-second Intro Sequence */
    const timer = setTimeout(() => {
      setLoading(false);
    }, 7000);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      {/* =========================================
          GLOBAL BACKGROUND
      ========================================= */}
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

      {/* =========================================
          MULTICOLOR CURSOR
      ========================================= */}
      <div
        className="cursor-aura"
        style={{
          left: cursor.x,
          top: cursor.y,
        }}
      />
      <div
        className="cursor-core"
        style={{
          left: cursor.x,
          top: cursor.y,
        }}
      />

      {/* =========================================
          INTRO SCREEN
      ========================================= */}
      {loading && <LoadingScreen />}

      {/* =========================================
          AUTH & DASHBOARD SCREENS
      ========================================= */}
      {!loading && !authenticated && (
        <LoginScreen
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setAuthenticated(true);
          }}
        />
      )}

      {!loading && authenticated && (
        <div className="app app-visible">
          <Navbar user={currentUser} />
          <div className="app-body">
            <Sidebar />
            <Home user={currentUser} />
          </div>
        </div>
      )}
    </>
  );
}

/* =========================================================
   LOADING SCREEN (7-second Intro)
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
          <img src="/logo.svg" alt="SkillBridge" />
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
          <img src="/logo.svg" alt="SkillBridge" />
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
   NEO-BRUTALIST PASTEL AUTHENTICATION SCREEN
========================================================= */
function LoginScreen({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const ticker = [
    "🔥 QuantForge listed: ₹28 LPA Quant Dev Intern",
    "🚀 2.4M+ skills verified across India & Global",
    "💻 git commit -m 'fix: final_submission' 💀",
    "🎯 Bro just unlocked a 94% match at Vertex Labs",
  ];
  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % ticker.length);
    }, 2800);
    return () => clearInterval(t);
  }, [ticker.length]);

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
    }, 600);
  };

  return (
    <div style={nbStyles.viewport}>
      {/* Background Pastel Geometric Blobs */}
      <div style={{ ...nbStyles.bgCircle, ...nbStyles.blobPink }} />
      <div style={{ ...nbStyles.bgCircle, ...nbStyles.blobPurple }} />
      <div style={{ ...nbStyles.bgCircle, ...nbStyles.blobYellow }} />
      <div style={{ ...nbStyles.bgCircle, ...nbStyles.blobGreen }} />
      <div style={{ ...nbStyles.bgCircle, ...nbStyles.blobCyan }} />

      {/* Background Squiggles & Dot Patterns */}
      <div style={nbStyles.squiggle1}>〰〰〰</div>
      <div style={nbStyles.squiggle2}>〰〰</div>

      {/* Decorative Stickers & Floating Cards */}
      <div style={{ ...nbStyles.stickerCard, top: "8%", left: "5%", transform: "rotate(-4deg)" }}>
        <img
          src="https://images.unsplash.com/photo-1524293581917-878a6d017c71?auto=format&fit=crop&w=300&q=80"
          alt="Sydney"
          style={nbStyles.stickerImg}
        />
        <div style={nbStyles.stickerLabel}>🇦🇺 SYDNEY · Secured</div>
      </div>

      <div style={{ ...nbStyles.neoBadge, top: "12%", right: "6%", background: "#ff6ec7", transform: "rotate(3deg)" }}>
        <span style={{ fontSize: "18px" }}>🔥</span> POV: DSA FINALLY PAID OFF 😭
      </div>

      <div style={{ ...nbStyles.stickerCard, bottom: "10%", right: "5%", transform: "rotate(4deg)" }}>
        <img
          src="https://images.unsplash.com/photo-1517090504586-fde19ea6066f?auto=format&fit=crop&w=300&q=80"
          alt="Toronto"
          style={nbStyles.stickerImg}
        />
        <div style={nbStyles.stickerLabel}>🇨🇦 TORONTO · Backend SWE</div>
      </div>

      <div style={{ ...nbStyles.neoBadge, bottom: "12%", left: "6%", background: "#ffea28", transform: "rotate(-3deg)" }}>
        <span style={{ fontSize: "18px" }}>🚀</span> BRO GOT THE INTERNSHIP!
      </div>

      <div style={{ ...nbStyles.pillTag, top: "34%", left: "4%", background: "#a5f3fc" }}>
        💻 C++
      </div>
      <div style={{ ...nbStyles.pillTag, bottom: "34%", right: "4%", background: "#bbf7d0" }}>
        ☁️ REMOTE
      </div>

      {/* Main Neo-Brutalist Authentication Card */}
      <div style={nbStyles.card}>
        <div style={nbStyles.header}>
          <div style={nbStyles.topLogoWrap}>
            <img src="/logo.svg" alt="SkillBridge" style={{ width: "32px", height: "32px" }} />
          </div>
          <h1 style={nbStyles.title}>SKILLBRIDGE</h1>
          <p style={nbStyles.subtitle}>CAREER OS · BUILD · PROVE · CONNECT</p>
        </div>

        {/* Dynamic Activity Ticker */}
        <div style={nbStyles.tickerBar}>
          <span style={nbStyles.tickerDot} />
          <span style={nbStyles.tickerText}>{ticker[tickerIndex]}</span>
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
              placeholder="alex@college"
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

          <button
            type="submit"
            style={nbStyles.submitButton}
            disabled={loading}
          >
            {loading
              ? "AUTHENTICATING..."
              : isSignUp
              ? "JOIN THE NETWORK 🚀"
              : "ENTER SkillBridge ⚡"}
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
    </div>
  );
}

/* =========================================================
   NEO-BRUTALIST RETRO-POP STYLES
========================================================= */
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
    fontFamily: "'Space Grotesk', system-ui, -apple-system, sans-serif",
    color: "#111827",
  },
  bgCircle: {
    position: "absolute",
    borderRadius: "50%",
    pointerEvents: "none",
    zIndex: 1,
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
  blobGreen: {
    width: "240px",
    height: "240px",
    background: "#34d399",
    bottom: "-60px",
    right: "22%",
  },
  blobCyan: {
    width: "260px",
    height: "260px",
    background: "#38bdf8",
    bottom: "20%",
    right: "-70px",
  },
  squiggle1: {
    position: "absolute",
    top: "14%",
    left: "22%",
    fontSize: "34px",
    color: "#cbd5e1",
    letterSpacing: "4px",
    fontWeight: "bold",
    pointerEvents: "none",
  },
  squiggle2: {
    position: "absolute",
    bottom: "16%",
    right: "24%",
    fontSize: "30px",
    color: "#cbd5e1",
    letterSpacing: "4px",
    fontWeight: "bold",
    pointerEvents: "none",
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
    position: "relative",
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
  tickerBar: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    border: "2px solid #000000",
    boxShadow: "3px 3px 0px #000000",
    padding: "8px 12px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: "700",
    color: "#000000",
    marginBottom: "20px",
    overflow: "hidden",
  },
  tickerDot: {
    width: "8px",
    height: "8px",
    minWidth: "8px",
    borderRadius: "50%",
    backgroundColor: "#22c55e",
    marginRight: "8px",
  },
  tickerText: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
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
    letterSpacing: "0.5px",
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
    letterSpacing: "0.5px",
    cursor: "pointer",
    boxShadow: "4px 4px 0px #ff3d9a",
    transition: "transform 0.1s ease",
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
  stickerCard: {
    position: "absolute",
    backgroundColor: "#ffffff",
    border: "2.5px solid #000000",
    borderRadius: "14px",
    padding: "8px",
    boxShadow: "5px 5px 0px #000000",
    pointerEvents: "none",
    zIndex: 5,
    width: "140px",
  },
  stickerImg: {
    width: "100%",
    height: "90px",
    objectFit: "cover",
    borderRadius: "8px",
    border: "1.5px solid #000000",
    marginBottom: "6px",
  },
  stickerLabel: {
    fontSize: "11px",
    fontWeight: "800",
    color: "#000000",
    textAlign: "center",
  },
  neoBadge: {
    position: "absolute",
    border: "2.5px solid #000000",
    boxShadow: "5px 5px 0px #000000",
    borderRadius: "12px",
    padding: "10px 14px",
    fontWeight: "900",
    fontSize: "12px",
    color: "#000000",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    pointerEvents: "none",
    zIndex: 5,
  },
  pillTag: {
    position: "absolute",
    border: "2px solid #000000",
    boxShadow: "3px 3px 0px #000000",
    borderRadius: "20px",
    padding: "6px 14px",
    fontWeight: "800",
    fontSize: "12px",
    color: "#000000",
    pointerEvents: "none",
    zIndex: 5,
  },
};

export default App;