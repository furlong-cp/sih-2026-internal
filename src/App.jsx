import { useEffect, useState, useMemo } from "react";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import JobsPage from "./pages/Jobs";
import ApplicationsPage from "./pages/Applications";
import AssessmentsPage from "./pages/Assessments";
import SkillProfilePage from "./pages/SkillProfile";
import ProjectsPage from "./pages/Projects";
import CareerCopilotPage from "./pages/CareerCopilot";

const USERS_STORAGE_KEY = "skillbridge-users";
const SESSION_STORAGE_KEY = "skillbridge-current-session";

/* ==========================================================================
   ACCOUNT STORAGE
   ========================================================================== */

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function readUsersStore() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeUsersStore(users) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch {
    // Ignore storage errors
  }
}

function getStoredUser(email) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) return null;

  const users = readUsersStore();
  return users[normalizedEmail] || null;
}

function saveStoredUser(email, data) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) return;

  const users = readUsersStore();

  users[normalizedEmail] = {
    ...data,
    email: normalizedEmail,
  };

  writeUsersStore(users);
}

function deleteStoredUser(email) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) return;

  const users = readUsersStore();
  delete users[normalizedEmail];

  writeUsersStore(users);
}

function saveCurrentSession(email) {
  try {
    localStorage.setItem(
      SESSION_STORAGE_KEY,
      normalizeEmail(email)
    );
  } catch {
    // Ignore storage errors
  }
}

function getCurrentSessionEmail() {
  try {
    return localStorage.getItem(SESSION_STORAGE_KEY);
  } catch {
    return null;
  }
}

function clearCurrentSession() {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}

/* ==========================================================================
   SCORE
   ========================================================================== */

function calculateStartingScore(user) {
  let score = 50;

  if (user.cfHandle) score += 15;
  if (user.leetcodeHandle) score += 15;
  if (user.githubHandle) score += 10;
  if (user.branch) score += 5;
  if (user.college) score += 5;

  return score;
}

/* ==========================================================================
   CAREER ROLES
   ========================================================================== */

const ALL_SWE_ROLES = [
  {
    id: "qdev",
    title: "Quantitative Developer (C++ / HFT)",
    category: "Quant & HFT",
    targetFirms: "Jane Street, Citadel, Tower, HRT",
  },
  {
    id: "qres",
    title: "Quantitative Researcher / Trader",
    category: "Quant & HFT",
    targetFirms: "Optiver, Two Sigma, Jump, DE Shaw",
  },
  {
    id: "fpga",
    title: "Low-Latency FPGA / Hardware Engineer",
    category: "Quant & HFT",
    targetFirms: "Citadel Securities, Optiver, HRT",
  },
  {
    id: "strat",
    title: "Quantitative Trading Strategist",
    category: "Quant & HFT",
    targetFirms: "Akuna Capital, DRW, IMC Trading",
  },
  {
    id: "sys",
    title: "Core Distributed Systems Engineer",
    category: "Systems & Backend",
    targetFirms: "Google, Meta, Databricks, AWS",
  },
  {
    id: "backend",
    title: "High-Throughput Backend Engineer (Go / Java)",
    category: "Systems & Backend",
    targetFirms: "Uber, Stripe, Salesforce, Netflix",
  },
  {
    id: "os_kernel",
    title: "Operating Systems & Linux Kernel Engineer",
    category: "Systems & Backend",
    targetFirms: "Apple, Red Hat, Meta, Cloudflare",
  },
  {
    id: "db_eng",
    title: "Database & Storage Engine Engineer",
    category: "Systems & Backend",
    targetFirms: "Snowflake, MongoDB, CockroachDB",
  },
  {
    id: "compiler",
    title: "Compiler Engineer (LLVM / Rust)",
    category: "Systems & Backend",
    targetFirms: "Apple, NVIDIA, Google, Jane Street",
  },
  {
    id: "ai_infra",
    title: "AI / HPC Infrastructure & CUDA Engineer",
    category: "AI & Machine Learning",
    targetFirms: "NVIDIA, OpenAI, Anthropic, Meta",
  },
  {
    id: "mle",
    title: "Machine Learning Engineer (NLP / LLMs)",
    category: "AI & Machine Learning",
    targetFirms: "Google DeepMind, Microsoft, Apple",
  },
  {
    id: "data_eng",
    title: "Distributed Data & Stream Processing Engineer",
    category: "AI & Machine Learning",
    targetFirms: "Databricks, Netflix, Spotify",
  },
  {
    id: "fullstack",
    title: "Full-Stack Product Engineer (React / Node / Go)",
    category: "Web & Product",
    targetFirms: "Airbnb, Vercel, Linear, Stripe",
  },
  {
    id: "frontend",
    title: "High-Performance Frontend Systems Engineer",
    category: "Web & Product",
    targetFirms: "Figma, Vercel, Canva, Meta",
  },
  {
    id: "mobile",
    title: "Mobile Systems Engineer (iOS / Android / Rust)",
    category: "Web & Product",
    targetFirms: "Apple, Uber, Duolingo, WhatsApp",
  },
  {
    id: "devops",
    title: "Site Reliability & Cloud Infrastructure Engineer",
    category: "Cloud & DevOps",
    targetFirms: "AWS, Cloudflare, Google Cloud",
  },
  {
    id: "sec_eng",
    title: "Security Systems & Cryptography Engineer",
    category: "Security & Web3",
    targetFirms: "Ethereum Foundation, Palantir, CrowdStrike",
  },
  {
    id: "web3_core",
    title: "Protocol / Smart Contract Core Engineer",
    category: "Security & Web3",
    targetFirms: "Polygon, Solana, Chainlink, Coinbase",
  },
];

/* ==========================================================================
   DEFAULT ACCOUNT DATA
   ========================================================================== */

function createNewUser({
  email,
  name,
  targetRole,
  targetYear,
  cfHandle,
  leetcodeHandle,
  githubHandle,
}) {
  return {
    email: normalizeEmail(email),
    name: name.trim(),

    targetCareer: targetRole,
    targetYear,

    cfHandle: cfHandle.trim(),
    leetcodeHandle: leetcodeHandle.trim(),
    githubHandle: githubHandle.trim(),

    college: "",
    branch: "",
    currentLocation: "",
    workLocation: "Singapore / Global Remote",

    initialScore: 0,
    skillScore: 0,
    applications: [],

    /* Used by Home / profile-related pages */
    profileData: {
      handle: cfHandle.trim() || "candidate",
      targetRole,
      targetFirm: "Jane Street / Citadel / Optiver",
      timeline: "Fall 2030 (Quant Entry)",
      college: "",
      tier: "Tier 1",
      degree: "",
      gpa: "0",
      assessmentsPassed: 0,
      projectsVerified: 0,
    },

    /* Future account-specific data can be added here */
    projects: [],
    assessmentHistory: [],
    messages: [],

    createdAt: new Date().toISOString(),
  };
}

/* ==========================================================================
   APP
   ========================================================================== */

function App() {
  const [loading, setLoading] = useState(true);

  const [authenticated, setAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [showOnboarding, setShowOnboarding] = useState(false);

  const [activeTab, setActiveTab] = useState("Home");
  const [tabLoading, setTabLoading] = useState(false);

  const [skillScore, setSkillScore] = useState(0);
  const [applications, setApplications] = useState([]);

  /* ------------------------------------------------------------------------
     INITIAL SESSION RESTORE
     ------------------------------------------------------------------------ */

  useEffect(() => {
    const timer = setTimeout(() => {
      const sessionEmail = getCurrentSessionEmail();

      if (sessionEmail) {
        const storedUser = getStoredUser(sessionEmail);

        if (storedUser) {
          setCurrentUser(storedUser);

          setSkillScore(
            storedUser.skillScore ??
              storedUser.initialScore ??
              0
          );

          setApplications(
            Array.isArray(storedUser.applications)
              ? storedUser.applications
              : []
          );

          setAuthenticated(true);

          /*
           * If the account was created but onboarding wasn't completed,
           * send it back to onboarding.
           */
          if (
            !storedUser.college ||
            !storedUser.branch ||
            !storedUser.currentLocation
          ) {
            setShowOnboarding(true);
          }
        } else {
          clearCurrentSession();
        }
      }

      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  /* ------------------------------------------------------------------------
     PERSIST CURRENT ACCOUNT
     ------------------------------------------------------------------------ */

  useEffect(() => {
    if (
      !authenticated ||
      !currentUser?.email ||
      showOnboarding
    ) {
      return;
    }

    const updatedUser = {
      ...currentUser,

      /*
       * These belong to THIS account only.
       */
      skillScore,
      applications,
    };

    saveStoredUser(currentUser.email, updatedUser);
  }, [
    authenticated,
    currentUser,
    skillScore,
    applications,
    showOnboarding,
  ]);

  /* ------------------------------------------------------------------------
     NAVIGATION
     ------------------------------------------------------------------------ */

  const handleNavigate = (tabName) => {
    if (tabName === activeTab && !tabLoading) return;

    setTabLoading(true);

    setTimeout(() => {
      setActiveTab(tabName);
      setTabLoading(false);
    }, 200);
  };

  /* ------------------------------------------------------------------------
     LOGOUT
     ------------------------------------------------------------------------ */

  const handleLogout = () => {
    clearCurrentSession();

    setAuthenticated(false);
    setCurrentUser(null);
    setShowOnboarding(false);

    setSkillScore(0);
    setApplications([]);

    setActiveTab("Home");
  };

  /* ------------------------------------------------------------------------
     SCORE UPDATE
     ------------------------------------------------------------------------ */

  const handleScoreUpdate = (delta) => {
    setSkillScore((prev) => {
      const nextScore = prev + delta;
      return nextScore;
    });
  };

  /* ------------------------------------------------------------------------
     APPLICATION STAGE
     ------------------------------------------------------------------------ */

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
          const nextIdx = Math.min(
            (app.currentStageIndex ?? 0) + 1,
            stageNames.length - 1
          );

          return {
            ...app,
            currentStageIndex: nextIdx,
            status:
              nextIdx === stageNames.length - 1
                ? "Offer Extended 🎉"
                : `${stageNames[nextIdx]} Active`,
          };
        }

        return app;
      })
    );
  };

  /* ------------------------------------------------------------------------
     ONBOARDING COMPLETE
     ------------------------------------------------------------------------ */

  const handleOnboardingComplete = (details) => {
    setCurrentUser((prev) => {
      if (!prev) return prev;

      const updatedUser = {
        ...prev,
        ...details,

        profileData: {
          ...(prev.profileData || {}),
          college: details.college,
          degree: details.branch,
          targetRole:
            prev.targetCareer ||
            prev.profileData?.targetRole ||
            "Quantitative Developer (C++ / HFT)",
        },
      };

      const startingScore =
        calculateStartingScore(updatedUser);

      updatedUser.skillScore = startingScore;
      updatedUser.initialScore = startingScore;

      updatedUser.applications =
        Array.isArray(prev.applications)
          ? prev.applications
          : [];

      /*
       * Save immediately to THIS user's email.
       */
      saveStoredUser(
        updatedUser.email,
        updatedUser
      );

      setSkillScore(startingScore);
      setApplications(updatedUser.applications);

      return updatedUser;
    });

    setShowOnboarding(false);
    setActiveTab("Home");
  };

  /* ------------------------------------------------------------------------
     RENDER
     ------------------------------------------------------------------------ */

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        fontFamily: "Verdana, Arial, sans-serif",
      }}
    >
      {loading && <LoadingScreen />}

      {!loading && !authenticated && (
        <LoginScreen
          onLoginSuccess={(user, isNewSignup) => {
            /*
             * IMPORTANT:
             * Every login loads data belonging specifically
             * to the authenticated email.
             */
            setCurrentUser(user);

            setSkillScore(
              isNewSignup
                ? 0
                : user.skillScore ??
                  user.initialScore ??
                  0
            );

            setApplications(
              isNewSignup
                ? []
                : Array.isArray(user.applications)
                ? user.applications
                : []
            );

            setAuthenticated(true);

            if (isNewSignup) {
              setShowOnboarding(true);
            } else {
              setShowOnboarding(false);
            }

            setActiveTab("Home");

            saveCurrentSession(user.email);
          }}
        />
      )}

      {!loading &&
        authenticated &&
        showOnboarding && (
          <OnboardingWizard
            user={currentUser}
            onComplete={handleOnboardingComplete}
          />
        )}

      {!loading &&
        authenticated &&
        !showOnboarding && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              minHeight: "100vh",
            }}
          >
            <Navbar
              user={currentUser}
              activeTab={activeTab}
              onTabSelect={handleNavigate}
              onLogout={handleLogout}
            />

            <div
              style={{
                flex: 1,
                width: "100%",
                backgroundColor: "#ffffff",
                padding: "12px 16px",
                boxSizing: "border-box",
              }}
            >
              {tabLoading ? (
                <div style={spiralStyles.container}>
                  <div style={spiralStyles.spiral} />
                  <div style={spiralStyles.text}>
                    Loading data...
                  </div>
                </div>
              ) : (
                <main style={{ width: "100%" }}>
                  {activeTab === "Home" && (
                    <Home
                      user={currentUser}
                      onNavigate={handleNavigate}
                      applicationsCount={
                        applications.length
                      }
                      score={skillScore}
                    />
                  )}

                  {activeTab === "Jobs" && (
                    <JobsPage
                      applications={applications}
                      onApplicationSubmit={(newApp) =>
                        setApplications((prev) => [
                          newApp,
                          ...prev,
                        ])
                      }
                      onAdvanceStage={
                        handleAdvanceStage
                      }
                    />
                  )}

                  {activeTab === "Applications" && (
                    <ApplicationsPage
                      applications={applications}
                      onAdvanceStage={
                        handleAdvanceStage
                      }
                      onExploreJobs={() =>
                        handleNavigate("Jobs")
                      }
                    />
                  )}

                  {activeTab === "Assessments" && (
                    <AssessmentsPage
                      score={skillScore}
                      onScoreUpdate={
                        handleScoreUpdate
                      }
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

                  {activeTab !== "Home" &&
                    activeTab !== "Jobs" &&
                    activeTab !== "Applications" &&
                    activeTab !== "Assessments" &&
                    activeTab !== "Skill Profile" &&
                    activeTab !== "Projects" &&
                    activeTab !== "Career Copilot" && (
                      <div
                        style={{
                          padding: "30px",
                          textAlign: "center",
                        }}
                      >
                        <h2>{activeTab} Module</h2>
                        <p
                          style={{
                            color: "#666666",
                          }}
                        >
                          This section is currently being
                          populated.
                        </p>
                      </div>
                    )}
                </main>
              )}
            </div>
          </div>
        )}
    </div>
  );
}

/* ==========================================================================
   LOADING SCREEN
   ========================================================================== */

function LoadingScreen() {
  return (
    <div style={cfLoadingStyles.container}>
      <div style={cfLoadingStyles.box}>
        <div style={cfLoadingStyles.headerBar}>
          Loading SkillBridge...
        </div>

        <div
          style={{
            padding: "20px",
            textAlign: "center",
            fontSize: "11px",
            color: "#333",
          }}
        >
          Synchronizing SkillBridge account...
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   LOGIN / SIGNUP
   ========================================================================== */

function LoginScreen({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [name, setName] = useState("");

  const [cfHandleInput, setCfHandleInput] =
    useState("");
  const [lcHandleInput, setLcHandleInput] =
    useState("");
  const [ghHandleInput, setGhHandleInput] =
    useState("");

  const [roleSearch, setRoleSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState(
    ALL_SWE_ROLES[0]
  );

  const [targetYear, setTargetYear] = useState(
    "2027 (Internship)"
  );

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] =
    useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredRoles = useMemo(() => {
    if (!roleSearch.trim()) {
      return ALL_SWE_ROLES;
    }

    const q = roleSearch.toLowerCase();

    return ALL_SWE_ROLES.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.targetFirms.toLowerCase().includes(q)
    );
  }, [roleSearch]);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");

    setCfHandleInput("");
    setLcHandleInput("");
    setGhHandleInput("");

    setRoleSearch("");
    setSelectedRole(ALL_SWE_ROLES[0]);
    setTargetYear("2027 (Internship)");
    setIsRoleDropdownOpen(false);
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const normalizedEmail =
      normalizeEmail(email);

    if (
      !normalizedEmail ||
      !password.trim() ||
      (isSignUp && !name.trim())
    ) {
      setError(
        "Please fill in all required fields!"
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (
      isSignUp &&
      password !== confirmPassword
    ) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      /* ================================================================
         SIGN UP
         ================================================================ */

      if (isSignUp) {
        const existingUser =
          getStoredUser(normalizedEmail);

        if (existingUser) {
          setError(
            "An account with this email already exists. Please login instead."
          );
          return;
        }

        const newUser = createNewUser({
          email: normalizedEmail,
          name,
          targetRole: selectedRole.title,
          targetYear,
          cfHandle: cfHandleInput,
          leetcodeHandle: lcHandleInput,
          githubHandle: ghHandleInput,
        });

        /*
         * Password is stored with the account for this
         * local/demo authentication system.
         */
        newUser.password = password;

        /*
         * Save account BEFORE logging in.
         */
        saveStoredUser(
          normalizedEmail,
          newUser
        );

        onLoginSuccess(newUser, true);

        return;
      }

      /* ================================================================
         LOGIN
         ================================================================ */

      const storedUser =
        getStoredUser(normalizedEmail);

      /*
       * NO MORE FALLBACK ACCOUNT.
       *
       * If the email doesn't exist, login fails.
       */
      if (!storedUser) {
        setError(
          "Account not found. Please create an account first."
        );
        return;
      }

      /*
       * Check the password belonging specifically
       * to this email.
       */
      if (storedUser.password !== password) {
        setError("Incorrect password.");
        return;
      }

      /*
       * Load ONLY this user's stored data.
       */
      onLoginSuccess(
        {
          ...storedUser,
          email: normalizedEmail,
        },
        false
      );
    }, 400);
  };

  return (
    <div style={cfLoginStyles.viewport}>
      <div
        style={{
          ...cfLoginStyles.card,
          maxWidth: isSignUp
            ? "520px"
            : "380px",
        }}
      >
        <div style={cfLoginStyles.header}>
          <strong>
            {isSignUp
              ? "Register on SkillBridge"
              : "Login to SkillBridge"}
          </strong>
        </div>

        {error && (
          <div style={cfLoginStyles.errorBox}>
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={cfLoginStyles.form}
        >
          {isSignUp && (
            <div style={cfLoginStyles.inputGroup}>
              <label style={cfLoginStyles.label}>
                Full Name *
              </label>

              <input
                type="text"
                placeholder="Alex Henderson"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                style={cfLoginStyles.input}
                required
              />
            </div>
          )}

          <div style={cfLoginStyles.inputGroup}>
            <label style={cfLoginStyles.label}>
              Email Address *
            </label>

            <input
              type="email"
              placeholder="candidate@skillbridge.io"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              style={cfLoginStyles.input}
              required
            />
          </div>

          <div style={cfLoginStyles.inputGroup}>
            <label style={cfLoginStyles.label}>
              Password *
            </label>

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              style={cfLoginStyles.input}
              required
            />
          </div>

          {isSignUp && (
            <>
              <div style={cfLoginStyles.inputGroup}>
                <label
                  style={cfLoginStyles.label}
                >
                  Confirm Password *
                </label>

                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  style={cfLoginStyles.input}
                  required
                />
              </div>

              <div
                style={cfLoginStyles.inputGroup}
              >
                <label
                  style={cfLoginStyles.label}
                >
                  Target Track / Role
                </label>

                <div
                  onClick={() =>
                    setIsRoleDropdownOpen(
                      !isRoleDropdownOpen
                    )
                  }
                  style={
                    cfLoginStyles.dropdownToggle
                  }
                >
                  <span
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    {selectedRole.title}
                  </span>

                  <span
                    style={{
                      fontSize: "10px",
                    }}
                  >
                    {isRoleDropdownOpen
                      ? "▲"
                      : "▼"}
                  </span>
                </div>

                {isRoleDropdownOpen && (
                  <div
                    style={
                      cfLoginStyles.dropdownMenu
                    }
                  >
                    <input
                      type="text"
                      placeholder="Filter roles..."
                      value={roleSearch}
                      onChange={(e) =>
                        setRoleSearch(
                          e.target.value
                        )
                      }
                      style={{
                        ...cfLoginStyles.input,
                        marginBottom: "4px",
                      }}
                      autoFocus
                    />

                    <div
                      style={{
                        maxHeight: "140px",
                        overflowY: "auto",
                        display: "flex",
                        flexDirection:
                          "column",
                        gap: "2px",
                      }}
                    >
                      {filteredRoles.map((r) => (
                        <div
                          key={r.id}
                          onClick={() => {
                            setSelectedRole(r);
                            setIsRoleDropdownOpen(
                              false
                            );
                          }}
                          style={{
                            padding:
                              "4px 6px",
                            fontSize: "11px",
                            cursor: "pointer",
                            backgroundColor:
                              selectedRole.id ===
                              r.id
                                ? "#e0e8f5"
                                : "#fff",
                          }}
                        >
                          <strong>
                            {r.title}
                          </strong>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "8px",
                }}
              >
                <div
                  style={
                    cfLoginStyles.inputGroup
                  }
                >
                  <label
                    style={
                      cfLoginStyles.label
                    }
                  >
                    Codeforces Handle
                  </label>

                  <input
                    type="text"
                    placeholder="tourist"
                    value={cfHandleInput}
                    onChange={(e) =>
                      setCfHandleInput(
                        e.target.value
                      )
                    }
                    style={
                      cfLoginStyles.input
                    }
                  />
                </div>

                <div
                  style={
                    cfLoginStyles.inputGroup
                  }
                >
                  <label
                    style={
                      cfLoginStyles.label
                    }
                  >
                    LeetCode Handle
                  </label>

                  <input
                    type="text"
                    placeholder="username"
                    value={lcHandleInput}
                    onChange={(e) =>
                      setLcHandleInput(
                        e.target.value
                      )
                    }
                    style={
                      cfLoginStyles.input
                    }
                  />
                </div>
              </div>

              <div
                style={
                  cfLoginStyles.inputGroup
                }
              >
                <label
                  style={cfLoginStyles.label}
                >
                  GitHub Handle
                </label>

                <input
                  type="text"
                  placeholder="username"
                  value={ghHandleInput}
                  onChange={(e) =>
                    setGhHandleInput(
                      e.target.value
                    )
                  }
                  style={cfLoginStyles.input}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            style={cfLoginStyles.submitBtn}
            disabled={loading}
          >
            {loading
              ? "Authenticating..."
              : isSignUp
              ? "Register"
              : "Login"}
          </button>
        </form>

        <div style={cfLoginStyles.switchRow}>
          <span
            style={{
              color: "#555555",
            }}
          >
            {isSignUp
              ? "Already have an account?"
              : "Not registered yet?"}
          </span>

          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              resetForm();
            }}
            style={cfLoginStyles.switchBtn}
          >
            {isSignUp
              ? "Login here"
              : "Create an account"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   ONBOARDING
   ========================================================================== */

function OnboardingWizard({
  user,
  onComplete,
}) {
  const [college, setCollege] = useState(
    user?.college || ""
  );

  const [branch, setBranch] = useState(
    user?.branch || ""
  );

  const [currentLocation, setCurrentLocation] =
    useState(user?.currentLocation || "");

  const [workLocation, setWorkLocation] =
    useState(
      user?.workLocation ||
        "Singapore / Global Remote"
    );

  const handleSubmit = (e) => {
    e.preventDefault();

    onComplete({
      college: college.trim(),
      branch: branch.trim(),
      currentLocation:
        currentLocation.trim(),
      workLocation,
    });
  };

  return (
    <div style={cfLoginStyles.viewport}>
      <div
        style={{
          ...cfLoginStyles.card,
          maxWidth: "460px",
        }}
      >
        <div style={cfLoginStyles.header}>
          <strong>
            COMPLETE YOUR PROFILE
          </strong>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "3px",
            }}
          >
            <label
              style={cfLoginStyles.label}
            >
              College / University *
            </label>

            <input
              type="text"
              value={college}
              onChange={(e) =>
                setCollege(e.target.value)
              }
              placeholder="e.g. NIT Warangal / IIT Guwahati"
              style={cfLoginStyles.input}
              required
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "3px",
            }}
          >
            <label
              style={cfLoginStyles.label}
            >
              Branch / Degree *
            </label>

            <input
              type="text"
              value={branch}
              onChange={(e) =>
                setBranch(e.target.value)
              }
              placeholder="e.g. Mathematics & Computing / DSAI"
              style={cfLoginStyles.input}
              required
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "3px",
            }}
          >
            <label
              style={cfLoginStyles.label}
            >
              Current City *
            </label>

            <input
              type="text"
              value={currentLocation}
              onChange={(e) =>
                setCurrentLocation(
                  e.target.value
                )
              }
              placeholder="e.g. Hyderabad"
              style={cfLoginStyles.input}
              required
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "3px",
            }}
          >
            <label
              style={cfLoginStyles.label}
            >
              Preferred Work Location
            </label>

            <input
              type="text"
              value={workLocation}
              onChange={(e) =>
                setWorkLocation(
                  e.target.value
                )
              }
              style={cfLoginStyles.input}
            />
          </div>

          <button
            type="submit"
            style={cfLoginStyles.submitBtn}
          >
            Save & Enter Command Center
          </button>
        </form>
      </div>
    </div>
  );
}

/* ==========================================================================
   LOADING STYLES
   ========================================================================== */

const cfLoadingStyles = {
  container: {
    position: "fixed",
    inset: 0,
    backgroundColor: "#f8f9fa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Verdana, Arial, sans-serif",
    zIndex: 99999,
  },

  box: {
    width: "360px",
    backgroundColor: "#ffffff",
    border: "1px solid #b0c4de",
    borderRadius: "4px",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.1)",
    overflow: "hidden",
  },

  headerBar: {
    backgroundColor: "#eaf2f8",
    color: "#1a2a3a",
    fontSize: "11px",
    fontWeight: "bold",
    padding: "6px 10px",
    borderBottom:
      "1px solid #c4d7ed",
  },
};

/* ==========================================================================
   LOGIN STYLES
   ========================================================================== */

const cfLoginStyles = {
  viewport: {
    width: "100vw",
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily:
      "Verdana, Arial, sans-serif",
    fontSize: "12px",
    padding: "20px",
    boxSizing: "border-box",
  },

  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #b0c4de",
    borderRadius: "4px",
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.1)",
    padding: "16px",
    width: "100%",
    boxSizing: "border-box",
  },

  header: {
    borderBottom:
      "1px solid #c4d7ed",
    padding: "6px 10px",
    marginBottom: "12px",
    backgroundColor: "#eaf2f8",
    borderRadius: "2px",
    fontSize: "11px",
    color: "#1a2a3a",
  },

  errorBox: {
    backgroundColor: "#ffdddd",
    color: "#990000",
    border:
      "1px solid #ff9999",
    padding: "6px 8px",
    borderRadius: "2px",
    fontSize: "11px",
    marginBottom: "10px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },

  label: {
    fontSize: "11px",
    fontWeight: "bold",
    color: "#333333",
  },

  input: {
    backgroundColor: "#ffffff",
    border: "1px solid #7f9db9",
    borderRadius: "2px",
    padding: "4px 6px",
    fontSize: "11px",
    outline: "none",
    boxSizing: "border-box",
  },

  dropdownToggle: {
    backgroundColor: "#ffffff",
    border: "1px solid #7f9db9",
    borderRadius: "2px",
    padding: "4px 6px",
    fontSize: "11px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  dropdownMenu: {
    backgroundColor: "#ffffff",
    border: "1px solid #7f9db9",
    borderRadius: "2px",
    padding: "6px",
    boxShadow:
      "0 2px 6px rgba(0,0,0,0.15)",
  },

  submitBtn: {
    marginTop: "6px",
    backgroundColor: "#eaf2f8",
    color: "#0000cc",
    border:
      "1px solid #bce8f1",
    borderRadius: "3px",
    padding: "6px 10px",
    fontSize: "11px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  switchRow: {
    marginTop: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "11px",
    borderTop:
      "1px solid #e2e8f0",
    paddingTop: "8px",
  },

  switchBtn: {
    background: "none",
    border: "none",
    color: "#0000cc",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "11px",
    textDecoration: "underline",
  },
};

/* ==========================================================================
   SPINNER
   ========================================================================== */

const spiralStyles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 0",
    gap: "10px",
  },

  spiral: {
    width: "24px",
    height: "24px",
    border: "2px solid #b0c4de",
    borderTop:
      "2px solid #0000cc",
    borderRadius: "50%",
    animation:
      "spiralSpin 0.8s linear infinite",
  },

  text: {
    fontSize: "11px",
    color: "#555555",
    fontFamily:
      "Verdana, Arial, sans-serif",
  },
};

export default App;