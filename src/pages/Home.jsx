import React, { useState, useEffect } from "react";

/* ==========================================================================
   DATA: QUOTES & TESTIMONIALS
   ========================================================================== */

const QUOTES = [
  {
    quote: "Talk is cheap. Show me the code.",
    author: "Linus Torvalds",
    tag: "SYSTEMS"
  },
  {
    quote:
      "In high-frequency trading and low-latency systems, nanoseconds are the new seconds.",
    author: "Jane Street Engineering",
    tag: "QUANT"
  },
  {
    quote: "First, solve the problem. Then, write the code.",
    author: "John Johnson",
    tag: "ALGORITHMS"
  },
  {
    quote: "Simplicity is prerequisite for reliability.",
    author: "Edsger W. Dijkstra",
    tag: "ARCHITECTURE"
  }
];

const TESTIMONIALS_DATA = [
  {
    name: "Rohan Verma",
    handle: "tourist_fan",
    rating: "2450 (Grandmaster)",
    firm: "Jane Street",
    color: "#ff8c00",
    quote:
      "Passing Codeforces Div. 1 rounds directly translates to clearing HFT quant architecture screens.",
    metrics: "120ns Tick-to-Trade"
  },
  {
    name: "Ananya Sharma",
    handle: "ecnerwala_dev",
    rating: "2610 (International Grandmaster)",
    firm: "Citadel",
    color: "#ff0000",
    quote:
      "The stochastic PDE and probability verification modules match actual HFT interview questions.",
    metrics: "Stochastics 88%"
  },
  {
    name: "Devansh Gupta",
    handle: "furlong",
    rating: "1980 (Candidate Master)",
    firm: "Tower Research",
    color: "#00a99d",
    quote:
      "Syncing my Codeforces rating gave me instant trust verification across all top prop desks.",
    metrics: "CF 1980 · 99% Winrate"
  },
  {
    name: "Kavya Ramesh",
    handle: "kavya_cxx",
    rating: "2200 (Master)",
    firm: "Google",
    color: "#aa00aa",
    quote:
      "My distributed Raft consensus project gave me a direct manager referral override at Google.",
    metrics: "Raft Consensus"
  },
  {
    name: "Arjun Mehta",
    handle: "optiver_hft",
    rating: "2350 (Grandmaster)",
    firm: "Optiver",
    firmColor: "#dc2626",
    color: "#ff8c00",
    quote:
      "SkillBridge's live recruiter radar connected me directly with hiring desks in London.",
    metrics: "OA Bypassed"
  },
  {
    name: "Priya Patel",
    handle: "hrt_optimizer",
    rating: "2150 (Master)",
    firm: "HRT",
    color: "#aa00aa",
    quote:
      "Hudson River Trading looks for obsessive optimizers. SkillBridge proved my hot loops.",
    metrics: "DPDK Bypass"
  },
  {
    name: "Siddharth Rao",
    handle: "spark_core",
    rating: "2050 (Master)",
    firm: "Databricks",
    color: "#aa00aa",
    quote:
      "Took the Apache Spark internal architecture assessment and got a direct recruiter ping.",
    metrics: "Spark Internals"
  },
  {
    name: "Neha Singh",
    handle: "snowflake_simd",
    rating: "1920 (Candidate Master)",
    firm: "Snowflake",
    color: "#00a99d",
    quote:
      "Snowflake’s vectorization interview is brutal. I practiced in the War Room until confident.",
    metrics: "SIMD AVX-512"
  },
  {
    name: "Wei Chen",
    handle: "jump_fpga",
    rating: "2400 (Grandmaster)",
    firm: "Jump Trading",
    color: "#ff8c00",
    quote:
      "Integrating my Verilog hardware benchmarks directly into SkillBridge got Jump's attention.",
    metrics: "Verilog · PCIe"
  },
  {
    name: "Aisha Khan",
    handle: "cuda_queen",
    rating: "2100 (Master)",
    firm: "NVIDIA",
    color: "#aa00aa",
    quote:
      "Wrote a custom CUDA kernel that outperformed cuBLAS by 2%. Natively verified.",
    metrics: "CUDA C++"
  },
  {
    name: "Liam O'Connor",
    handle: "twosigma_liam",
    rating: "2720 (Legendary Grandmaster)",
    firm: "Two Sigma",
    color: "#ff0000",
    quote:
      "Competitive programming verification proves algorithmic velocity. Skipped HackerRank.",
    metrics: "CF Grandmaster"
  },
  {
    name: "Zara Ibrahim",
    handle: "drw_quant",
    rating: "2280 (Master)",
    firm: "DRW",
    color: "#aa00aa",
    quote:
      "The Black-Scholes interactive simulation mapped my math directly to an executable graph.",
    metrics: "Stochastics 92%"
  },
  {
    name: "David Kim",
    handle: "imc_routing",
    rating: "1950 (Candidate Master)",
    firm: "IMC Trading",
    color: "#00a99d",
    quote:
      "SkillBridge translated my C++ systems knowledge into a universal Skill Score.",
    metrics: "SPSC Queues"
  },
  {
    name: "Sofia Rossi",
    handle: "meta_io",
    rating: "2120 (Master)",
    firm: "Meta",
    color: "#aa00aa",
    quote:
      "Passed the Linux IO tests and Meta's infrastructure team recruited me directly.",
    metrics: "io_uring · eBPF"
  },
  {
    name: "Omar Tariq",
    handle: "apple_llvm",
    rating: "2310 (Grandmaster)",
    firm: "Apple",
    color: "#ff8c00",
    quote:
      "Zero-Knowledge attestation let me prove my compiler pass efficiency secretly.",
    metrics: "LLVM IR"
  },
  {
    name: "Chloe Chen",
    handle: "kafka_stream",
    rating: "1850 (Expert)",
    firm: "Confluent",
    firmColor: "#0284c7",
    color: "#03a89e",
    quote:
      "Confluent requires deep Kafka internals knowledge. The targeted assessment closed my gaps.",
    metrics: "Event Streaming"
  },
  {
    name: "Daniel Silva",
    handle: "paradigm_evm",
    rating: "2490 (Grandmaster)",
    firm: "Paradigm",
    color: "#ff8c00",
    quote:
      "Paradigm recruited me through the Blind Talent Auction using only my Rust EVM telemetry.",
    metrics: "Rust EVM"
  },
  {
    name: "Fatima Noor",
    handle: "deshaw_ts",
    rating: "2180 (Master)",
    firm: "DE Shaw",
    color: "#aa00aa",
    quote:
      "Ranked in the Top 2% on the Global Leaderboard. DE Shaw reached out the next morning.",
    metrics: "Time-Series"
  },
  {
    name: "Julian Brooks",
    handle: "akuna_cpp",
    rating: "2010 (Master)",
    firm: "Akuna Capital",
    color: "#aa00aa",
    quote:
      "Bypassed the HackerRank because of my verified C++ memory models badge.",
    metrics: "Memory Models"
  },
  {
    name: "Nina Pavlovic",
    handle: "cloudflare_ebpf",
    rating: "2250 (Master)",
    firm: "Cloudflare",
    color: "#aa00aa",
    quote:
      "Ran raw eBPF networking scripts and had SkillBridge cryptographically attest packet rates.",
    metrics: "XDP / eBPF"
  }
];

/* ==========================================================================
   ROLE → TARGET FIRMS
   ========================================================================== */

const ROLE_FIRMS = {
  "Quantitative Developer (C++ / HFT)":
    "Jane Street / Citadel / Optiver",

  "Quantitative Researcher / Trader":
    "Optiver / Two Sigma / Jump Trading",

  "Low-Latency FPGA / Hardware Engineer":
    "Citadel Securities / Optiver / HRT",

  "Quantitative Trading Strategist":
    "Akuna Capital / DRW / IMC Trading",

  "Core Distributed Systems Engineer":
    "Google / Meta / Databricks",

  "High-Throughput Backend Engineer (Go / Java)":
    "Uber / Stripe / Netflix",

  "Operating Systems & Linux Kernel Engineer":
    "Apple / Red Hat / Meta",

  "Database & Storage Engine Engineer":
    "Snowflake / MongoDB / CockroachDB",

  "Compiler Engineer (LLVM / Rust)":
    "Apple / NVIDIA / Google",

  "AI / HPC Infrastructure & CUDA Engineer":
    "NVIDIA / OpenAI / Anthropic",

  "Machine Learning Engineer (NLP / LLMs)":
    "Google DeepMind / Microsoft / Apple",

  "Distributed Data & Stream Processing Engineer":
    "Databricks / Netflix / Spotify",

  "Full-Stack Product Engineer (React / Node / Go)":
    "Airbnb / Vercel / Stripe",

  "High-Performance Frontend Systems Engineer":
    "Figma / Vercel / Meta",

  "Mobile Systems Engineer (iOS / Android / Rust)":
    "Apple / Uber / WhatsApp",

  "Site Reliability & Cloud Infrastructure Engineer":
    "AWS / Cloudflare / Google Cloud",

  "Security Systems & Cryptography Engineer":
    "Palantir / CrowdStrike / Ethereum",

  "Protocol / Smart Contract Core Engineer":
    "Polygon / Solana / Chainlink"
};

/* ==========================================================================
   ACCOUNT HELPERS
   ========================================================================== */

const USERS_STORAGE_KEY = "skillbridge-users";

function normalizeEmail(email) {
  return (email || "").trim().toLowerCase();
}

function getStoredUser(email) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) return null;

  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);

    if (!raw) return null;

    const users = JSON.parse(raw);

    return users[normalizedEmail] || null;
  } catch {
    return null;
  }
}

function saveStoredUser(email, data) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) return;

  try {
    const raw =
      localStorage.getItem(USERS_STORAGE_KEY);

    const users = raw ? JSON.parse(raw) : {};

    users[normalizedEmail] = {
      ...(users[normalizedEmail] || {}),
      ...data,
      email: normalizedEmail
    };

    localStorage.setItem(
      USERS_STORAGE_KEY,
      JSON.stringify(users)
    );
  } catch {
    // Ignore storage errors
  }
}

/* ==========================================================================
   BUILD PROFILE FROM LOGGED-IN USER
   ========================================================================== */

function buildProfileData(user) {
  const targetRole =
    user?.targetCareer ||
    user?.profileData?.targetRole ||
    "Not selected";

  const targetFirm =
    ROLE_FIRMS[targetRole] ||
    user?.profileData?.targetFirm ||
    "Target firms not configured";

  const college =
    user?.college ||
    user?.profileData?.college ||
    "College not added";

  const degree =
    user?.branch ||
    user?.profileData?.degree ||
    "Degree not added";

  const timeline =
    user?.targetYear ||
    user?.profileData?.timeline ||
    "Timeline not configured";

  const handle =
    user?.cfHandle ||
    user?.profileData?.handle ||
    user?.name ||
    "candidate";

  return {
    handle,
    targetRole,
    targetFirm,
    timeline,
    college,
    tier:
      user?.profileData?.tier ||
      "Tier 1",
    degree,
    gpa:
      user?.profileData?.gpa ||
      "0",
    assessmentsPassed:
      user?.profileData?.assessmentsPassed ||
      0,
    projectsVerified:
      user?.profileData?.projectsVerified ||
      0
  };
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */

export default function Home({
  user,
  score = 0,
  applicationsCount = 0,
  onNavigate
}) {
  const [quoteIdx, setQuoteIdx] = useState(0);

  const [isProfileModalOpen, setIsProfileModalOpen] =
    useState(false);

  const [isSuperdayModalOpen, setIsSuperdayModalOpen] =
    useState(false);

  /*
   * IMPORTANT:
   * This is now initialized from THE CURRENT USER.
   *
   * Account A gets Account A's information.
   * Account B gets Account B's information.
   */
  const [profileData, setProfileData] = useState(() =>
    buildProfileData(user)
  );

  /*
   * If the logged-in account changes, reload its profile.
   */
  useEffect(() => {
    setProfileData(buildProfileData(user));
  }, [user?.email]);

  const currentQuote =
    QUOTES[quoteIdx] || QUOTES[0];

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIdx(
        (prev) => (prev + 1) % QUOTES.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  /* ==========================================================================
     PROFILE STRENGTH
     ========================================================================== */

  const calculateProfileStrength = () => {
    let strength = 0;

    if (
      profileData.tier ===
      "Elite (Stanford/MIT)"
    ) {
      strength += 15;
    } else if (
      profileData.tier === "Tier 1"
    ) {
      strength += 10;
    } else if (
      profileData.tier === "Tier 2"
    ) {
      strength += 5;
    } else {
      strength += 2;
    }

    const gpaVal =
      parseFloat(profileData.gpa) || 0;

    if (gpaVal >= 9.5) {
      strength += 5;
    } else if (gpaVal >= 8.5) {
      strength += 3;
    } else if (gpaVal >= 7.5) {
      strength += 1;
    }

    strength += Math.min(
      profileData.assessmentsPassed * 8,
      40
    );

    strength += Math.min(
      profileData.projectsVerified * 10,
      40
    );

    return Math.min(strength, 100);
  };

  const profileStrength =
    calculateProfileStrength();

  const displayScore =
    score > 0
      ? score
      : 350 +
        profileData.assessmentsPassed * 85 +
        profileData.projectsVerified * 110;

  /* ==========================================================================
     GROWTH GRAPH
     ========================================================================== */

  const rawGrowthData = [
    { label: "W1", score: 210 },
    { label: "W2", score: 285 },
    { label: "W3", score: 255 },
    { label: "W4", score: 390 },
    { label: "W5", score: 350 },
    {
      label: "Now",
      score: Math.max(
        350,
        Math.min(displayScore, 742)
      )
    }
  ];

  const graphMin = 180;
  const graphMax = 780;

  const graphX = [
    25,
    84,
    143,
    202,
    261,
    320
  ];

  const growthCurvePoints =
    rawGrowthData.map(
      (point, index) => {
        const normalized =
          (point.score - graphMin) /
          (graphMax - graphMin);

        const y =
          138 - normalized * 108;

        return {
          ...point,
          x: graphX[index],
          y: Math.max(
            25,
            Math.min(138, y)
          )
        };
      }
    );

  const polylineStr =
    growthCurvePoints
      .map(
        (p) => `${p.x},${p.y}`
      )
      .join(" ");

  const areaPolygonStr =
    `25,145 ${polylineStr} 320,145`;

  const totalGrowth = Math.max(
    0,
    rawGrowthData[
      rawGrowthData.length - 1
    ].score -
      rawGrowthData[0].score
  );

  /* ==========================================================================
     SAVE PROFILE
     ========================================================================== */

  const handleSaveProfile = (e) => {
    e.preventDefault();

    /*
     * Save the edited profile back to THIS user's
     * localStorage record.
     *
     * This is important because otherwise changing
     * Account A's settings would disappear after reload.
     */
    if (user?.email) {
      const existingUser =
        getStoredUser(user.email);

      saveStoredUser(user.email, {
        ...existingUser,
        profileData: {
          ...(existingUser?.profileData || {}),
          ...profileData
        }
      });
    }

    setIsProfileModalOpen(false);
  };

  return (
    <div style={cfStyles.container}>

      {/* ======================================================================
         TOP NAV
         ====================================================================== */}

      <div style={cfStyles.cfSubNav}>
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap"
          }}
        >
          <span
            style={{
              fontWeight: "bold",
              color: "#3b5998",
              fontSize: "13px"
            }}
          >
            SkillBridge OS
          </span>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            fontSize: "12px"
          }}
        >
          <button
            onClick={() =>
              setIsProfileModalOpen(true)
            }
            style={cfStyles.smallTextBtn}
          >
            Settings ⚙️
          </button>
        </div>
      </div>

      {/* ======================================================================
         HERO BANNER
         ====================================================================== */}

      <div style={cfStyles.heroCard}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "18px"
          }}
        >
          <div
            style={{
              flex: 1,
              minWidth: "320px"
            }}
          >

            <div style={cfStyles.badgeRow}>
              <span
                style={
                  cfStyles.cfHandleBadge
                }
              >
                <span
                  style={{
                    color: "#00a99d",
                    fontWeight: "bold"
                  }}
                >
                  TARGET:
                </span>{" "}
                {profileData.targetRole}
              </span>

              <span
                style={cfStyles.cfRealName}
              >
                ({profileData.degree} —{" "}
                {profileData.college})
              </span>
            </div>

            <div
              style={{
                margin: "8px 0",
                fontSize: "12px",
                color: "#333"
              }}
            >
              <span>
                Target Firms:{" "}
                <strong
                  style={{
                    color: "#3b5998"
                  }}
                >
                  {profileData.targetFirm}
                </strong>
              </span>

              <span
                style={{
                  margin: "0 8px",
                  color: "#ccc"
                }}
              >
                |
              </span>

              <span>
                Execution Timeline:{" "}
                <strong
                  style={{
                    color: "#aa00aa"
                  }}
                >
                  {profileData.timeline}
                </strong>
              </span>

              <span
                style={{
                  margin: "0 8px",
                  color: "#ccc"
                }}
              >
                |
              </span>

              <span>
                Readiness Multiplier:{" "}
                <strong
                  style={{
                    color: "green"
                  }}
                >
                  {profileStrength}%
                </strong>
              </span>
            </div>

            {/* Quote */}

            <div style={cfStyles.quoteBox}>
              <div
                style={{
                  fontSize: "20px",
                  color: "#00a99d",
                  lineHeight: 1
                }}
              >
                “
              </div>

              <div
                style={{
                  flex: 1
                }}
              >
                <p
                  style={
                    cfStyles.quoteText
                  }
                >
                  {currentQuote.quote}
                </p>

                <div
                  style={
                    cfStyles.quoteAuthor
                  }
                >
                  —{" "}
                  <strong>
                    {currentQuote.author}
                  </strong>{" "}
                  [{currentQuote.tag}]
                </div>
              </div>
            </div>
          </div>

          {/* Recruiter Radar */}

          <div
            style={
              cfStyles.fastTrackStatusBadge
            }
            onClick={() =>
              setIsSuperdayModalOpen(true)
            }
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                gap: "10px"
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "bold",
                  color: "#00a99d"
                }}
              >
                RECRUITER RADAR
              </span>

              <span
                style={
                  cfStyles.superdayPill
                }
              >
                SUPERDAY ⚡
              </span>
            </div>

            <div
              style={{
                fontSize: "13px",
                fontWeight: "bold",
                color: "#000",
                marginTop: "4px"
              }}
            >
              {profileStrength >= 80
                ? "Top 4.2% · Direct OA Bypass"
                : "Target readiness locked"}
            </div>

            <div
              style={{
                fontSize: "11px",
                color: "#00a99d",
                fontWeight: "bold",
                marginTop: "2px",
                textDecoration:
                  "underline"
              }}
            >
              View firm interview
              invitations ➔
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================================
         CAREER METRICS TABLE
         ====================================================================== */}

      <div
        style={
          cfStyles.metricsTableWrapper
        }
      >
        <div
          style={
            cfStyles.cfTableHeader
          }
        >
          <span>#</span>
          <span>
            CAREER METRIC INDEX
          </span>
          <span>CATEGORY</span>
          <span>SCORE / VALUE</span>
          <span>
            STATUS / ACTIONS
          </span>
        </div>

        {[
          {
            id: "1",
            title: "Skill Score",
            category: "INDEX",
            val: displayScore,
            status:
              profileStrength >= 80
                ? "Elite Tier"
                : "Growing",
            nav: "Assessments"
          },
          {
            id: "2",
            title: "Profile Strength",
            category: "READINESS",
            val: `${profileStrength}%`,
            status: `${100 - profileStrength}% gap`,
            nav: "Skill Profile"
          },
          {
            id: "3",
            title: "Verified Skills",
            category: "ATTESTED PROOF",
            val:
              profileData.assessmentsPassed +
              profileData.projectsVerified,
            status: "Passed",
            nav: "Skill Profile"
          },
          {
            id: "4",
            title: "Job Matches",
            category: "RECRUITER RADAR",
            val:
              profileStrength >= 80
                ? "24"
                : "2",
            status:
              profileStrength >= 80
                ? "High Match"
                : "Low Match",
            nav: "Jobs"
          },
          {
            id: "5",
            title: "Benchmarked Repos",
            category: "SOFTWARE",
            val:
              profileData.projectsVerified,
            status: "Zero-Heap",
            nav: "Projects"
          }
        ].map((c, i) => (
          <div
            key={i}
            style={{
              ...cfStyles.cfTableRow,
              backgroundColor:
                i % 2 === 0
                  ? "#fff"
                  : "#fcfcfc"
            }}
          >
            <span
              style={{
                color: "#888",
                fontWeight: "bold"
              }}
            >
              {c.id}
            </span>

            <span
              style={{
                fontWeight: "bold",
                color: "#3b5998"
              }}
            >
              {c.title}
            </span>

            <span
              style={{
                fontSize: "11px",
                color: "#666"
              }}
            >
              {c.category}
            </span>

            <span
              style={{
                fontWeight: "bold",
                color: "#00a99d"
              }}
            >
              {c.val}
            </span>

            <span>
              <button
                onClick={() =>
                  onNavigate &&
                  onNavigate(c.nav)
                }
                style={
                  cfStyles.cfTableActionBtn
                }
              >
                {c.status} →
              </button>
            </span>
          </div>
        ))}
      </div>

      {/* ======================================================================
         GROWTH CURVE
         ====================================================================== */}

      <div
        style={{
          ...cfStyles.growthSectionGrid,
          gridTemplateColumns: "1fr"
        }}
      >
        <div
          style={
            cfStyles.growthCurveCard
          }
        >
          <div
            style={cfStyles.cardTitleRow}
          >
            <div>
              <span
                style={
                  cfStyles.subHeadingTag
                }
              >
                SKILL INDEX PROGRESSION
              </span>
            </div>

            <span
              style={cfStyles.badgeGreen}
            >
              +{totalGrowth} pts total
            </span>
          </div>

          <div
            style={
              cfStyles.growthSvgWrapper
            }
          >
            <svg
              viewBox="0 0 340 170"
              style={{
                width: "100%",
                height: "230px",
                overflow: "visible"
              }}
            >
              <defs>
                <linearGradient
                  id="scoreAreaGrad"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#00a99d"
                    stopOpacity="0.18"
                  />

                  <stop
                    offset="100%"
                    stopColor="#00a99d"
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>

              {[30, 65, 100, 135].map(
                (y, idx) => (
                  <line
                    key={idx}
                    x1="25"
                    y1={y}
                    x2="320"
                    y2={y}
                    stroke="#e5e5e5"
                    strokeDasharray="3,3"
                  />
                )
              )}

              <polygon
                points={areaPolygonStr}
                fill="url(#scoreAreaGrad)"
              />

              <polyline
                points={polylineStr}
                fill="none"
                stroke="#00a99d"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {growthCurvePoints.map(
                (pt, idx) => (
                  <g key={idx}>
                    <text
                      x={pt.x}
                      y={pt.y - 10}
                      textAnchor="middle"
                      fontSize="8"
                      fontWeight="bold"
                      fill="#555"
                    >
                      {pt.score}
                    </text>

                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="5"
                      fill="#fff"
                      stroke="#00a99d"
                      strokeWidth="2.5"
                    />

                    <text
                      x={pt.x}
                      y="158"
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="bold"
                      fill="#777"
                    >
                      {pt.label}
                    </text>
                  </g>
                )
              )}
            </svg>
          </div>

          <div
            style={cfStyles.graphFooter}
          >
            <span>
              <strong>W1</strong>{" "}
              Starting baseline
            </span>

            <span
              style={{
                color: "#16a34a",
                fontWeight: "bold"
              }}
            >
              ↗ Growth
            </span>

            <span
              style={{
                color: "#dc2626",
                fontWeight: "bold"
              }}
            >
              ↘ Correction
            </span>

            <span>
              <strong>Now</strong>{" "}
              Current readiness
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================================
         TESTIMONIALS
         ====================================================================== */}

      <div
        style={
          cfStyles.testimonialsSection
        }
      >
        <div
          style={{
            padding:
              "0 16px 12px 16px",
            borderBottom:
              "1px solid #e5e5e5",
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center"
          }}
        >
          <div>
            <span
              style={{
                fontSize: "11px",
                fontWeight: "bold",
                color: "#3b5998"
              }}
            >
              RECRUITER VERIFICATIONS
            </span>

            <h3
              style={{
                margin:
                  "2px 0 0 0",
                fontSize: "15px",
                fontWeight: "bold"
              }}
            >
              Recent Candidate
              Placements at Elite
              Firms
            </h3>
          </div>

          <span
            style={{
              fontSize: "11px",
              color: "#666"
            }}
          >
            Showing 20+ verified
            engineers
          </span>
        </div>

        <div
          style={cfStyles.marqueeOuter}
        >
          <div
            style={
              cfStyles.marqueeTrack
            }
          >
            {[
              ...TESTIMONIALS_DATA,
              ...TESTIMONIALS_DATA
            ].map((t, idx) => (
              <div
                key={idx}
                style={
                  cfStyles.testimonialCard
                }
              >
                <div
                  style={{
                    backgroundColor:
                      "#f8f9fa",
                    padding:
                      "8px 10px",
                    borderBottom:
                      "1px solid #e5e5e5",
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "center"
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "bold",
                      color:
                        t.color ||
                        "#3b5998"
                    }}
                  >
                    {t.handle}
                  </span>

                  <span
                    style={{
                      fontSize: "9px",
                      backgroundColor:
                        "#e0f2fe",
                      color: "#0369a1",
                      padding:
                        "1px 4px",
                      borderRadius:
                        "3px",
                      fontWeight:
                        "bold"
                    }}
                  >
                    {t.rating}
                  </span>
                </div>

                <div
                  style={{
                    padding: "10px",
                    display: "flex",
                    flexDirection:
                      "column",
                    justifyContent:
                      "space-between",
                    flex: 1
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize:
                          "10px",
                        fontWeight:
                          "bold",
                        color: "#222",
                        marginBottom:
                          "4px"
                      }}
                    >
                      🏢 Hired @{" "}
                      <span
                        style={{
                          color:
                            "#00a99d"
                        }}
                      >
                        {t.firm}
                      </span>
                    </div>

                    <p
                      style={{
                        margin: 0,
                        fontSize:
                          "11px",
                        color: "#444",
                        lineHeight:
                          "1.3",
                        fontStyle:
                          "italic"
                      }}
                    >
                      "{t.quote}"
                    </p>
                  </div>

                  <div
                    style={{
                      marginTop:
                        "8px",
                      paddingTop:
                        "6px",
                      borderTop:
                        "1px dashed #e5e5e5",
                      fontSize:
                        "10px",
                      fontWeight:
                        "bold",
                      color:
                        "#16a34a"
                    }}
                  >
                    ✓ {t.metrics}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ======================================================================
         SUPERDAY MODAL
         ====================================================================== */}

      {isSuperdayModalOpen && (
        <div
          style={
            modalStyles.overlay
          }
          onClick={() =>
            setIsSuperdayModalOpen(
              false
            )
          }
        >
          <div
            style={modalStyles.card}
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div
              style={modalStyles.header}
            >
              <div>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight:
                      "bold",
                    color:
                      "#00a99d"
                  }}
                >
                  FAST-PASS RECRUITER
                  CLEARANCE
                </span>

                <h2
                  style={{
                    margin:
                      "2px 0 0 0",
                    fontSize:
                      "16px",
                    fontWeight:
                      "bold"
                  }}
                >
                  Active Superday
                  Radar
                </h2>
              </div>

              <button
                onClick={() =>
                  setIsSuperdayModalOpen(
                    false
                  )
                }
                style={
                  modalStyles.closeBtn
                }
              >
                ✕
              </button>
            </div>

            {profileStrength >= 80 ? (
              <div
                style={{
                  display:
                    "flex",
                  flexDirection:
                    "column",
                  gap: "10px",
                  margin:
                    "14px 0"
                }}
              >
                <div
                  style={{
                    backgroundColor:
                      "#f8f9fa",
                    border:
                      "1px solid #d5d5d5",
                    borderRadius:
                      "4px",
                    padding:
                      "10px 12px"
                  }}
                >
                  <div
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between"
                    }}
                  >
                    <strong>
                      {profileData.targetFirm}
                    </strong>

                    <span
                      style={{
                        backgroundColor:
                          "#bbf7d0",
                        color:
                          "#166534",
                        borderRadius:
                          "3px",
                        padding:
                          "1px 4px",
                        fontSize:
                          "9px",
                        fontWeight:
                          "bold"
                      }}
                    >
                      OA Bypassed
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize:
                        "11px",
                      color:
                        "#666",
                      marginTop:
                        "4px"
                    }}
                  >
                    {profileData.targetRole}
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  padding:
                    "15px",
                  textAlign:
                    "center",
                  border:
                    "1px solid #f87171",
                  borderRadius:
                    "4px",
                  backgroundColor:
                    "#fef2f2",
                  color:
                    "#991b1b",
                  margin:
                    "14px 0"
                }}
              >
                <strong>
                  Readiness Threshold
                  Locked
                </strong>

                <p
                  style={{
                    fontSize:
                      "11px",
                    margin:
                      "4px 0 0 0"
                  }}
                >
                  You must reach at
                  least 80% multiplier
                  to bypass standard
                  ATS queues and access
                  direct superdays.
                </p>
              </div>
            )}

            <button
              onClick={() => {
                setIsSuperdayModalOpen(
                  false
                );

                if (onNavigate) {
                  onNavigate(
                    "Messages"
                  );
                }
              }}
              style={
                modalStyles.saveBtn
              }
            >
              {profileStrength >= 80
                ? "Open Direct Messages to Schedule ➔"
                : "Close Radar"}
            </button>
          </div>
        </div>
      )}

      {/* ======================================================================
         PROFILE SETTINGS MODAL
         ====================================================================== */}

      {isProfileModalOpen && (
        <div
          style={
            modalStyles.overlay
          }
          onClick={() =>
            setIsProfileModalOpen(
              false
            )
          }
        >
          <div
            style={{
              ...modalStyles.card,
              maxWidth: "550px"
            }}
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div
              style={
                modalStyles.header
              }
            >
              <div>
                <span
                  style={{
                    fontSize:
                      "10px",
                    fontWeight:
                      "bold",
                    color:
                      "#3b5998"
                  }}
                >
                  CANDIDATE
                  CONFIGURATION
                </span>

                <h2
                  style={{
                    margin:
                      "2px 0 0 0",
                    fontSize:
                      "16px",
                    fontWeight:
                      "bold"
                  }}
                >
                  Edit Target Career
                  &amp; Profile
                  Telemetry
                </h2>
              </div>

              <button
                onClick={() =>
                  setIsProfileModalOpen(
                    false
                  )
                }
                style={
                  modalStyles.closeBtn
                }
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={
                handleSaveProfile
              }
              style={
                modalStyles.form
              }
            >
              {/* Handle + Role */}

              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "10px"
                }}
              >
                <div
                  style={
                    modalStyles.inputGroup
                  }
                >
                  <label
                    style={
                      modalStyles.label
                    }
                  >
                    User Handle
                  </label>

                  <input
                    type="text"
                    value={
                      profileData.handle
                    }
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        handle:
                          e.target.value
                      })
                    }
                    style={
                      modalStyles.input
                    }
                    required
                  />
                </div>

                <div
                  style={
                    modalStyles.inputGroup
                  }
                >
                  <label
                    style={
                      modalStyles.label
                    }
                  >
                    Target Career
                    Role
                  </label>

                  <input
                    type="text"
                    value={
                      profileData.targetRole
                    }
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        targetRole:
                          e.target.value
                      })
                    }
                    style={
                      modalStyles.input
                    }
                    required
                  />
                </div>
              </div>

              {/* College + Tier */}

              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "1.5fr 1fr",
                  gap: "10px"
                }}
              >
                <div
                  style={
                    modalStyles.inputGroup
                  }
                >
                  <label
                    style={
                      modalStyles.label
                    }
                  >
                    Institution /
                    University Name
                  </label>

                  <input
                    type="text"
                    value={
                      profileData.college
                    }
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        college:
                          e.target.value
                      })
                    }
                    style={
                      modalStyles.input
                    }
                    required
                  />
                </div>

                <div
                  style={
                    modalStyles.inputGroup
                  }
                >
                  <label
                    style={
                      modalStyles.label
                    }
                  >
                    University Tier
                  </label>

                  <select
                    value={
                      profileData.tier
                    }
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        tier:
                          e.target.value
                      })
                    }
                    style={
                      modalStyles.select
                    }
                  >
                    <option value="Elite (Stanford/MIT)">
                      Elite
                      (Stanford/MIT/Ivy)
                    </option>

                    <option value="Tier 1">
                      Tier 1
                      (IIT/NIT/BITS)
                    </option>

                    <option value="Tier 2">
                      Tier 2
                      (State Top)
                    </option>

                    <option value="Tier 3">
                      Tier 3
                      (Local/Private)
                    </option>
                  </select>
                </div>
              </div>

              {/* Degree + GPA */}

              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "1.5fr 1fr",
                  gap: "10px"
                }}
              >
                <div
                  style={
                    modalStyles.inputGroup
                  }
                >
                  <label
                    style={
                      modalStyles.label
                    }
                  >
                    Degree &amp;
                    Branch
                  </label>

                  <input
                    type="text"
                    value={
                      profileData.degree
                    }
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        degree:
                          e.target.value
                      })
                    }
                    style={
                      modalStyles.input
                    }
                    required
                  />
                </div>

                <div
                  style={
                    modalStyles.inputGroup
                  }
                >
                  <label
                    style={
                      modalStyles.label
                    }
                  >
                    Current CGPA
                  </label>

                  <input
                    type="number"
                    step="0.1"
                    max="10"
                    value={
                      profileData.gpa
                    }
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        gpa:
                          e.target.value
                      })
                    }
                    style={
                      modalStyles.input
                    }
                    required
                  />
                </div>
              </div>

              {/* Assessment Simulation */}

              <div
                style={{
                  padding:
                    "10px",
                  backgroundColor:
                    "#f8f9fa",
                  border:
                    "1px solid #d5d5d5",
                  borderRadius:
                    "4px",
                  margin:
                    "6px 0"
                }}
              >
                <div
                  style={{
                    fontSize:
                      "11px",
                    fontWeight:
                      "bold",
                    color:
                      "#333",
                    marginBottom:
                      "6px"
                  }}
                >
                  SIMULATE
                  ASSESSMENTS /
                  REPOS
                </div>

                <div
                  style={{
                    display:
                      "flex",
                    gap: "10px",
                    flexWrap:
                      "wrap"
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setProfileData(
                        (p) => ({
                          ...p,
                          assessmentsPassed:
                            Math.min(
                              p.assessmentsPassed +
                                1,
                              5
                            )
                        })
                      )
                    }
                    style={
                      cfStyles.simBtn
                    }
                  >
                    + Complete
                    Assessment (+8%)
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setProfileData(
                        (p) => ({
                          ...p,
                          projectsVerified:
                            Math.min(
                              p.projectsVerified +
                                1,
                              4
                            )
                        })
                      )
                    }
                    style={
                      cfStyles.simBtn
                    }
                  >
                    + Verify GitHub
                    Repo (+10%)
                  </button>
                </div>
              </div>

              {/* Buttons */}

              <div
                style={{
                  display:
                    "flex",
                  gap: "8px",
                  marginTop:
                    "8px",
                  justifyContent:
                    "flex-end"
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    setIsProfileModalOpen(
                      false
                    )
                  }
                  style={
                    modalStyles.cancelBtn
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={
                    modalStyles.saveBtn
                  }
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================
         GLOBAL CSS
         ====================================================================== */}

      <style>{`
        body {
          background-color: #f0f0f0;
          margin: 0;
          padding: 0;
        }

        * {
          box-sizing: border-box;
        }

        @keyframes marqueeSlow {
          0% {
            transform: translateX(0%);
          }

          100% {
            transform: translateX(-50%);
          }
        }

        button {
          font-family: Verdana, Arial, sans-serif;
        }

        button:hover {
          filter: brightness(0.97);
        }

        input:focus,
        select:focus {
          border-color: #3b5998 !important;
          box-shadow: 0 0 0 1px rgba(59, 89, 152, 0.1);
        }
      `}</style>
    </div>
  );
}

/* ==========================================================================
   CODEFORCES THEME STYLES
   ========================================================================== */

const cfStyles = {
  container: {
    padding: "12px 16px",
    width: "100%",
    maxWidth: "1280px",
    margin: "0 auto",
    backgroundColor: "#f0f0f0",
    color: "#333",
    fontFamily:
      "Verdana, Arial, sans-serif",
    boxSizing: "border-box",
    fontSize: "12px",
    minHeight: "100vh"
  },

  cfSubNav: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: "6px 12px",
    border:
      "1px solid #d5d5d5",
    borderRadius: "4px",
    marginBottom: "10px",
    boxShadow:
      "0 1px 2px rgba(0,0,0,0.05)"
  },

  smallTextBtn: {
    background: "none",
    border: "none",
    color: "#3b5998",
    cursor: "pointer",
    fontWeight: "bold",
    padding: 0,
    fontSize: "12px",
    textDecoration:
      "underline"
  },

  heroCard: {
    backgroundColor: "#ffffff",
    border:
      "1px solid #d5d5d5",
    borderRadius: "4px",
    padding: "16px",
    marginBottom: "12px",
    boxShadow:
      "0 1px 3px rgba(0,0,0,0.05)"
  },

  badgeRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap"
  },

  cfHandleBadge: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#00a99d"
  },

  cfRealName: {
    fontSize: "12px",
    color: "#777"
  },

  quoteBox: {
    display: "flex",
    gap: "10px",
    backgroundColor: "#f8f9fa",
    border:
      "1px solid #e5e5e5",
    borderRadius: "4px",
    padding: "10px 14px",
    margin: "10px 0"
  },

  quoteText: {
    margin: 0,
    fontSize: "12px",
    color: "#333",
    fontStyle: "italic"
  },

  quoteAuthor: {
    fontSize: "11px",
    color: "#777",
    marginTop: "3px"
  },

  fastTrackStatusBadge: {
    backgroundColor: "#f0fdf4",
    border:
      "1px solid #86efac",
    borderRadius: "4px",
    padding: "12px",
    minWidth: "220px",
    cursor: "pointer"
  },

  superdayPill: {
    backgroundColor: "#22c55e",
    color: "#fff",
    padding: "1px 6px",
    borderRadius: "3px",
    fontSize: "9px",
    fontWeight: "bold"
  },

  metricsTableWrapper: {
    backgroundColor: "#ffffff",
    border:
      "1px solid #d5d5d5",
    borderRadius: "4px",
    marginBottom: "12px",
    overflow: "hidden"
  },

  cfTableHeader: {
    display: "grid",
    gridTemplateColumns:
      "40px 2fr 1.5fr 1.5fr 1fr",
    backgroundColor: "#e5e5e5",
    padding: "8px 12px",
    fontWeight: "bold",
    fontSize: "11px",
    color: "#333",
    borderBottom:
      "1px solid #d5d5d5"
  },

  cfTableRow: {
    display: "grid",
    gridTemplateColumns:
      "40px 2fr 1.5fr 1.5fr 1fr",
    padding: "8px 12px",
    alignItems: "center",
    borderBottom:
      "1px solid #eee",
    fontSize: "12px"
  },

  cfTableActionBtn: {
    backgroundColor: "#f8f9fa",
    border:
      "1px solid #d5d5d5",
    borderRadius: "3px",
    padding: "3px 8px",
    fontSize: "11px",
    fontWeight: "bold",
    color: "#3b5998",
    cursor: "pointer"
  },

  growthSectionGrid: {
    display: "grid",
    gridTemplateColumns:
      "1fr",
    gap: "12px",
    marginBottom: "12px"
  },

  growthCurveCard: {
    backgroundColor: "#ffffff",
    border:
      "1px solid #d5d5d5",
    borderRadius: "4px",
    padding: "16px"
  },

  cardTitleRow: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: "10px"
  },

  subHeadingTag: {
    fontSize: "10px",
    fontWeight: "bold",
    color: "#777"
  },

  badgeGreen: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    border:
      "1px solid #bbf7d0",
    borderRadius: "3px",
    padding: "1px 6px",
    fontSize: "10px",
    fontWeight: "bold"
  },

  growthSvgWrapper: {
    position: "relative",
    padding: "5px 0"
  },

  graphFooter: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
    borderTop:
      "1px solid #e5e5e5",
    paddingTop: "8px",
    marginTop: "2px",
    fontSize: "10px",
    color: "#777"
  },

  testimonialsSection: {
    backgroundColor: "#ffffff",
    border:
      "1px solid #d5d5d5",
    borderRadius: "4px",
    padding: "16px 0",
    marginBottom: "12px",
    overflow: "hidden"
  },

  marqueeOuter: {
    width: "100%",
    overflow: "hidden",
    display: "flex",
    position: "relative",
    padding: "10px 0"
  },

  marqueeTrack: {
    display: "flex",
    gap: "10px",
    width: "max-content",
    animation:
      "marqueeSlow 90s linear infinite"
  },

  testimonialCard: {
    backgroundColor: "#fdfdfd",
    border:
      "1px solid #d5d5d5",
    borderRadius: "4px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    width: "240px",
    flexShrink: 0
  },

  simBtn: {
    backgroundColor: "#f8f9fa",
    color: "#3b5998",
    border:
      "1px solid #d5d5d5",
    borderRadius: "3px",
    padding: "5px 8px",
    fontSize: "10px",
    fontWeight: "bold",
    cursor: "pointer"
  }
};

/* ==========================================================================
   MODAL STYLES
   ========================================================================== */

const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor:
      "rgba(0, 0, 0, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent:
      "center",
    zIndex: 9999,
    padding: "20px"
  },

  card: {
    backgroundColor: "#ffffff",
    color: "#333",
    border:
      "1px solid #d5d5d5",
    borderRadius: "4px",
    boxShadow:
      "0 4px 12px rgba(0,0,0,0.15)",
    maxWidth: "480px",
    width: "100%",
    padding: "20px",
    fontFamily:
      "Verdana, Arial, sans-serif"
  },

  header: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems:
      "flex-start",
    borderBottom:
      "1px solid #e5e5e5",
    paddingBottom: "10px",
    marginBottom: "12px"
  },

  closeBtn: {
    background: "none",
    color: "#666",
    border:
      "1px solid #d5d5d5",
    borderRadius: "3px",
    width: "24px",
    height: "24px",
    fontWeight: "bold",
    cursor: "pointer"
  },

  form: {
    display: "flex",
    flexDirection:
      "column",
    gap: "10px",
    textAlign: "left"
  },

  inputGroup: {
    display: "flex",
    flexDirection:
      "column",
    gap: "4px"
  },

  label: {
    fontSize: "11px",
    fontWeight: "bold",
    color: "#555"
  },

  input: {
    padding: "6px 8px",
    color: "#333",
    border:
      "1px solid #d5d5d5",
    borderRadius: "3px",
    fontSize: "12px",
    backgroundColor: "#fff",
    outline: "none"
  },

  select: {
    padding: "6px 8px",
    color: "#333",
    border:
      "1px solid #d5d5d5",
    borderRadius: "3px",
    fontSize: "12px",
    backgroundColor: "#fff",
    cursor: "pointer"
  },

  cancelBtn: {
    backgroundColor: "#f8f9fa",
    color: "#333",
    border:
      "1px solid #d5d5d5",
    borderRadius: "3px",
    padding: "6px 12px",
    fontWeight: "bold",
    fontSize: "11px",
    cursor: "pointer"
  },

  saveBtn: {
    backgroundColor: "#3b5998",
    color: "#fff",
    border:
      "1px solid #2a437e",
    borderRadius: "3px",
    padding: "6px 12px",
    fontWeight: "bold",
    fontSize: "11px",
    cursor: "pointer"
  }
};