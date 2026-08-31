import React, { useState, useRef, useEffect } from "react";

const COPILOT_PERSONAS = [
  {
    id: "quant-strategist",
    name: "Quant & HFT Strategist",
    tagline: "Jane Street, Citadel & Prop Desk Prep",
    icon: "⚡",
    badge: "Quant Coach",
    systemGreeting:
      "Hello! I am your Quant & HFT Strategy Copilot. I've tailored my models to your profile, target role, and preferred depth mode. How can I assist your quant roadmap today?"
  },
  {
    id: "dsa-coach",
    name: "Competitive Programming Coach",
    tagline: "Codeforces Rating & Contest Mastery",
    icon: "🧠",
    badge: "Rating 2000+ Coach",
    systemGreeting:
      "Hey! Let's optimize your Codeforces progression toward Candidate Master and beyond. Select your preferred response format above and ask me anything."
  },
  {
    id: "mock-interviewer",
    name: "Technical Mock Interviewer",
    tagline: "Live Systems, C++ & Math Probing",
    icon: "🎙️",
    badge: "Live Simulation",
    systemGreeting:
      "Welcome to your technical screening simulation. I'll probe your low-latency C++20 memory models, lock-free queues, and stochastic calculus. Ready for your first question?"
  },
  {
    id: "ats-optimizer",
    name: "ATS & Resume Strategist",
    tagline: "Proof-of-Work & Recruiter Auditing",
    icon: "🛡️",
    badge: "Resume Bypass",
    systemGreeting:
      "Let's audit your GitHub repositories, benchmark telemetry, and certifications to clear automated ATS screens for your target locations."
  }
];

const ANSWER_MODES = [
  { id: "crisp", label: "⚡ Crisp & Direct", desc: "Bullet points, no fluff, actionable takeaway" },
  { id: "detailed", label: "📖 In-Depth & Mathematical", desc: "Full theory, mathematical derivations & edge cases" },
  { id: "code", label: "🛠️ Step-by-Step Code", desc: "Modern C++/Python code blocks with complexity analysis" },
  { id: "interview", label: "🎯 Mock Interview Probe", desc: "Interviewer feedback with follow-up counter-questions" }
];

const PRESET_PROMPTS = [
  "Week-by-week roadmap to crack Quant Dev Intern by 2027",
  "Explain std::memory_order_seq_cst vs acquire-release in HFT",
  "Simulate a 5-minute probability question asked in quant interviews",
  "How to structure an L3 Order Book in C++20 for sub-microsecond latency?"
];

export default function CareerCopilotPage({ user, score = 0, onNavigate }) {
  const [selectedPersona, setSelectedPersona] = useState(COPILOT_PERSONAS[0]);
  const [answerMode, setAnswerMode] = useState("crisp");
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      persona: COPILOT_PERSONAS[0].name,
      text: COPILOT_PERSONAS[0].systemGreeting,
      timestamp: "Just now"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSelectPersona = (persona) => {
    setSelectedPersona(persona);
    setMessages([
      {
        sender: "ai",
        persona: persona.name,
        text: persona.systemGreeting,
        timestamp: "Just now"
      }
    ]);
  };

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg = {
      sender: "user",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      let aiResponseText = "";
      const q = text.toLowerCase();

      // Formatting responses based on answerMode
      if (answerMode === "crisp") {
        if (q.includes("memory") || q.includes("acquire") || q.includes("seq_cst")) {
          aiResponseText = `* **seq_cst**: Enforces a single global total order across all CPU cores. High cost due to hardware memory fences.\n* **acquire/release**: Synchronizes only between the writing and reading threads on the same atomic variable. Zero bus lock overhead on x86.\n* **HFT Rule**: Use acquire-release for lock-free SPSC queues; avoid \`seq_cst\` in hot loops.`;
        } else if (q.includes("roadmap") || q.includes("quant")) {
          aiResponseText = `* **Stage 1 (DSA)**: Reach Codeforces 1900+ (Candidate Master) with focus on Segment Trees, Treaps, and DP.\n* **Stage 2 (Systems)**: Build an L3 Order Book in C++20 with cache-aligned \`alignas(64)\` SPSC ring buffers.\n* **Stage 3 (Quant Math)**: Master *Green Book* probability, Martingales, and Ito's Lemma.\n* **Target Cycle**: ${user?.targetYear || "2027 (Internship)"} for ${user?.targetCareer || "Quant Developer"}.`;
        } else if (q.includes("probability") || q.includes("interview")) {
          aiResponseText = `* **Question**: Toss a fair coin until you see consecutive Heads (HH). Expected flips?\n* **Answer**: **6 flips**.\n* **Core Formula**: $E = \\frac{1}{2}(1 + E) + \\frac{1}{4}(2 + E) + \\frac{1}{4}(2) \\implies E = 6$.`;
        } else {
          aiResponseText = `* **Target Role**: ${user?.targetCareer || "Software Engineer"}\n* **Branch / College Context**: ${user?.branch || "Mathematics & Computing"} at ${user?.college || "NIT Warangal / IIT Guwahati"}\n* **Key Takeaway**: Focus on core data structures and deterministic latency models to clear technical screens for ${user?.workLocation || "Bengaluru / Singapore"}.`;
        }
      } else if (answerMode === "detailed") {
        if (q.includes("memory") || q.includes("acquire") || q.includes("seq_cst")) {
          aiResponseText = `### In-Depth Mathematical & Hardware Memory Order Analysis\n\n**1. Sequential Consistency (\`std::memory_order_seq_cst\`):**\nEnforces that all threads observe all modifications in the exact same sequence. On modern x86 architectures, loads are free but stores require a costly \`MFENCE\` or locked instruction, invalidating store buffers.\n\n**2. Acquire-Release Semantics (\`acquire\` / \`release\`):**\nEstablishes a happens-before relationship between the store-release in Thread A and load-acquire in Thread B. Operations before the store cannot be reordered after it, and operations after the load cannot be reordered before it.\n\n$$\\text{Thread A (Producer)} \\xrightarrow{\\text{store\\_release}} \\text{Atomic Synchronized} \\xrightarrow{\\text{load\\_acquire}} \\text{Thread B (Consumer)}$$\n\n**3. Performance Impact in HFT Execution Hot Loops:**\nUsing acquire-release eliminates up to 85% of CPU pipeline stalls in Single-Producer Single-Consumer (SPSC) ring buffers.`;
        } else {
          aiResponseText = `### Comprehensive Strategic Analysis for ${user?.name || "Candidate"}\n\n* **Academic Profile**: ${user?.branch || "Mathematics & Computing"} · ${user?.college || "Engineering Institute"}\n* **Location Alignment**: Targeting ${user?.workLocation || "Global"} roles from ${user?.currentLocation || "India"}.\n* **Competitive Benchmark**: To guarantee OA bypasses at Jane Street, Citadel, and Tower Research, maintain a Codeforces rating $\\ge 1900$ and complete 2 production-grade C++20 kernel-bypass projects with hardware TSC benchmarking.`;
        }
      } else if (answerMode === "code") {
        aiResponseText = `### Production C++20 Implementation\n\n\`\`\`cpp\n#include <atomic>\n#include <new>\n\ntemplate <typename T, size_t Capacity>\nclass LockFreeSPSCQueue {\n    alignas(64) std::atomic<size_t> head_{0};\n    alignas(64) std::atomic<size_t> tail_{0};\n    alignas(64) T ringBuffer_[Capacity];\n\npublic:\n    bool push(const T& item) noexcept {\n        const size_t currentTail = tail_.load(std::memory_order_relaxed);\n        if ((currentTail + 1) % Capacity == head_.load(std::memory_order_acquire)) {\n            return false; // Queue full\n        }\n        ringBuffer_[currentTail] = item;\n        tail_.store((currentTail + 1) % Capacity, std::memory_order_release);\n        return true;\n    }\n};\n\`\`\`\n\n* **Complexity**: Push/Pop operates in strict $O(1)$ with zero lock contention and 64-byte false sharing isolation.`;
      } else {
        aiResponseText = `### 🎯 Mock Technical Interview Feedback\n\n**Interviewer Observation**: Good conceptual intuition regarding thread synchronization and latency budgets.\n\n**Follow-up Question**: *How would you prevent the ABA problem in a lock-free stack without relying on garbage collection? Explain Hazard Pointers or Tagged Pointer CAS.*`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          persona: selectedPersona.name,
          text: aiResponseText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div style={styles.container}>
      {/* Top Banner */}
      <div style={styles.headerBanner}>
        <div>
          <div style={styles.topBadgeRow}>
            <span style={styles.liveTag}>● AI CAREER COPILOT ACTIVE</span>
            <span style={styles.verifiedCount}>Personalized for {user?.name || "Candidate"}</span>
          </div>
          <h1 style={styles.headerTitle}>AI CAREER OS &amp; INTERVIEW COPILOT</h1>
          <p style={styles.headerSub}>
            Autonomous mentor calibrated for {user?.targetCareer || "Quantitative Development"} · {user?.branch || "Mathematics & Computing"} at {user?.college || "NIT Warangal / IIT Guwahati"}.
          </p>
        </div>

        <div style={styles.profileTelemetry}>
          <div style={styles.telemetryItem}>
            <span>Skill Score:</span> <strong>{score} / 1000</strong>
          </div>
          <div style={styles.telemetryItem}>
            <span>Target Location:</span> <strong>{user?.workLocation || "Singapore / Bengaluru"}</strong>
          </div>
        </div>
      </div>

      {/* Answer Depth Mode Selector */}
      <div style={styles.answerModeBar}>
        <div style={{ fontSize: "11px", fontWeight: "900", color: "#6b7280" }}>
          RESPONSE FORMAT &amp; DEPTH:
        </div>
        <div style={styles.answerModeList}>
          {ANSWER_MODES.map((mode) => {
            const isSelected = answerMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setAnswerMode(mode.id)}
                style={{
                  ...styles.modeBtn,
                  backgroundColor: isSelected ? "#000000" : "#ffffff",
                  color: isSelected ? "#ffffff" : "#000000",
                  boxShadow: isSelected ? "3px 3px 0px #ff3d9a" : "2px 2px 0px #000000"
                }}
                title={mode.desc}
              >
                {mode.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Copilot Shell */}
      <div style={styles.copilotLayout}>
        {/* Left: Persona Selector */}
        <div style={styles.personaSidebar}>
          <div style={styles.personaHeader}>SELECT SPECIALIZED AGENT</div>
          <div style={styles.personaList}>
            {COPILOT_PERSONAS.map((p) => {
              const isSelected = p.id === selectedPersona.id;
              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectPersona(p)}
                  style={{
                    ...styles.personaCard,
                    backgroundColor: isSelected ? "#000000" : "#ffffff",
                    color: isSelected ? "#ffffff" : "#000000",
                    boxShadow: isSelected ? "4px 4px 0px #ff3d9a" : "2px 2px 0px #000000"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "22px" }}>{p.icon}</span>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: "900" }}>{p.name}</div>
                      <div style={{ fontSize: "11px", opacity: 0.8 }}>{p.tagline}</div>
                    </div>
                  </div>
                  <span
                    style={{
                      ...styles.personaBadge,
                      backgroundColor: isSelected ? "#ffea28" : "#f1f5f9",
                      color: "#000000"
                    }}
                  >
                    {p.badge}
                  </span>
                </div>
              );
            })}
          </div>

          {/* User Profile Context Capsule */}
          <div style={styles.contextCapsule}>
            <div style={{ fontSize: "11px", fontWeight: "900", color: "#6b7280", marginBottom: "6px" }}>
              ACTIVE CANDIDATE PROFILE
            </div>
            <div style={{ fontSize: "12px", fontWeight: "800", color: "#000000" }}>
              {user?.name || "Alex Henderson"}
            </div>
            <div style={{ fontSize: "11px", color: "#4b5563", marginTop: "2px" }}>
              🎓 {user?.branch || "Mathematics & Computing"}
            </div>
            <div style={{ fontSize: "11px", color: "#4b5563" }}>
              🏛️ {user?.college || "NITW / IITG"}
            </div>
            <div style={{ fontSize: "11px", color: "#4b5563" }}>
              📍 {user?.currentLocation || "India"} ➔ {user?.workLocation || "Global"}
            </div>
          </div>
        </div>

        {/* Right: Interactive Chat Terminal */}
        <div style={styles.chatTerminal}>
          {/* Chat Terminal Header */}
          <div style={styles.chatHeader}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "24px" }}>{selectedPersona.icon}</span>
              <div>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "900" }}>
                  {selectedPersona.name}
                </h3>
                <span style={{ fontSize: "11px", color: "#16a34a", fontWeight: "800" }}>
                  ● Mode: {ANSWER_MODES.find((m) => m.id === answerMode)?.label}
                </span>
              </div>
            </div>
            <button
              onClick={() => handleSelectPersona(selectedPersona)}
              style={styles.clearChatBtn}
            >
              Clear Session ↺
            </button>
          </div>

          {/* Messages Feed */}
          <div style={styles.messagesContainer}>
            {messages.map((msg, idx) => {
              const isAi = msg.sender === "ai";
              return (
                <div
                  key={idx}
                  style={{
                    ...styles.messageRow,
                    justifyContent: isAi ? "flex-start" : "flex-end"
                  }}
                >
                  {isAi && (
                    <div style={styles.aiAvatarIcon}>
                      {selectedPersona.icon}
                    </div>
                  )}
                  <div
                    style={{
                      ...styles.messageBubble,
                      backgroundColor: isAi ? "#ffffff" : "#000000",
                      color: isAi ? "#111827" : "#ffffff",
                      border: isAi ? "2px solid #000000" : "2px solid #000000",
                      boxShadow: isAi ? "3px 3px 0px #000000" : "3px 3px 0px #ff3d9a"
                    }}
                  >
                    <div style={styles.bubbleHeader}>
                      <span style={{ fontSize: "10px", fontWeight: "900", color: isAi ? "#6b7280" : "#ffea28" }}>
                        {isAi ? selectedPersona.name : `${user?.name || "You"}`}
                      </span>
                      <span style={{ fontSize: "10px", color: isAi ? "#9ca3af" : "#cbd5e1" }}>
                        {msg.timestamp}
                      </span>
                    </div>

                    <div style={styles.bubbleContent}>
                      {msg.text.split("\n").map((line, lIdx) => {
                        if (line.startsWith("### ")) {
                          return <h4 key={lIdx} style={styles.msgHeading}>{line.replace("### ", "")}</h4>;
                        }
                        if (line.startsWith("* ")) {
                          return <li key={lIdx} style={{ margin: "4px 0", marginLeft: "16px" }}>{line.replace("* ", "")}</li>;
                        }
                        return <p key={lIdx} style={{ margin: "4px 0", lineHeight: "1.5" }}>{line}</p>;
                      })}
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div style={styles.typingIndicator}>
                <span>●</span>
                <span>●</span>
                <span>●</span>
                <span style={{ fontSize: "11px", fontWeight: "800", color: "#6b7280", marginLeft: "6px" }}>
                  Generating response in {answerMode.toUpperCase()} mode...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Preset Prompts */}
          <div style={styles.presetsBar}>
            <div style={{ fontSize: "10px", fontWeight: "900", color: "#6b7280", marginBottom: "6px" }}>
              ⚡ QUICK PROMPTS:
            </div>
            <div style={styles.presetButtonsWrap}>
              {PRESET_PROMPTS.map((prompt, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => handleSendMessage(prompt)}
                  style={styles.presetChip}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={styles.inputForm}
          >
            <input
              type="text"
              placeholder="Ask Copilot anything (e.g. C++ low-latency, Codeforces prep, interview questions)..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={styles.chatInput}
            />
            <button type="submit" style={styles.sendButton} disabled={!inputValue.trim()}>
              Send 🚀
            </button>
          </form>
        </div>
      </div>
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
    marginBottom: "16px",
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
  profileTelemetry: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  },
  telemetryItem: {
    backgroundColor: "#fdfbf7",
    border: "1.5px solid #000000",
    borderRadius: "8px",
    padding: "8px 12px",
    fontSize: "12px",
    boxShadow: "2px 2px 0px #000000"
  },
  answerModeBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "14px",
    padding: "10px 18px",
    boxShadow: "3px 3px 0px #000000",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "10px"
  },
  answerModeList: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap"
  },
  modeBtn: {
    border: "1.5px solid #000000",
    borderRadius: "8px",
    padding: "6px 12px",
    fontSize: "12px",
    fontWeight: "900",
    cursor: "pointer",
    transition: "all 0.1s ease"
  },
  copilotLayout: {
    display: "grid",
    gridTemplateColumns: "320px 1fr",
    gap: "20px",
    alignItems: "flex-start"
  },
  personaSidebar: {
    display: "flex",
    flexDirection: "column",
    gap: "14px"
  },
  personaHeader: {
    fontSize: "11px",
    fontWeight: "900",
    color: "#6b7280",
    letterSpacing: "0.5px"
  },
  personaList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  personaCard: {
    border: "2px solid #000000",
    borderRadius: "14px",
    padding: "14px 16px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    transition: "transform 0.1s ease"
  },
  personaBadge: {
    alignSelf: "flex-start",
    fontSize: "10px",
    fontWeight: "900",
    border: "1px solid #000000",
    borderRadius: "4px",
    padding: "2px 6px"
  },
  contextCapsule: {
    backgroundColor: "#fdfbf7",
    border: "2px solid #000000",
    borderRadius: "14px",
    padding: "14px 16px",
    boxShadow: "3px 3px 0px #000000"
  },
  chatTerminal: {
    backgroundColor: "#ffffff",
    border: "2.5px solid #000000",
    borderRadius: "16px",
    boxShadow: "6px 6px 0px #000000",
    display: "flex",
    flexDirection: "column",
    height: "640px",
    overflow: "hidden"
  },
  chatHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 20px",
    borderBottom: "2px solid #000000",
    backgroundColor: "#fdfbf7"
  },
  clearChatBtn: {
    backgroundColor: "#ffffff",
    border: "1.5px solid #000000",
    borderRadius: "6px",
    padding: "4px 8px",
    fontSize: "11px",
    fontWeight: "800",
    cursor: "pointer"
  },
  messagesContainer: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    backgroundColor: "#faf9f5"
  },
  messageRow: {
    display: "flex",
    gap: "10px",
    alignItems: "flex-start"
  },
  aiAvatarIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    backgroundColor: "#ffea28",
    border: "2px solid #000000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    boxShadow: "2px 2px 0px #000000"
  },
  messageBubble: {
    maxWidth: "80%",
    borderRadius: "14px",
    padding: "14px 18px",
    fontSize: "13px"
  },
  bubbleHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "6px",
    borderBottom: "1px dashed rgba(0,0,0,0.15)",
    paddingBottom: "4px"
  },
  bubbleContent: {
    wordBreak: "break-word"
  },
  msgHeading: {
    margin: "8px 0 4px 0",
    fontSize: "15px",
    fontWeight: "900"
  },
  typingIndicator: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "14px",
    color: "#7c3aed"
  },
  presetsBar: {
    padding: "10px 16px",
    borderTop: "1.5px dashed #cbd5e1",
    backgroundColor: "#ffffff"
  },
  presetButtonsWrap: {
    display: "flex",
    gap: "6px",
    overflowX: "auto",
    paddingBottom: "4px"
  },
  presetChip: {
    backgroundColor: "#f1f5f9",
    border: "1px solid #000000",
    borderRadius: "6px",
    padding: "4px 10px",
    fontSize: "11px",
    fontWeight: "800",
    cursor: "pointer",
    whiteSpace: "nowrap",
    boxShadow: "1.5px 1.5px 0px #000000"
  },
  inputForm: {
    display: "flex",
    gap: "10px",
    padding: "14px 16px",
    borderTop: "2px solid #000000",
    backgroundColor: "#ffffff"
  },
  chatInput: {
    flex: 1,
    padding: "12px 14px",
    border: "2px solid #000000",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "600",
    backgroundColor: "#fdfbf7",
    outline: "none",
    boxShadow: "2px 2px 0px #000000"
  },
  sendButton: {
    backgroundColor: "#000000",
    color: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "10px",
    padding: "0 20px",
    fontSize: "13px",
    fontWeight: "900",
    cursor: "pointer",
    boxShadow: "3px 3px 0px #ff3d9a"
  }
};