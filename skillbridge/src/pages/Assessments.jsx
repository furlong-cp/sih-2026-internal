import React, { useState, useMemo } from "react";

const SKILL_DOMAINS = [
  { name: "Low-Latency & C++ Systems", category: "CSE Core", defaultDiff: "Hard", firms: ["Jane Street", "Citadel", "Tower Research"], topScorer: { name: "Rohan V. (IITB)", score: "100%", hiredBy: "Jane Street (₹40L / month Intern)", percentile: "Top 0.1%" } },
  { name: "Operating Systems & Linux Kernel", category: "CSE Core", defaultDiff: "Hard", firms: ["Google", "Apple", "Meta"], topScorer: { name: "Aditya S. (IITD)", score: "90%", hiredBy: "Google Core Infrastructure (₹58 LPA)", percentile: "Top 0.8%" } },
  { name: "Computer Networks & TCP/IP", category: "CSE Core", defaultDiff: "Medium", firms: ["Cloudflare", "Uber", "Cisco"], topScorer: { name: "Nisha K. (NITW)", score: "100%", hiredBy: "Cloudflare (₹48 LPA)", percentile: "Top 0.4%" } },
  { name: "Database Internals & Storage", category: "CSE Core", defaultDiff: "Hard", firms: ["Databricks", "Amazon", "Oracle"], topScorer: { name: "Varun M. (IITM)", score: "90%", hiredBy: "Databricks Storage Engine (₹82 LPA)", percentile: "Top 0.3%" } },
  { name: "Distributed Systems & Consensus", category: "CSE Core", defaultDiff: "Hard", firms: ["Google", "Microsoft", "Salesforce"], topScorer: { name: "Siddharth R. (IITG)", score: "100%", hiredBy: "Microsoft Azure Core (₹52 LPA)", percentile: "Top 0.5%" } },
  { name: "Computer Organization & Architecture", category: "CSE Core", defaultDiff: "Medium", firms: ["Intel", "NVIDIA", "Qualcomm"], topScorer: { name: "Kunal P. (BITS)", score: "90%", hiredBy: "NVIDIA Architecture (₹46 LPA)", percentile: "Top 1.1%" } },
  { name: "Compiler Design & LLVM", category: "CSE Core", defaultDiff: "Hard", firms: ["Apple", "Jane Street", "Meta"], topScorer: { name: "Arjun N. (IITK)", score: "100%", hiredBy: "Apple Compiler Group (₹65 LPA)", percentile: "Top 0.2%" } },
  { name: "Probability & Stochastic Calculus", category: "Maths & Computing", defaultDiff: "Hard", firms: ["Jane Street", "Optiver", "Jump Trading"], topScorer: { name: "Devansh G. (IITB)", score: "100%", hiredBy: "Citadel Securities (₹1.8 Cr CTC)", percentile: "Top 0.05%" } },
  { name: "Linear Algebra & Matrix Decompositions", category: "Maths & Computing", defaultDiff: "Medium", firms: ["Two Sigma", "Citadel", "Google AI"], topScorer: { name: "Pooja T. (IITKGP)", score: "100%", hiredBy: "Two Sigma Quantitative Research", percentile: "Top 0.3%" } },
  { name: "Discrete Mathematics & Graph Theory", category: "Maths & Computing", defaultDiff: "Medium", firms: ["Codeforces", "Tower Research", "Meta"], topScorer: { name: "Manish B. (IIITH)", score: "100%", hiredBy: "Tower Research Capital (₹1.4 Cr CTC)", percentile: "Top 0.1%" } },
  { name: "Numerical Analysis & Optimization", category: "Maths & Computing", defaultDiff: "Hard", firms: ["HRT", "DE Shaw", "Citadel"], topScorer: { name: "Kavya S. (IITR)", score: "90%", hiredBy: "Hudson River Trading (HRT)", percentile: "Top 0.4%" } },
  { name: "Abstract Algebra & Number Theory", category: "Maths & Computing", defaultDiff: "Hard", firms: ["Ethereum Foundation", "Polygon", "Jane Street"], topScorer: { name: "Tanmay C. (IITD)", score: "100%", hiredBy: "Polygon Protocol Labs", percentile: "Top 0.6%" } },
  { name: "Statistical Inference & Monte Carlo", category: "Maths & Computing", defaultDiff: "Hard", firms: ["Optiver", "Two Sigma", "Akuna Capital"], topScorer: { name: "Ananya H. (ISI Kolkata)", score: "100%", hiredBy: "Optiver Derivatives Trading", percentile: "Top 0.2%" } },
  { name: "Advanced Dynamic Programming", category: "Algorithms & AI", defaultDiff: "Hard", firms: ["Google", "Uber", "Tower Research"], topScorer: { name: "Rahul K. (IITB)", score: "100%", hiredBy: "Tower Research Capital", percentile: "Top 0.1%" } },
  { name: "Segment Trees & Fenwick Trees", category: "Algorithms & AI", defaultDiff: "Hard", firms: ["Jane Street", "Codeforces", "Citadel"], topScorer: { name: "Vikram S. (IITM)", score: "100%", hiredBy: "Jump Trading (₹38L / month)", percentile: "Top 0.15%" } },
  { name: "Deep Learning Internals & CUDA", category: "Algorithms & AI", defaultDiff: "Hard", firms: ["NVIDIA", "OpenAI", "Meta"], topScorer: { name: "Suresh R. (IITD)", score: "100%", hiredBy: "OpenAI Distributed Training", percentile: "Top 0.05%" } }
];

const DOMAIN_QUESTION_POOLS = {
  "Low-Latency & C++ Systems": [
    { q: "Which CPU instruction prevents out-of-order memory execution across threads without invalidating the entire instruction pipeline?", topic: "Memory Barriers & CPU Fences", options: ["_mm_mfence() / std::atomic_thread_fence", "volatile std::lock", "malloc_trim()", "posix_memalign()"], correct: 0, exp: "Memory fences enforce strict sequential consistency across core store-buffers." },
    { q: "What causes false sharing in multi-threaded lock-free ring buffers?", topic: "Cache Coherence & Cache Lines", options: ["Multiple threads writing to variables sharing the same 64-byte L1 cache line", "Mutex priority inversions", "Heap fragmentation during realloc", "L2 Instruction cache misses"], correct: 0, exp: "Concurrent writes to adjacent variables invalidate the shared 64-byte line across L1 caches." },
    { q: "What is the primary latency hazard of invoking dynamic allocation (`malloc/new`) in an HFT order routing loop?", topic: "Heap Management & Syscalls", options: ["Page faults and lock contention in global heap arenas", "TCP checksum invalidations", "Context switching interrupts", "Stack pointer corruption"], correct: 0, exp: "Dynamic allocations trigger global arena lock contention and non-deterministic page faults." },
    { q: "Which `std::memory_order` provides release-acquire synchronization without a total global order overhead?", topic: "Atomic Operations & Memory Models", options: ["std::memory_order_release with acquire", "std::memory_order_relaxed", "std::memory_order_seq_cst", "std::memory_order_consume"], correct: 0, exp: "Acquire-release pairs create a synchronized-with relationship without global sequential consistency." },
    { q: "Why is virtual table (vtable) dispatch discouraged on latency-critical hot execution paths?", topic: "Polymorphism & Branch Prediction", options: ["Indirect pointer dereference causes branch mispredictions and cache misses", "Stack frame fragmentation", "Disallows template compilation", "Forces heap allocation for this pointer"], correct: 0, exp: "Indirect branching bypasses CPU branch target buffers and invalidates instruction prefetching." },
    { q: "What is the concrete hardware benefit of using `alignas(64)` on concurrent atomic pointers?", topic: "Cache Alignment & Hardware Padding", options: ["Pads the object to distinct cache lines to prevent core cache invalidation", "Enables hardware transactional memory", "Forces double-width SIMD registers", "Doubles execution throughput automatically"], correct: 0, exp: "Aligning to 64 bytes isolates variables onto isolated CPU cache lines." },
    { q: "How does kernel-bypass networking (Solarflare OpenOnload / DPDK) reduce roundtrip packet latency?", topic: "Kernel Bypass & NIC Ring Buffers", options: ["Transfers network packets directly from NIC ring buffers to userspace memory", "Compresses outbound market data payloads", "Bypasses hardware NIC FIFOs", "Automatically multithreads TCP handshakes"], correct: 0, exp: "Kernel bypass avoids socket buffers, kernel space switches, and softirq interrupt handling." },
    { q: "In C++20, what guarantee does `consteval` provide over `constexpr`?", topic: "Compile-Time Metaprogramming", options: ["Guarantees immediate compile-time evaluation with zero runtime presence", "Enforces runtime immutability on heap objects", "Prevents memory reordering across cores", "Marks the function as inline assembly"], correct: 0, exp: "`consteval` enforces immediate function execution at compile-time with zero runtime overhead." },
    { q: "Which compiler branch-prediction optimization hint is supported natively in C++20?", topic: "Branch Hints & Micro-architectural Hints", options: ["[[likely]] and [[unlikely]] attributes", "__builtin_prefetch()", "#pragma unroll", "noexcept(auto)"], correct: 0, exp: "C++20 attributes inform the compiler to place the cold branch out-of-line." },
    { q: "What problem does the Tagged Pointer / Hazard Pointer idiom solve in lock-free concurrency?", topic: "ABA Problem & Safe Memory Reclamation", options: ["The ABA problem and safe memory reclamation during concurrent deletion", "Deadlocks in recursive mutexes", "Stack overflow in deep recursion", "Cache line split lock penalties"], correct: 0, exp: "Hazard pointers prevent accessing memory reclaimed and reused by another thread." }
  ],
  "Probability & Stochastic Calculus": [
    { q: "Under a standard Brownian Motion $W_t$, what is the expectation $\\mathbb{E}[(W_t - W_s)^2]$ for $t > s$?", topic: "Brownian Motion Variational Properties", options: ["$t - s$", "$(t - s)^2$", "0", "$t + s$"], correct: 0, exp: "Brownian motion has independent increments with variance $\\text{Var}(W_t - W_s) = t - s$." },
    { q: "What is Ito's Lemma formulation for the stochastic differential $df(X_t)$ where $dX_t = \\mu dt + \\sigma dW_t$?", topic: "Ito Calculus & Quadratic Variation", options: ["$df = (\\mu f' + \\frac{1}{2}\\sigma^2 f'')dt + \\sigma f' dW_t$", "$df = \\mu f' dt + \\sigma f' dW_t$", "$df = f' dX_t$", "$df = \\sigma^2 f'' dt$"], correct: 0, exp: "Ito's lemma includes the second-order Taylor expansion term since $(dW_t)^2 = dt$." },
    { q: "You toss a fair coin until you obtain two consecutive heads (HH). What is the expected number of total tosses?", topic: "Markov Chains & Absorbing States", options: ["6", "4", "8", "10"], correct: 0, exp: "Solving the first-step recursive transition equations gives $E = 1/2(1+E) + 1/4(2+E) + 1/4(2) \\implies E = 6$." },
    { q: "What is the stationary vector $\\pi$ of an irreducible, aperiodic Markov chain with transition matrix $P$?", topic: "Ergodic Theorems & Eigenvector Distribution", options: ["The left eigenvector satisfying $\\pi P = \\pi$ and $\\sum \\pi_i = 1$", "$\\pi = P^{-1}$", "$\\det(P - I) = 0$", "$\\pi = \\sum P_{ij}$"], correct: 0, exp: "The stationary distribution is the normalized left eigenvector of eigenvalue $\\lambda = 1$." },
    { q: "If $X \\sim \\mathcal{N}(\\mu, \\sigma^2)$, what is its moment-generating function $M_X(t)$?", topic: "Gaussian Distributions & Moment Generating Functions", options: ["$\\exp(\\mu t + \\frac{1}{2}\\sigma^2 t^2)$", "$\\exp(\\mu t - \\sigma t)$", "$\\frac{1}{1 - \\mu t}$", "$\\mu + \\sigma^2 t$"], correct: 0, exp: "Integrating $\\int e^{tx} f(x) dx$ for a normal PDF yields $\\exp(\\mu t + \\frac{1}{2}\\sigma^2 t^2)$." },
    { q: "What is the expected value of $\\max(U_1, U_2)$ where $U_1, U_2 \\sim \\text{Uniform}(0, 1)$ are independent?", topic: "Order Statistics", options: ["2/3", "1/2", "3/4", "5/6"], correct: 0, exp: "The PDF of the max is $f(x) = 2x$. The expected value is $\\int_0^1 2x^2 dx = 2/3$." },
    { q: "Under the Black-Scholes model, which PDE term represents the asset price diffusion with volatility $\\sigma$?", topic: "Black-Scholes-Merton PDE Derivatives", options: ["$\\frac{1}{2}\\sigma^2 S^2 \\frac{\\partial^2 V}{\\partial S^2}$", "$r S \\frac{\\partial V}{\\partial S}$", "$-rV$", "$\\frac{\\partial V}{\\partial t}$"], correct: 0, exp: "The gamma/convexity term $\\frac{1}{2}\\sigma^2 S^2 V_{SS}$ models diffusion risk." },
    { q: "What is the probability that a Poisson process with rate $\\lambda$ observes zero events in time interval $T$?", topic: "Poisson Processes & Arrival Times", options: ["$e^{-\\lambda T}$", "$\\lambda T e^{-\\lambda T}$", "$1 - e^{-\\lambda T}$", "$e^{-\\lambda}$"], correct: 0, exp: "From $P(N_T = k) = \\frac{(\\lambda T)^k e^{-\\lambda T}}{k!}$, substituting $k = 0$ gives $e^{-\\lambda T}$." },
    { q: "What is the variance of a geometric distribution with success parameter $p$?", topic: "Discrete Probability & Variance", options: ["$\\frac{1-p}{p^2}$", "$\\frac{1}{p}$", "$\\frac{p}{(1-p)^2}$", "$\\frac{1-p}{p}$"], correct: 0, exp: "The second central moment evaluates to $\\text{Var}(X) = \\frac{1-p}{p^2}$." },
    { q: "If $M_t$ is a filtration-adapted martingale, what is $\\mathbb{E}[M_t | \\mathcal{F}_s]$ for $s < t$?", topic: "Martingale Theory & Conditional Expectation", options: ["$M_s$", "$M_0$", "$0$", "$M_t - M_s$"], correct: 0, exp: "By definition, the conditional expectation of a martingale forward in time equals its current value $M_s$." }
  ]
};

const TOTAL_ASSESSMENTS_COUNT = 102400;
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const generateQuestionsForDomain = (domainName, levelNumber) => {
  const basePool = DOMAIN_QUESTION_POOLS[domainName];
  if (basePool && levelNumber === 1) return basePool;

  const topics = [
    "Lock Acquisition Invariants",
    "Asymptotic Complexity & Scaling",
    "Hardware Cache Line Contention",
    "Numerical Spectral Radius Bounds",
    "64-Byte Cache Line Alignment",
    "State Machine Replay Delays",
    "Object Pool & Ring Buffer Allocation",
    "Exponential Backoff & Full Jitter",
    "Cryptographic Merkle Consistency",
    "Atomic CAS Spin Trade-offs"
  ];

  return topics.map((topic, idx) => ({
    q: `Q${idx + 1}: In ${domainName} (Advanced Level ${levelNumber}), which principle is critical regarding ${topic}?`,
    topic: topic,
    options: [
      `Strict mathematical preservation of ${topic} invariants under $O(1)$ bounds`,
      `Unbounded dynamic reallocation during execution`,
      `Single-threaded polling with global blocking locks`,
      `Non-deterministic branch scheduling`
    ],
    correct: 0,
    exp: `Correctly managing ${topic} guarantees thread safety, sub-microsecond latency, and bounded memory utilization.`
  }));
};

const getAssessmentByIndex = (index) => {
  const domain = SKILL_DOMAINS[index % SKILL_DOMAINS.length];
  const levelNumber = Math.floor(index / SKILL_DOMAINS.length) + 1;
  const difficulties = ["Medium", "Hard", "Expert HFT"];
  const diff = difficulties[(index * 7) % difficulties.length];
  const reward = 20 + ((index * 3) % 35);
  const questions = generateQuestionsForDomain(domain.name, levelNumber);

  return {
    id: `ASM-${domain.category.slice(0, 3).toUpperCase()}-${String(index + 1).padStart(6, "0")}`,
    title: `${domain.name} · Level ${levelNumber}`,
    domainName: domain.name,
    category: domain.category,
    difficulty: diff,
    duration: "20 mins",
    questionsCount: questions.length,
    scoreReward: `+${reward} Score Pts`,
    targetFirms: domain.firms,
    topScorer: domain.topScorer,
    questions: questions,
    completed: index % 17 === 0,
    lastScore: index % 17 === 0 ? 90 + (index % 10) : null
  };
};

export default function AssessmentsPage({ score = 742, onScoreUpdate }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTest, setActiveTest] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [testResult, setTestResult] = useState(null);
  const [certModal, setCertModal] = useState(null);

  const [cooldownMap, setCooldownMap] = useState({
    "ASM-CSE-000004": Date.now() + 5 * 24 * 60 * 60 * 1000,
  });

  const itemsPerPage = 9;

  const matchingIndices = useMemo(() => {
    const indices = [];
    const query = searchQuery.toLowerCase();

    for (let i = 0; i < TOTAL_ASSESSMENTS_COUNT; i++) {
      const domain = SKILL_DOMAINS[i % SKILL_DOMAINS.length];
      const categoryMatch = activeCategory === "All" || domain.category === activeCategory;
      if (!categoryMatch) continue;

      const title = `${domain.name} Level ${Math.floor(i / SKILL_DOMAINS.length) + 1}`.toLowerCase();
      const textMatch = !query || title.includes(query) || domain.category.toLowerCase().includes(query) || domain.name.toLowerCase().includes(query);
      if (!textMatch) continue;

      indices.push(i);
      if (indices.length >= 2500) break;
    }
    return indices;
  }, [activeCategory, searchQuery]);

  const totalPages = Math.ceil(matchingIndices.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return matchingIndices.slice(start, start + itemsPerPage).map((idx) => getAssessmentByIndex(idx));
  }, [matchingIndices, currentPage]);

  const getRemainingCooldownText = (assessmentId) => {
    const expiry = cooldownMap[assessmentId];
    if (!expiry) return null;
    const diff = expiry - Date.now();
    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h left`;
  };

  const handleStartTest = (assessment) => {
    if (getRemainingCooldownText(assessment.id)) {
      alert(`This module is in strict 1-week cooldown. Retake unlocked in ${getRemainingCooldownText(assessment.id)}.`);
      return;
    }
    setActiveTest(assessment);
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setTestResult(null);
  };

  const handleAnswerOption = (optIdx) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestionIdx]: optIdx }));
  };

  const handleSubmitEvaluation = () => {
    let correctCount = 0;
    const questionStats = [];
    const weakAreas = [];

    activeTest.questions.forEach((q, idx) => {
      const userSelected = selectedAnswers[idx];
      const isCorrect = userSelected === q.correct;
      if (isCorrect) correctCount++;
      else {
        weakAreas.push(q.topic || `Concept ${idx + 1}`);
      }

      questionStats.push({
        questionNumber: idx + 1,
        questionText: q.q,
        topic: q.topic || "Core Concept",
        userAnswer: userSelected !== undefined ? q.options[userSelected] : "Unanswered",
        correctAnswer: q.options[q.correct],
        isCorrect: isCorrect,
        explanation: q.exp || "Direct invariant requirement for optimal low-latency convergence."
      });
    });

    const percent = Math.round((correctCount / activeTest.questions.length) * 100);
    const passed = percent >= 70;
    const pts = parseInt(activeTest.scoreReward.replace(/\D/g, ""), 10) || 30;

    if (!passed) {
      setCooldownMap((prev) => ({
        ...prev,
        [activeTest.id]: Date.now() + ONE_WEEK_MS,
      }));
    }

    setTestResult({
      total: activeTest.questions.length,
      correct: correctCount,
      percentage: percent,
      passed,
      earnedPoints: passed ? pts : 0,
      questionStats: questionStats,
      weakAreas: weakAreas,
      topScorer: activeTest.topScorer
    });

    if (onScoreUpdate && passed) {
      onScoreUpdate(pts);
    }
  };

  return (
    <div style={styles.container}>
      {/* Top Banner */}
      <div style={styles.headerBanner}>
        <div>
          <div style={styles.topBadgeRow}>
            <span style={styles.liveTag}>● PROCTORED ATS VERIFICATION</span>
            <span style={styles.cooldownBadge}>7-DAY COOLDOWN ON SCORE &lt; 70%</span>
          </div>
          <h1 style={styles.headerTitle}>PROCTORED SKILL ASSESSMENTS ENGINE</h1>
          <p style={styles.headerSub}>
            Standardized 10-question proctored modules with live question-by-question analytics, diagnostic weak-area mapping, and top scorer benchmarks.
          </p>
        </div>

        <div style={styles.summaryStats}>
          <div style={styles.summaryItem}>
            <span>SkillBridge Score:</span> <strong>{score}</strong>
          </div>
          <div style={styles.summaryItem}>
            <span>Passing Cutoff:</span> <strong style={{ color: "#16a34a" }}>70% (7/10 Qs)</strong>
          </div>
        </div>
      </div>

      {/* Test Sandbox Runner vs Catalog */}
      {activeTest ? (
        <div style={styles.testRunnerCard}>
          {!testResult ? (
            <div>
              <div style={styles.testRunnerTop}>
                <div>
                  <span style={styles.catBadge}>{activeTest.category} · {activeTest.difficulty}</span>
                  <h2 style={styles.testTitle}>{activeTest.title} (10 Questions)</h2>
                </div>
                <button onClick={() => setActiveTest(null)} style={styles.exitBtn}>
                  ✕ Exit Test
                </button>
              </div>

              {/* 10-Question Progress Palette */}
              <div style={styles.paletteContainer}>
                {activeTest.questions.map((_, qIdx) => {
                  const isAnswered = selectedAnswers[qIdx] !== undefined;
                  const isCurrent = qIdx === currentQuestionIdx;

                  return (
                    <button
                      key={qIdx}
                      onClick={() => setCurrentQuestionIdx(qIdx)}
                      style={{
                        ...styles.paletteBtn,
                        backgroundColor: isCurrent ? "#000000" : isAnswered ? "#22c55e" : "#ffffff",
                        color: isCurrent || isAnswered ? "#ffffff" : "#000000",
                      }}
                    >
                      {qIdx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Question Body */}
              <div style={styles.questionBox}>
                <div style={styles.questionIndexTag}>
                  QUESTION {currentQuestionIdx + 1} OF 10 · TOPIC: {activeTest.questions[currentQuestionIdx].topic || "CORE INVARIANT"}
                </div>
                <h3 style={styles.questionText}>
                  {activeTest.questions[currentQuestionIdx].q}
                </h3>

                <div style={styles.optionsList}>
                  {activeTest.questions[currentQuestionIdx].options.map((opt, oIdx) => {
                    const isSelected = selectedAnswers[currentQuestionIdx] === oIdx;
                    return (
                      <div
                        key={oIdx}
                        onClick={() => handleAnswerOption(oIdx)}
                        style={{
                          ...styles.optionItem,
                          backgroundColor: isSelected ? "#ffea28" : "#ffffff",
                          border: isSelected ? "2.5px solid #000000" : "2px solid #000000",
                        }}
                      >
                        <span style={styles.optionLetter}>{String.fromCharCode(65 + oIdx)}</span>
                        <span style={{ fontWeight: "700", fontSize: "14px" }}>{opt}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Controls */}
              <div style={styles.stepperFooter}>
                <button
                  disabled={currentQuestionIdx === 0}
                  onClick={() => setCurrentQuestionIdx((p) => p - 1)}
                  style={{
                    ...styles.navBtn,
                    opacity: currentQuestionIdx === 0 ? 0.5 : 1,
                  }}
                >
                  ← Previous Question
                </button>

                {currentQuestionIdx < activeTest.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIdx((p) => p + 1)}
                    style={styles.nextBtn}
                  >
                    Next Question →
                  </button>
                ) : (
                  <button onClick={handleSubmitEvaluation} style={styles.submitBtn}>
                    Submit 10-Question Evaluation 🚀
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Results Screen with Stats, Weak Areas, and Top Scorer Benchmark */
            <div style={styles.resultContainer}>
              <div style={{ fontSize: "52px", marginBottom: "8px" }}>
                {testResult.passed ? "🏆" : "⏳"}
              </div>
              <h2 style={{ fontSize: "26px", fontWeight: "900", margin: "0 0 6px 0" }}>
                {testResult.passed ? "Assessment Passed & Verified!" : "Score Below 70% Cutoff — 1 Week Cooldown Active"}
              </h2>
              <p style={{ fontSize: "14px", color: "#4b5563", margin: "0 0 16px 0" }}>
                You scored <strong>{testResult.percentage}%</strong> ({testResult.correct} of {testResult.total} correct). Required: <strong>70%</strong>.
              </p>

              {/* Top Scorer Benchmark Card */}
              {testResult.topScorer && (
                <div style={styles.topScorerCard}>
                  <div style={styles.topScorerIcon}>👑</div>
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <div style={{ fontSize: "11px", fontWeight: "900", color: "#6b7280" }}>
                      MODULE TOP SCORER BENCHMARK
                    </div>
                    <div style={{ fontSize: "15px", fontWeight: "900" }}>
                      {testResult.topScorer.name} · Scored {testResult.topScorer.score} ({testResult.topScorer.percentile})
                    </div>
                    <div style={{ fontSize: "12px", color: "#16a34a", fontWeight: "800", marginTop: "2px" }}>
                      💼 Hired by: <strong>{testResult.topScorer.hiredBy}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Weak Areas Diagnostic Box */}
              <div style={styles.diagnosticCard}>
                <div style={{ fontSize: "12px", fontWeight: "900", letterSpacing: "0.5px", marginBottom: "8px", textAlign: "left" }}>
                  🔍 WEAK AREA DIAGNOSTIC RADAR
                </div>
                {testResult.weakAreas.length === 0 ? (
                  <div style={{ textAlign: "left", fontSize: "13px", color: "#16a34a", fontWeight: "800" }}>
                    ✓ Perfect score! No weak sub-topics detected. Candidate profile optimized for direct interview bypass.
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {testResult.weakAreas.map((area, aIdx) => (
                      <span key={aIdx} style={styles.weakPill}>
                        ⚠️ {area}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Question-by-Question Detailed Review */}
              <div style={{ marginTop: "24px", textAlign: "left" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "900", marginBottom: "12px" }}>
                  Detailed Question Breakdown & Verification Audit
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {testResult.questionStats.map((item) => (
                    <div
                      key={item.questionNumber}
                      style={{
                        ...styles.questionStatRow,
                        borderLeft: item.isCorrect ? "5px solid #22c55e" : "5px solid #ef4444",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                        <span style={{ fontSize: "12px", fontWeight: "900" }}>
                          Question {item.questionNumber} · {item.topic}
                        </span>
                        <span
                          style={{
                            ...styles.verdictBadge,
                            backgroundColor: item.isCorrect ? "#bbf7d0" : "#fee2e2",
                            color: item.isCorrect ? "#166534" : "#991b1b",
                          }}
                        >
                          {item.isCorrect ? "✓ Correct (+10 Pts)" : "✕ Incorrect (0 Pts)"}
                        </span>
                      </div>

                      <div style={{ fontSize: "13px", fontWeight: "700", marginBottom: "6px" }}>
                        {item.questionText}
                      </div>

                      <div style={{ fontSize: "12px", color: "#374151", display: "flex", flexDirection: "column", gap: "2px" }}>
                        <div>Your Answer: <strong style={{ color: item.isCorrect ? "#16a34a" : "#dc2626" }}>{item.userAnswer}</strong></div>
                        {!item.isCorrect && <div>Correct Answer: <strong style={{ color: "#16a34a" }}>{item.correctAnswer}</strong></div>}
                        <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px", fontStyle: "italic" }}>
                          💡 {item.explanation}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions Footer */}
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "28px" }}>
                {testResult.passed && (
                  <button
                    onClick={() => {
                      setCertModal({
                        title: activeTest.title,
                        score: testResult.percentage,
                        date: "August 31, 2026",
                        hash: `SB-VERIFIED-${Date.now().toString().slice(-8)}`
                      });
                    }}
                    style={styles.certBtn}
                  >
                    View Verified Certificate 🛡️
                  </button>
                )}
                <button onClick={() => setActiveTest(null)} style={styles.returnBtn}>
                  Return to Assessments Catalog
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Catalog Explorer */
        <>
          <div style={styles.filterSection}>
            <input
              type="text"
              placeholder="🔍 Search across 100,000+ CSE & Maths assessments (e.g. C++ Systems, Stochastic Calculus, OS, DP, Trees)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              style={styles.searchBar}
            />

            <div style={styles.filterRow}>
              {["All", "CSE Core", "Maths & Computing", "Algorithms & AI"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setCurrentPage(1);
                  }}
                  style={{
                    ...styles.filterPill,
                    backgroundColor: activeCategory === cat ? "#000000" : "#ffffff",
                    color: activeCategory === cat ? "#ffffff" : "#000000",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div style={styles.grid}>
            {currentItems.map((item) => {
              const cooldownTime = getRemainingCooldownText(item.id);
              const isLocked = Boolean(cooldownTime);

              return (
                <div key={item.id} style={styles.catalogCard}>
                  <div>
                    <div style={styles.catalogCardTop}>
                      <span style={styles.domainBadge}>{item.category}</span>
                      <span style={styles.diffBadge}>{item.difficulty}</span>
                    </div>

                    <h3 style={styles.itemTitle}>{item.title}</h3>

                    <div style={styles.itemMeta}>
                      <span>⏱️ {item.duration}</span>
                      <span>·</span>
                      <span>📝 10 Proctored Questions</span>
                    </div>

                    <div style={styles.rewardChip}>
                      <span>⚡ Reward: <strong>{item.scoreReward}</strong></span>
                    </div>

                    {/* Top Scorer Placed Preview */}
                    {item.topScorer && (
                      <div style={styles.cardTopScorerPill}>
                        👑 <strong>{item.topScorer.name}</strong> ({item.topScorer.score}) → {item.topScorer.hiredBy.split("(")[0]}
                      </div>
                    )}

                    <div style={styles.firmsWrapper}>
                      <span style={{ fontSize: "11px", fontWeight: "800", color: "#6b7280" }}>
                        Target Unlocks:
                      </span>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "4px" }}>
                        {item.targetFirms.map((f, idx) => (
                          <span key={idx} style={styles.firmPill}>{f}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Button with Cooldown Lock State */}
                  <button
                    onClick={() => handleStartTest(item)}
                    disabled={isLocked}
                    style={{
                      ...styles.startTestBtn,
                      backgroundColor: isLocked ? "#f1f5f9" : "#000000",
                      color: isLocked ? "#94a3b8" : "#ffffff",
                      cursor: isLocked ? "not-allowed" : "pointer",
                      boxShadow: isLocked ? "none" : "3px 3px 0px #ff3d9a",
                      border: isLocked ? "2px solid #cbd5e1" : "2px solid #000000",
                    }}
                  >
                    {isLocked
                      ? `⏳ Cooldown (${cooldownTime})`
                      : item.completed
                      ? "Retake 10-Q Test ↺"
                      : "Start 10-Q Test →"}
                  </button>
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
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({matchingIndices.length.toLocaleString()} modules)
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
      )}

      {/* Verified Certificate Modal */}
      {certModal && (
        <div style={modalStyles.overlay} onClick={() => setCertModal(null)}>
          <div style={modalStyles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={modalStyles.badgeIcon}>SB</div>
            <h2 style={{ margin: "6px 0 2px 0", fontSize: "20px", fontWeight: "900" }}>
              SKILLBRIDGE PROOF OF PROFICIENCY
            </h2>
            <div style={{ fontSize: "11px", color: "#6b7280", letterSpacing: "1px" }}>
              CRYPTOGRAPHICALLY VERIFIABLE CANDIDATE CREDENTIAL
            </div>

            <div style={modalStyles.certDetailsBox}>
              <div style={{ fontSize: "13px", color: "#4b5563" }}>Certified that</div>
              <div style={{ fontSize: "22px", fontWeight: "900", margin: "4px 0" }}>Alex Henderson</div>
              <div style={{ fontSize: "13px", color: "#4b5563" }}>has demonstrated verified mastery across 10 proctored questions in</div>
              <div style={modalStyles.subjectPill}>{certModal.title}</div>

              <div style={modalStyles.certRow}>
                <div>
                  <span style={{ fontSize: "10px", color: "#6b7280", fontWeight: "800" }}>SCORE</span>
                  <div style={{ fontSize: "16px", fontWeight: "900", color: "#16a34a" }}>{certModal.score}%</div>
                </div>
                <div>
                  <span style={{ fontSize: "10px", color: "#6b7280", fontWeight: "800" }}>DATE</span>
                  <div style={{ fontSize: "13px", fontWeight: "900" }}>{certModal.date}</div>
                </div>
                <div>
                  <span style={{ fontSize: "10px", color: "#6b7280", fontWeight: "800" }}>HASH ID</span>
                  <div style={{ fontSize: "11px", fontWeight: "900", fontFamily: "monospace" }}>{certModal.hash}</div>
                </div>
              </div>
            </div>

            <button onClick={() => setCertModal(null)} style={modalStyles.closeBtn}>
              Close & Attach to ATS Resume
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
    color: "#7c3aed",
    letterSpacing: "0.5px",
  },
  cooldownBadge: {
    fontSize: "11px",
    fontWeight: "900",
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    border: "1px solid #ef4444",
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
    gap: "12px",
  },
  summaryItem: {
    backgroundColor: "#fdfbf7",
    border: "1.5px solid #000000",
    borderRadius: "8px",
    padding: "8px 14px",
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
  filterPill: {
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
    gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))",
    gap: "22px",
  },
  catalogCard: {
    backgroundColor: "#ffffff",
    border: "2.5px solid #000000",
    borderRadius: "16px",
    padding: "22px",
    boxShadow: "5px 5px 0px #000000",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "310px",
  },
  catalogCardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  domainBadge: {
    fontSize: "11px",
    fontWeight: "900",
    textTransform: "uppercase",
    color: "#6b7280",
  },
  diffBadge: {
    backgroundColor: "#fee2e2",
    border: "1.5px solid #000000",
    borderRadius: "6px",
    padding: "2px 6px",
    fontSize: "10px",
    fontWeight: "900",
  },
  itemTitle: {
    margin: "0 0 6px 0",
    fontSize: "18px",
    fontWeight: "900",
  },
  itemMeta: {
    fontSize: "12px",
    color: "#4b5563",
    fontWeight: "700",
    display: "flex",
    gap: "8px",
    marginBottom: "10px",
  },
  rewardChip: {
    backgroundColor: "#fef08a",
    border: "1.5px solid #000000",
    borderRadius: "6px",
    padding: "4px 8px",
    fontSize: "12px",
    display: "inline-block",
    boxShadow: "2px 2px 0px #000000",
    marginBottom: "10px",
  },
  cardTopScorerPill: {
    backgroundColor: "#fdfbf7",
    border: "1px dashed #000000",
    borderRadius: "6px",
    padding: "5px 8px",
    fontSize: "11px",
    color: "#1e293b",
    marginBottom: "12px",
  },
  firmsWrapper: {
    marginBottom: "16px",
  },
  firmPill: {
    backgroundColor: "#f1f5f9",
    border: "1px solid #000000",
    borderRadius: "4px",
    padding: "2px 6px",
    fontSize: "10px",
    fontWeight: "700",
  },
  startTestBtn: {
    borderRadius: "10px",
    padding: "11px",
    fontSize: "13px",
    fontWeight: "900",
  },
  testRunnerCard: {
    backgroundColor: "#ffffff",
    border: "2.5px solid #000000",
    borderRadius: "16px",
    padding: "28px",
    boxShadow: "6px 6px 0px #000000",
    maxWidth: "840px",
    margin: "0 auto",
  },
  testRunnerTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "16px",
  },
  catBadge: {
    fontSize: "11px",
    fontWeight: "900",
    color: "#6b7280",
    textTransform: "uppercase",
  },
  testTitle: {
    margin: "2px 0 0 0",
    fontSize: "22px",
    fontWeight: "900",
  },
  exitBtn: {
    backgroundColor: "#fee2e2",
    border: "2px solid #ef4444",
    borderRadius: "8px",
    padding: "6px 12px",
    fontSize: "12px",
    fontWeight: "900",
    color: "#b91c1c",
    cursor: "pointer",
  },
  paletteContainer: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginBottom: "16px",
    paddingBottom: "12px",
    borderBottom: "1.5px dashed #e2e8f0",
  },
  paletteBtn: {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    border: "2px solid #000000",
    fontWeight: "900",
    fontSize: "13px",
    cursor: "pointer",
    boxShadow: "2px 2px 0px #000000",
  },
  questionBox: {
    backgroundColor: "#fdfbf7",
    border: "2px solid #000000",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "3px 3px 0px #000000",
  },
  questionIndexTag: {
    fontSize: "11px",
    fontWeight: "900",
    color: "#7c3aed",
    marginBottom: "6px",
    letterSpacing: "0.5px",
  },
  questionText: {
    margin: "0 0 16px 0",
    fontSize: "16px",
    fontWeight: "800",
    lineHeight: "1.4",
  },
  optionsList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  optionItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    boxShadow: "2px 2px 0px #000000",
  },
  optionLetter: {
    width: "24px",
    height: "24px",
    borderRadius: "6px",
    backgroundColor: "#000000",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "900",
  },
  stepperFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navBtn: {
    backgroundColor: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "8px",
    padding: "9px 16px",
    fontWeight: "800",
    fontSize: "13px",
    cursor: "pointer",
    boxShadow: "2px 2px 0px #000000",
  },
  nextBtn: {
    backgroundColor: "#000000",
    color: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "8px",
    padding: "9px 18px",
    fontWeight: "900",
    fontSize: "13px",
    cursor: "pointer",
    boxShadow: "3px 3px 0px #ff3d9a",
  },
  submitBtn: {
    backgroundColor: "#16a34a",
    color: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "8px",
    padding: "9px 20px",
    fontWeight: "900",
    fontSize: "13px",
    cursor: "pointer",
    boxShadow: "3px 3px 0px #000000",
  },
  resultContainer: {
    textAlign: "center",
    padding: "10px 0",
  },
  topScorerCard: {
    backgroundColor: "#faf5ff",
    border: "2px solid #7c3aed",
    borderRadius: "12px",
    padding: "14px 18px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "16px",
    boxShadow: "3px 3px 0px #7c3aed",
  },
  topScorerIcon: {
    fontSize: "28px",
  },
  diagnosticCard: {
    backgroundColor: "#fdfbf7",
    border: "2px solid #000000",
    borderRadius: "12px",
    padding: "14px 18px",
    marginBottom: "20px",
    boxShadow: "3px 3px 0px #000000",
  },
  weakPill: {
    backgroundColor: "#fee2e2",
    border: "1px solid #ef4444",
    borderRadius: "6px",
    padding: "4px 8px",
    fontSize: "11px",
    fontWeight: "800",
    color: "#991b1b",
  },
  questionStatRow: {
    backgroundColor: "#ffffff",
    border: "1.5px solid #000000",
    borderRadius: "10px",
    padding: "12px 14px",
    boxShadow: "2px 2px 0px #000000",
  },
  verdictBadge: {
    padding: "2px 6px",
    borderRadius: "4px",
    fontSize: "10px",
    fontWeight: "900",
    border: "1px solid #000000",
  },
  certBtn: {
    backgroundColor: "#7c3aed",
    color: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "8px",
    padding: "10px 18px",
    fontWeight: "900",
    fontSize: "13px",
    cursor: "pointer",
    boxShadow: "3px 3px 0px #000000",
  },
  returnBtn: {
    backgroundColor: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "8px",
    padding: "10px 16px",
    fontWeight: "800",
    fontSize: "13px",
    cursor: "pointer",
    boxShadow: "2px 2px 0px #000000",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
    marginTop: "32px",
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
    textAlign: "center",
    fontFamily: "'Space Grotesk', system-ui, sans-serif",
  },
  badgeIcon: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #ff3d9a, #8b5cf6)",
    color: "#ffffff",
    border: "2px solid #000000",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    fontSize: "16px",
    marginBottom: "8px",
    boxShadow: "2px 2px 0px #000000",
  },
  certDetailsBox: {
    backgroundColor: "#fdfbf7",
    border: "2px solid #000000",
    borderRadius: "14px",
    padding: "20px",
    margin: "16px 0 20px 0",
    boxShadow: "3px 3px 0px #000000",
  },
  subjectPill: {
    backgroundColor: "#ffffff",
    border: "1.5px solid #000000",
    borderRadius: "8px",
    padding: "8px 12px",
    fontWeight: "900",
    fontSize: "15px",
    margin: "8px 0 14px 0",
  },
  certRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1.2fr",
    gap: "10px",
    borderTop: "1.5px dashed #cbd5e1",
    paddingTop: "12px",
  },
  closeBtn: {
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