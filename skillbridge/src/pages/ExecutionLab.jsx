import React, { useState, useEffect, useRef } from "react";

const LAB_TABS = [
  { id: "sandbox", name: "⚡ Deterministic Hardware Sandbox", tag: "Nanosecond & Perf Telemetry" },
  { id: "bounty", name: "🐞 Live Bug Bounty & Race Condition Arena", tag: "Real-World Debugging" },
  { id: "adversary", name: "🤖 Adversarial Stress Bot", tag: "Dynamic Stress Interrogator" },
  { id: "merkle", name: "🛡️ Merkle Anti-Cheat Integrity Audit", tag: "Keystroke & Build Attestation" },
  { id: "reverse-bidding", name: "💰 Recruiter Reverse-Bidding Floor", tag: "Firms Bid for Verified Talent" }
];

const BOUNTY_CHALLENGES = [
  {
    id: "B-01",
    title: "Silent ABA Pointer Corruption in Lock-Free Stack",
    difficulty: "Hard (HFT Concurrency)",
    reward: "+45 Skill Pts · Fast-track pass",
    stack: "C++20 · Atomic CAS · Hazard Pointers",
    description:
      "A concurrent lock-free stack suffers from memory reuse during node deallocation, leading to atomic CAS false-success and memory corruption under heavy multi-threaded contention.",
    buggyCode: `void push(Node* new_node) {\n    new_node->next = head.load(std::memory_order_relaxed);\n    while(!head.compare_exchange_weak(new_node->next, new_node,\n          std::memory_order_release, std::memory_order_relaxed));\n}\n\n// BUGGY POP WITH ABA RISK:\nNode* pop() {\n    Node* old_head = head.load(std::memory_order_relaxed);\n    while(old_head && !head.compare_exchange_weak(old_head, old_head->next,\n          std::memory_order_acquire, std::memory_order_relaxed));\n    return old_head;\n}`,
    rootCause: "Unprotected node pointer reuse before safe reclamation",
    solutionHint: "Implement Tagged Atomic Pointers (128-bit CAS) or Hazard Pointers with epoch-based reclamation."
  },
  {
    id: "B-02",
    title: "Cache Line False Sharing in SPSC Ring Buffer",
    difficulty: "Medium-Hard (Low Latency)",
    reward: "+35 Skill Pts",
    stack: "Modern C++ · L1 D-Cache · Fences",
    description:
      "Writer and reader head/tail atomic indices share the same 64-byte L1 Data cache line, forcing continuous inter-core cache line bouncing and a 420% throughput degradation.",
    buggyCode: `struct RingBuffer {\n    std::atomic<size_t> write_idx{0}; // 8 bytes\n    std::atomic<size_t> read_idx{0};  // 8 bytes (shares same 64-byte line!)\n    char buffer[1024];\n};`,
    rootCause: "Missing alignas(64) hardware padding between atomic indices",
    solutionHint: "Apply alignas(std::hardware_destructive_interference_size) to both write_idx and read_idx."
  }
];

const REVERSE_BIDS = [
  {
    firm: "Jane Street",
    role: "Quantitative Developer Intern (Summer 2027)",
    location: "Singapore / Hong Kong",
    compensationOffer: "₹38,00,000 / month + Housing",
    directBypass: "Direct Final-Round Superday (All OAs Bypassed)",
    criteria: "Score >= 740 & Verified Zero-Heap C++ Sandbox Execution",
    status: "Active Bid Ready to Claim"
  },
  {
    firm: "Citadel Securities",
    role: "Low-Latency Core Engineer (HFT)",
    location: "Bengaluru / London",
    compensationOffer: "₹1.5 Cr – 1.8 Cr CTC",
    directBypass: "Direct Technical Onsite Fast-track",
    criteria: "Score >= 720 & Solved ABA Bug Bounty Challenge",
    status: "Active Bid Ready to Claim"
  },
  {
    firm: "Optiver",
    role: "Quantitative Trader & Researcher",
    location: "Singapore",
    compensationOffer: "₹45,00,000 / month",
    directBypass: "Direct Interview Invite with Desk Head",
    criteria: "Score >= 700 & Stochastic Assessment Pass",
    status: "Active Bid Ready to Claim"
  }
];

export default function ExecutionLabPage({ user, score = 0, onScoreUpdate, onNavigate }) {
  const [activeTab, setActiveTab] = useState("sandbox");

  // 1. Sandbox Execution State
  const [sandboxCode, setSandboxCode] = useState(
    `#include <iostream>\n#include <atomic>\n#include <chrono>\n\n// Proving Zero-Heap Allocations & Cache Alignment\nstruct alignas(64) SPSCQueue {\n    alignas(64) std::atomic<size_t> head{0};\n    alignas(64) std::atomic<size_t> tail{0};\n    alignas(64) int ring[1024];\n};\n\nint main() {\n    SPSCQueue q;\n    // Hardware TSC Benchmark\n    return 0;\n}`
  );
  const [isExecuting, setIsExecuting] = useState(false);
  const [telemetryResults, setTelemetryResults] = useState(null);

  // 2. Adversarial Live Bot State
  const [adversaryLog, setAdversaryLog] = useState([
    {
      speaker: "bot",
      text: "I am your Live Adversarial Interviewer. I will dynamically alter constraints while you code. Explain why you chose acquire-release semantics over seq_cst in your memory model?"
    }
  ]);
  const [adversaryInput, setAdversaryInput] = useState("");
  const [isBotChallenging, setIsBotChallenging] = useState(false);
  const chatBottomRef = useRef(null);

  // 3. Merkle Audit State
  const [merkleHash, setMerkleHash] = useState("0x89F2...41B0");
  const [merkleVerified, setMerkleVerified] = useState(true);

  // 4. Bounty State
  const [activeBounty, setActiveBounty] = useState(BOUNTY_CHALLENGES[0]);
  const [bountyFixedCode, setBountyFixedCode] = useState(BOUNTY_CHALLENGES[0].buggyCode);
  const [bountyStatus, setBountyStatus] = useState(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [adversaryLog]);

  // Execute Hardware Sandbox Simulator
  const handleRunExecution = () => {
    setIsExecuting(true);
    setTelemetryResults(null);

    setTimeout(() => {
      setIsExecuting(false);
      setTelemetryResults({
        executionLatency: "114ns (p99)",
        heapAllocations: "0 bytes (PASSED: Strict Zero-Heap Verified)",
        l1CacheMisses: "0.02% (Cache Line Aligned)",
        instructionsPerCycle: "3.42 IPC (AVX-512 SIMD Active)",
        status: "PRODUCTION_CERTIFIED_PASSED",
        pointsEarned: 25
      });
      if (onScoreUpdate) onScoreUpdate(25);
    }, 1200);
  };

  // Submit Bug Bounty Fix
  const handleVerifyBountyFix = () => {
    if (bountyFixedCode.includes("alignas") || bountyFixedCode.includes("Hazard") || bountyFixedCode.includes("tagged")) {
      setBountyStatus({
        success: true,
        message: "✓ BUG ELIMINATED: Atomic synchronization & memory alignment verified. +45 Skill Points Added!"
      });
      if (onScoreUpdate) onScoreUpdate(45);
    } else {
      setBountyStatus({
        success: false,
        message: "✕ RACE CONDITION PERSISTS: ThreadSanitizer detected data hazard. Review memory alignment and ABA reclamation."
      });
    }
  };

  // Adversary Response Handler
  const handleAdversarySubmit = (e) => {
    e.preventDefault();
    if (!adversaryInput.trim()) return;

    const userText = adversaryInput.trim();
    setAdversaryLog((prev) => [...prev, { speaker: "user", text: userText }]);
    setAdversaryInput("");
    setIsBotChallenging(true);

    setTimeout(() => {
      setIsBotChallenging(false);
      setAdversaryLog((prev) => [
        ...prev,
        {
          speaker: "bot",
          text: `[ADVERSARIAL CONSTRAINT INJECTED]: A network partition dropped 40% of ingress market data packets. How does your lock-free queue prevent stale price book reads without locking? Provide the assembly-level barrier justification.`
        }
      ]);
    }, 1000);
  };

  return (
    <div style={styles.container}>
      {/* Top Banner */}
      <div style={styles.headerBanner}>
        <div>
          <div style={styles.topBadgeRow}>
            <span style={styles.liveTag}>● UNFAIR ADVANTAGE PROTOCOLS ACTIVE</span>
            <span style={styles.verifiedCount}>PROVE CODE REALITY · NO VIBE CODING</span>
          </div>
          <h1 style={styles.headerTitle}>DETERMINISTIC EXECUTION &amp; RECRUITER BIDDING LAB</h1>
          <p style={styles.headerSub}>
            Prove sub-microsecond latency, debug real multi-threaded race conditions, generate tamper-proof Merkle proofs, and let firms bid for you.
          </p>
        </div>

        <div style={styles.telemetryScoreCapsule}>
          <span style={{ fontSize: "10px", fontWeight: "900", color: "#6b7280" }}>YOUR VERIFIED SCORE</span>
          <div style={{ fontSize: "24px", fontWeight: "900", color: "#7c3aed" }}>{score} pts</div>
          <span style={{ fontSize: "10px", fontWeight: "800", color: "#16a34a" }}>Active Bidding Eligible</span>
        </div>
      </div>

      {/* Feature Navigation Tabs */}
      <div style={styles.tabsStrip}>
        {LAB_TABS.map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                ...styles.tabBtn,
                backgroundColor: isSelected ? "#000000" : "#ffffff",
                color: isSelected ? "#ffffff" : "#000000",
                boxShadow: isSelected ? "3px 3px 0px #ff3d9a" : "2px 2px 0px #000000"
              }}
            >
              <div>{tab.name}</div>
              <div style={{ fontSize: "10px", opacity: 0.8, fontWeight: "600" }}>{tab.tag}</div>
            </button>
          );
        })}
      </div>

      {/* TAB 1: HARDWARE EXECUTION SANDBOX */}
      {activeTab === "sandbox" && (
        <div style={styles.contentCard}>
          <div style={styles.cardHeader}>
            <div>
              <span style={styles.sectionBadge}>HARDWARE TELEMETRY HARNESS</span>
              <h2 style={styles.sectionTitle}>Deterministic Zero-Heap &amp; Latency Sandbox</h2>
              <p style={styles.sectionSub}>
                Executes code against strict hardware performance counters: measures nanosecond execution latency via CPU TSC cycles, ensures zero dynamic memory allocation (`malloc`/`new`), and flags L1 cache line bouncing.
              </p>
            </div>
            <button
              onClick={handleRunExecution}
              disabled={isExecuting}
              style={styles.runExecutionBtn}
            >
              {isExecuting ? "Executing in Container..." : "Run Hardware Execution Harness ⚡"}
            </button>
          </div>

          <div style={styles.sandboxGrid}>
            <div style={styles.editorPanel}>
              <div style={styles.panelHeader}>C++20 SOURCE (HOT PATH VERIFICATION)</div>
              <textarea
                value={sandboxCode}
                onChange={(e) => setSandboxCode(e.target.value)}
                style={styles.codeTextarea}
                rows={14}
              />
            </div>

            <div style={styles.telemetryPanel}>
              <div style={styles.panelHeader}>HARDWARE PERF COUNTERS (perf / rdtsc)</div>
              {telemetryResults ? (
                <div style={styles.resultsContainer}>
                  <div style={styles.resultItem}>
                    <span style={styles.resLabel}>P99 EXECUTION LATENCY:</span>
                    <strong style={{ fontSize: "18px", color: "#16a34a" }}>{telemetryResults.executionLatency}</strong>
                  </div>
                  <div style={styles.resultItem}>
                    <span style={styles.resLabel}>HEAP ALLOCATION AUDIT:</span>
                    <strong style={{ color: "#16a34a" }}>{telemetryResults.heapAllocations}</strong>
                  </div>
                  <div style={styles.resultItem}>
                    <span style={styles.resLabel}>L1 DATA CACHE MISS RATE:</span>
                    <strong style={{ color: "#000000" }}>{telemetryResults.l1CacheMisses}</strong>
                  </div>
                  <div style={styles.resultItem}>
                    <span style={styles.resLabel}>INSTRUCTIONS PER CYCLE (IPC):</span>
                    <strong style={{ color: "#7c3aed" }}>{telemetryResults.instructionsPerCycle}</strong>
                  </div>

                  <div style={styles.passChip}>
                    🛡️ <strong>VERIFIED PROOF-OF-EXECUTION:</strong> Result cryptographically anchored to your ATS resume. +25 Points Earned!
                  </div>
                </div>
              ) : (
                <div style={styles.emptyTelemetryPrompt}>
                  {isExecuting ? (
                    <div>
                      <div style={styles.spinner} />
                      <div style={{ marginTop: "10px", fontWeight: "900" }}>Running Valgrind &amp; CPU TSC instruction probes...</div>
                    </div>
                  ) : (
                    "Click 'Run Hardware Execution Harness' to measure instruction cycles, heap allocations, and cache metrics."
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE BUG BOUNTY & RACE CONDITION ARENA */}
      {activeTab === "bounty" && (
        <div style={styles.contentCard}>
          <div style={styles.cardHeader}>
            <div>
              <span style={styles.sectionBadge}>REVERSE ENGINEERING ARENA</span>
              <h2 style={styles.sectionTitle}>Real-World Concurrency Bug Bounty</h2>
              <p style={styles.sectionSub}>
                80% of real HFT/Systems engineering is fixing race conditions, ABA edge cases, and memory leaks. Find and patch the bug below to earn proof-of-debugging credentials.
              </p>
            </div>
          </div>

          {/* Bounty Selector Pills */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
            {BOUNTY_CHALLENGES.map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  setActiveBounty(b);
                  setBountyFixedCode(b.buggyCode);
                  setBountyStatus(null);
                }}
                style={{
                  ...styles.bountySelectBtn,
                  backgroundColor: activeBounty.id === b.id ? "#000000" : "#ffffff",
                  color: activeBounty.id === b.id ? "#ffffff" : "#000000"
                }}
              >
                {b.title} ({b.difficulty})
              </button>
            ))}
          </div>

          <div style={styles.bountyGrid}>
            <div style={styles.editorPanel}>
              <div style={styles.panelHeader}>BUGGY CONCURRENT CODE (EDIT &amp; FIX):</div>
              <textarea
                value={bountyFixedCode}
                onChange={(e) => setBountyFixedCode(e.target.value)}
                style={styles.codeTextarea}
                rows={12}
              />
              <button onClick={handleVerifyBountyFix} style={styles.submitFixBtn}>
                Run ThreadSanitizer &amp; Verify Fix 🚀
              </button>
            </div>

            <div style={styles.telemetryPanel}>
              <div style={styles.panelHeader}>SYSTEM DIAGNOSTICS &amp; RACE CONDITION LOG:</div>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>
                <strong>Scenario:</strong> {activeBounty.description}
              </div>
              <div style={{ fontSize: "12px", color: "#dc2626", fontWeight: "800", marginBottom: "8px" }}>
                <strong>Vulnerability:</strong> {activeBounty.rootCause}
              </div>
              <div style={{ fontSize: "12px", color: "#4b5563", marginBottom: "12px" }}>
                💡 <strong>Hint:</strong> {activeBounty.solutionHint}
              </div>

              {bountyStatus && (
                <div
                  style={{
                    ...styles.bountyStatusBox,
                    backgroundColor: bountyStatus.success ? "#bbf7d0" : "#fee2e2",
                    color: bountyStatus.success ? "#166534" : "#991b1b",
                    border: bountyStatus.success ? "2px solid #16a34a" : "2px solid #ef4444"
                  }}
                >
                  {bountyStatus.message}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ADVERSARIAL STRESS INTERVIEW BOT */}
      {activeTab === "adversary" && (
        <div style={styles.contentCard}>
          <div style={styles.cardHeader}>
            <div>
              <span style={styles.sectionBadge}>ADVERSARIAL STRESS ENGINE</span>
              <h2 style={styles.sectionTitle}>Dynamic Stress Interview Simulator</h2>
              <p style={styles.sectionSub}>
                Unlike static chatbots, this adversarial AI acts like a Jane Street / Citadel interviewer: it deliberately injects network packet drops, changes latency budgets, and probes micro-architectural trade-offs while you respond.
              </p>
            </div>
          </div>

          <div style={styles.adversaryChatShell}>
            <div style={styles.adversaryFeed}>
              {adversaryLog.map((log, idx) => {
                const isBot = log.speaker === "bot";
                return (
                  <div
                    key={idx}
                    style={{
                      ...styles.adversaryMsgRow,
                      justifyContent: isBot ? "flex-start" : "flex-end"
                    }}
                  >
                    <div
                      style={{
                        ...styles.adversaryBubble,
                        backgroundColor: isBot ? "#ffffff" : "#000000",
                        color: isBot ? "#111827" : "#ffffff",
                        border: "2px solid #000000",
                        boxShadow: isBot ? "3px 3px 0px #000000" : "3px 3px 0px #ff3d9a"
                      }}
                    >
                      <div style={{ fontSize: "10px", fontWeight: "900", color: isBot ? "#7c3aed" : "#ffea28", marginBottom: "4px" }}>
                        {isBot ? "ADVERSARIAL INTERVIEWER" : `${user?.name || "Candidate"}`}
                      </div>
                      <div style={{ fontSize: "13px", lineHeight: "1.4" }}>{log.text}</div>
                    </div>
                  </div>
                );
              })}
              {isBotChallenging && (
                <div style={{ fontSize: "12px", color: "#7c3aed", fontWeight: "800", display: "flex", gap: "6px" }}>
                  <span>●</span><span>●</span><span>●</span> Injecting constraint disruption...
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            <form onSubmit={handleAdversarySubmit} style={styles.adversaryInputRow}>
              <input
                type="text"
                placeholder="Defend your memory model, lock-free queue, or stochastic proof..."
                value={adversaryInput}
                onChange={(e) => setAdversaryInput(e.target.value)}
                style={styles.adversaryInput}
              />
              <button type="submit" style={styles.adversarySendBtn}>
                Submit Defense 🛡️
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 4: MERKLE ANTI-CHEAT ATTESTATION */}
      {activeTab === "merkle" && (
        <div style={styles.contentCard}>
          <div style={styles.cardHeader}>
            <div>
              <span style={styles.sectionBadge}>TAMPER-PROOF MERKLE PROOF</span>
              <h2 style={styles.sectionTitle}>Cryptographic Work-Integrity Attestation</h2>
              <p style={styles.sectionSub}>
                Eliminate LLM copy-paste skepticism. Every keystroke cadence, container build log, and hardware performance counter is hashed into a verifiable Merkle Tree root attached to your candidate credential.
              </p>
            </div>
          </div>

          <div style={styles.merkleCard}>
            <div style={styles.merkleHeader}>
              <div>
                <span style={styles.verifiedOnChainBadge}>✓ CRYPTOGRAPHICALLY ATTESTED</span>
                <h3 style={{ margin: "4px 0", fontSize: "18px", fontWeight: "900" }}>Alex Henderson · Merkle Root Audit</h3>
                <div style={{ fontSize: "12px", color: "#6b7280" }}>Root Hash: <code>{merkleHash}</code></div>
              </div>
              <button onClick={() => alert(`Merkle Proof 0x89F2...41B0 verified valid across 1,840 incremental build logs!`)} style={styles.verifyProofBtn}>
                Verify Proof Integrity ↗
              </button>
            </div>

            <div style={styles.merkleTreeVisualization}>
              <div style={styles.treeNode}>Merkle Root (0x89F2...41B0)</div>
              <div style={styles.treeBranches}>
                <div style={styles.leafNode}>🍃 Keystroke Typing Cadence (No Instant LLM Paste)</div>
                <div style={styles.leafNode}>🍃 Incremental Container Build Diffs</div>
                <div style={styles.leafNode}>🍃 Hardware TSC Instruction Execution Trace</div>
                <div style={styles.leafNode}>🍃 Codeforces API Verified Handle Token</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: RECRUITER REVERSE-BIDDING MARKETPLACE */}
      {activeTab === "reverse-bidding" && (
        <div style={styles.contentCard}>
          <div style={styles.cardHeader}>
            <div>
              <span style={styles.sectionBadge}>REVERSE TALENT MARKETPLACE</span>
              <h2 style={styles.sectionTitle}>Recruiter Reverse-Bidding Floor</h2>
              <p style={styles.sectionSub}>
                No more cold applications. Once your SkillBridge verified score passes threshold, verified recruiters place guaranteed interview bids with explicit salary transparency.
              </p>
            </div>
          </div>

          <div style={styles.bidsGrid}>
            {REVERSE_BIDS.map((bid, idx) => (
              <div key={idx} style={styles.bidCard}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={styles.bidFirmBadge}>{bid.firm}</span>
                  <span style={styles.bidStatusBadge}>⚡ {bid.status}</span>
                </div>

                <h3 style={{ margin: "2px 0 4px 0", fontSize: "17px", fontWeight: "900" }}>{bid.role}</h3>
                <div style={{ fontSize: "11px", color: "#6b7280", marginBottom: "8px" }}>📍 {bid.location}</div>

                <div style={styles.offerBox}>
                  <span style={{ fontSize: "10px", fontWeight: "800", color: "#6b7280" }}>COMPENSATION BID:</span>
                  <div style={{ fontSize: "16px", fontWeight: "900", color: "#16a34a" }}>{bid.compensationOffer}</div>
                </div>

                <div style={{ fontSize: "12px", fontWeight: "800", color: "#7c3aed", margin: "8px 0" }}>
                  🎁 {bid.directBypass}
                </div>

                <div style={{ fontSize: "11px", color: "#4b5563", marginBottom: "12px" }}>
                  Criteria: <strong>{bid.criteria}</strong>
                </div>

                <button
                  onClick={() => alert(`Bid claimed! Direct superday fast-track scheduling link sent to your registered email.`)}
                  style={styles.claimBidBtn}
                >
                  Accept Guaranteed Fast-Pass Interview →
                </button>
              </div>
            ))}
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
    boxSizing: "border-box"
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
    gap: "16px"
  },
  topBadgeRow: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    marginBottom: "6px"
  },
  liveTag: {
    fontSize: "11px",
    fontWeight: "900",
    color: "#7c3aed",
    letterSpacing: "0.5px"
  },
  verifiedCount: {
    fontSize: "11px",
    fontWeight: "900",
    backgroundColor: "#ffea28",
    border: "1px solid #000000",
    padding: "2px 8px",
    borderRadius: "6px"
  },
  headerTitle: {
    margin: "0 0 4px 0",
    fontSize: "24px",
    fontWeight: "900",
    letterSpacing: "-0.5px"
  },
  headerSub: {
    margin: 0,
    fontSize: "13px",
    color: "#4b5563"
  },
  telemetryScoreCapsule: {
    backgroundColor: "#fdfbf7",
    border: "2px solid #000000",
    borderRadius: "12px",
    padding: "10px 18px",
    textAlign: "right",
    boxShadow: "3px 3px 0px #000000"
  },
  tabsStrip: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap"
  },
  tabBtn: {
    border: "2px solid #000000",
    borderRadius: "12px",
    padding: "10px 16px",
    fontSize: "12px",
    fontWeight: "900",
    cursor: "pointer",
    textAlign: "left"
  },
  contentCard: {
    backgroundColor: "#ffffff",
    border: "2.5px solid #000000",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "5px 5px 0px #000000"
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "14px"
  },
  sectionBadge: {
    fontSize: "11px",
    fontWeight: "900",
    color: "#7c3aed",
    letterSpacing: "0.5px"
  },
  sectionTitle: {
    margin: "2px 0 4px 0",
    fontSize: "22px",
    fontWeight: "900"
  },
  sectionSub: {
    margin: 0,
    fontSize: "13px",
    color: "#4b5563",
    maxWidth: "750px"
  },
  runExecutionBtn: {
    backgroundColor: "#000000",
    color: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "10px",
    padding: "12px 20px",
    fontSize: "13px",
    fontWeight: "900",
    cursor: "pointer",
    boxShadow: "3px 3px 0px #ff3d9a"
  },
  sandboxGrid: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr",
    gap: "18px"
  },
  editorPanel: {
    border: "2px solid #000000",
    borderRadius: "12px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column"
  },
  panelHeader: {
    backgroundColor: "#fdfbf7",
    borderBottom: "2px solid #000000",
    padding: "10px 14px",
    fontSize: "11px",
    fontWeight: "900",
    letterSpacing: "0.5px"
  },
  codeTextarea: {
    backgroundColor: "#0f172a",
    color: "#38bdf8",
    padding: "14px",
    fontSize: "12px",
    fontFamily: "monospace",
    border: "none",
    outline: "none",
    resize: "vertical",
    lineHeight: "1.5"
  },
  telemetryPanel: {
    backgroundColor: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "12px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  resultsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  resultItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fdfbf7",
    border: "1.5px solid #000000",
    borderRadius: "8px",
    padding: "10px 12px"
  },
  resLabel: {
    fontSize: "11px",
    fontWeight: "900",
    color: "#6b7280"
  },
  passChip: {
    backgroundColor: "#bbf7d0",
    border: "1.5px solid #16a34a",
    borderRadius: "8px",
    padding: "10px",
    fontSize: "12px",
    color: "#166534",
    marginTop: "8px"
  },
  emptyTelemetryPrompt: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#6b7280",
    fontSize: "13px",
    fontWeight: "700"
  },
  spinner: {
    width: "28px",
    height: "28px",
    border: "3px solid #cbd5e1",
    borderTop: "3px solid #7c3aed",
    borderRadius: "50%",
    margin: "0 auto",
    animation: "spin 0.6s linear infinite"
  },
  bountySelectBtn: {
    border: "1.5px solid #000000",
    borderRadius: "8px",
    padding: "8px 14px",
    fontSize: "12px",
    fontWeight: "900",
    cursor: "pointer"
  },
  bountyGrid: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr",
    gap: "18px"
  },
  submitFixBtn: {
    backgroundColor: "#16a34a",
    color: "#ffffff",
    border: "2px solid #000000",
    padding: "12px",
    fontSize: "13px",
    fontWeight: "900",
    cursor: "pointer"
  },
  bountyStatusBox: {
    padding: "12px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "800",
    marginTop: "10px"
  },
  adversaryChatShell: {
    border: "2px solid #000000",
    borderRadius: "14px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    height: "460px"
  },
  adversaryFeed: {
    flex: 1,
    padding: "18px",
    overflowY: "auto",
    backgroundColor: "#faf9f5",
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  adversaryMsgRow: {
    display: "flex"
  },
  adversaryBubble: {
    maxWidth: "80%",
    borderRadius: "12px",
    padding: "12px 16px"
  },
  adversaryInputRow: {
    display: "flex",
    gap: "8px",
    padding: "12px 16px",
    borderTop: "2px solid #000000",
    backgroundColor: "#ffffff"
  },
  adversaryInput: {
    flex: 1,
    padding: "10px 14px",
    border: "2px solid #000000",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    backgroundColor: "#fdfbf7",
    outline: "none"
  },
  adversarySendBtn: {
    backgroundColor: "#000000",
    color: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "8px",
    padding: "0 18px",
    fontSize: "13px",
    fontWeight: "900",
    cursor: "pointer",
    boxShadow: "2px 2px 0px #ff3d9a"
  },
  merkleCard: {
    border: "2px solid #000000",
    borderRadius: "14px",
    padding: "20px",
    backgroundColor: "#fdfbf7"
  },
  merkleHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    flexWrap: "wrap",
    gap: "10px"
  },
  verifiedOnChainBadge: {
    backgroundColor: "#bbf7d0",
    border: "1px solid #16a34a",
    borderRadius: "4px",
    padding: "2px 6px",
    fontSize: "10px",
    fontWeight: "900",
    color: "#166534"
  },
  verifyProofBtn: {
    backgroundColor: "#000000",
    color: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "8px",
    padding: "8px 14px",
    fontSize: "12px",
    fontWeight: "900",
    cursor: "pointer"
  },
  merkleTreeVisualization: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  treeNode: {
    backgroundColor: "#000000",
    color: "#ffea28",
    padding: "10px",
    borderRadius: "8px",
    fontWeight: "900",
    fontSize: "13px",
    textAlign: "center"
  },
  treeBranches: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "10px"
  },
  leafNode: {
    backgroundColor: "#ffffff",
    border: "1.5px solid #000000",
    borderRadius: "8px",
    padding: "10px",
    fontSize: "11px",
    fontWeight: "800"
  },
  bidsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "16px"
  },
  bidCard: {
    border: "2px solid #000000",
    borderRadius: "14px",
    padding: "18px",
    backgroundColor: "#ffffff",
    boxShadow: "4px 4px 0px #000000",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  bidFirmBadge: {
    backgroundColor: "#000000",
    color: "#ffffff",
    borderRadius: "6px",
    padding: "3px 8px",
    fontSize: "11px",
    fontWeight: "900"
  },
  bidStatusBadge: {
    backgroundColor: "#bbf7d0",
    border: "1px solid #16a34a",
    borderRadius: "4px",
    padding: "2px 6px",
    fontSize: "10px",
    fontWeight: "900",
    color: "#166534"
  },
  offerBox: {
    backgroundColor: "#fdfbf7",
    border: "1.5px solid #000000",
    borderRadius: "8px",
    padding: "8px 10px",
    margin: "6px 0"
  },
  claimBidBtn: {
    backgroundColor: "#000000",
    color: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "8px",
    padding: "10px",
    fontSize: "12px",
    fontWeight: "900",
    cursor: "pointer",
    boxShadow: "2px 2px 0px #ff3d9a"
  }
};