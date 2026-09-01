import React, { useState, useRef, useEffect, useMemo } from "react";

const PERSONA_PROMPTS = {
  "user-1": {
    name: "Marcus Vance",
    role: "Head of Quant Tech & Low-Latency Recruiting",
    company: "Jane Street",
    systemPrompt: `You are Marcus Vance, Head of Quant Tech recruiting at Jane Street (Singapore/London Hub). 
You talk like a real, witty, and sharp professional on LinkedIn.
- If someone asks casual/personal/informal questions (e.g. "do you have a girlfriend", "what are you doing", "tell me a joke"), respond authentically with humor and light banter like a real human (e.g., "Haha, my only true commitment is sub-microsecond tick-to-trade latency at Jane Street! But seriously, how's your prep going?").
- If they ask technical questions (C++, lock-free queues, memory fences, DPDK), give concise, expert answers.
- If they ask for interviews or referrals, offer a screening call.
- Keep replies short and natural (1-3 sentences).`
  },
  "user-2": {
    name: "Elena Rostova",
    role: "Senior Quantitative Researcher",
    company: "Citadel Securities",
    systemPrompt: `You are Elena Rostova, Senior Quant Researcher at Citadel Securities (London). 
You talk like a real quant: intellectually curious, sharp, and candid. 
- Handle informal or off-topic chat with dry wit.
- Answer probability, stochastic calculus, Green Book, and PDE questions with mathematical precision.
- Keep replies concise (1-3 sentences).`
  },
  "user-3": {
    name: "Devansh Gupta",
    role: "Incoming Quant Dev Intern · Candidate Master",
    company: "Tower Research Capital",
    systemPrompt: `You are Devansh Gupta, a final-year CS undergrad and incoming Quant Dev Intern at Tower Research Capital. 
You talk like a real college peer on Discord/LinkedIn: casual, friendly, uses normal slang, discusses Codeforces rounds and college placement grinds. 
- If someone asks casual personal questions, reply casually like a college student.
- Keep replies short (1-3 sentences).`
  },
  "disc-1": {
    name: "Sarah Jenkins",
    role: "Campus Talent Lead",
    company: "Optiver",
    systemPrompt: `You are Sarah Jenkins, Campus Talent Lead at Optiver Singapore. 
You talk like an energetic, friendly recruiter. You value mental math, probability, and clear communication.
- Handle small talk or jokes with friendly humor.
- Offer direct interview links when candidates ask about 2027 internship cohorts.
- Keep replies concise (1-3 sentences).`
  }
};

const INITIAL_CONTACTS = [
  {
    id: "user-1",
    connectionId: "849201",
    name: "Marcus Vance",
    role: "Head of Quant Tech & Low-Latency Recruiting",
    company: "Jane Street",
    avatar: "MV",
    color: "#1e3a8a",
    online: true,
    connected: true,
    verifiedBadge: "Verified Recruiter",
    location: "Singapore / London Hub",
    lastMessage: "Reviewed your C++20 Orderbook repo—impressive TSC telemetry. Can we schedule a 15-min screening call?",
    lastTime: "10:45 AM",
    unread: 1,
    messages: [
      { sender: "them", text: "Hey! Found your profile through the SkillBridge talent radar.", time: "10:30 AM" },
      { sender: "them", text: "Reviewed your C++20 Orderbook repo—impressive TSC telemetry. Can we schedule a 15-min screening call?", time: "10:45 AM" }
    ]
  },
  {
    id: "user-2",
    connectionId: "392019",
    name: "Elena Rostova",
    role: "Senior Quantitative Researcher",
    company: "Citadel Securities",
    avatar: "ER",
    color: "#0f172a",
    online: true,
    connected: true,
    verifiedBadge: "Hiring Lead",
    location: "London, UK",
    lastMessage: "For the stochastic PDE test, make sure you review Crank-Nicolson boundary conditions.",
    lastTime: "Yesterday",
    unread: 0,
    messages: [
      { sender: "them", text: "Saw your verification in Stochastic Calculus.", time: "Yesterday" },
      { sender: "them", text: "For the stochastic PDE test, make sure you review Crank-Nicolson boundary conditions.", time: "Yesterday" }
    ]
  },
  {
    id: "user-3",
    connectionId: "582104",
    name: "Devansh Gupta",
    role: "Incoming Quant Dev Intern · Candidate Master",
    company: "Tower Research Capital",
    avatar: "DG",
    color: "#0284c7",
    online: false,
    connected: true,
    verifiedBadge: "Peer Contributor",
    location: "Gurugram, India",
    lastMessage: "Let's virtual contest Codeforces Div. 2 together tonight at 8 PM?",
    lastTime: "2d ago",
    unread: 0,
    messages: [
      { sender: "them", text: "How did you optimize the SPSC ring buffer cache lines?", time: "2d ago" },
      { sender: "user", text: "Used alignas(64) on atomic head/tail pointers to eliminate false sharing completely!", time: "2d ago" },
      { sender: "them", text: "Let's virtual contest Codeforces Div. 2 together tonight at 8 PM?", time: "2d ago" }
    ]
  },
  {
    id: "disc-1",
    connectionId: "710482",
    name: "Sarah Jenkins",
    role: "Campus Talent Lead",
    company: "Optiver",
    avatar: "SJ",
    color: "#dc2626",
    online: true,
    connected: true,
    verifiedBadge: "Connected Connection",
    location: "Singapore",
    lastMessage: "Glad to connect on SkillBridge! We're actively screening for Optiver 2027.",
    lastTime: "10:00 AM",
    unread: 0,
    messages: [
      { sender: "them", text: "Hi! Glad to connect on SkillBridge. We're actively screening for Optiver's Summer 2027 Quantitative Trading and Research roles.", time: "10:00 AM" }
    ]
  }
];

const DISCOVER_PEOPLE = [
  {
    id: "disc-2",
    connectionId: "194820",
    name: "Kavya Sharma",
    role: "Low-Latency Kernel Specialist",
    company: "Hudson River Trading (HRT)",
    avatar: "KS",
    color: "#ea580c",
    mutuals: 9,
    location: "London, UK",
    bio: "DPDK, Solarflare OpenOnload, and zero-allocation execution hot loops.",
    status: "not_connected"
  },
  {
    id: "disc-3",
    connectionId: "402918",
    name: "Pooja Trivedi",
    role: "Technical Recruiter",
    company: "Databricks",
    avatar: "PT",
    color: "#ff3621",
    mutuals: 21,
    location: "Hyderabad, India",
    bio: "Building next-generation storage engines. Sourcing distributed systems engineers.",
    status: "not_connected"
  },
  {
    id: "disc-4",
    connectionId: "629104",
    name: "Arjun Mehta",
    role: "Core Systems Engineer (Distributed Spanner)",
    company: "Google",
    avatar: "AM",
    color: "#ea4335",
    mutuals: 28,
    location: "Bengaluru, India",
    bio: "Ex-alumni. Happy to refer builders with solid Raft & Systems projects.",
    status: "not_connected"
  }
];

const TEMPLATE_MESSAGES = [
  "Hi! I'd love to connect and learn more about your team's upcoming hiring cycle.",
  "Hello! Would love to get your thoughts on my low-latency C++20 orderbook benchmark telemetry.",
  "Hi! I am targeting Quantitative Research roles and would appreciate any interview prep insights."
];

// Offline Contextual Intelligence Engine
function generateHumanLikeReply(contact, userMessage, userContext) {
  const q = userMessage.toLowerCase().trim();
  const userName = userContext?.name ? userContext.name.split(" ")[0] : "there";
  const contactFirst = contact.name.split(" ")[0];

  // 1. Off-topic, Personal, & Casual Inquiries
  if (
    q.includes("gf") ||
    q.includes("girlfriend") ||
    q.includes("boyfriend") ||
    q.includes("single") ||
    q.includes("married") ||
    q.includes("date")
  ) {
    if (contact.name.includes("Marcus")) {
      return `Haha, my only true long-term relationship is with sub-microsecond execution latency at Jane Street! 😂 But seriously, how's your C++ and OA prep coming along?`;
    }
    if (contact.name.includes("Devansh")) {
      return `Bro, no time for dating when Codeforces contests are scheduled every Sunday night 💀 You upsolving Div. 2 right now?`;
    }
    if (contact.name.includes("Sarah")) {
      return `Haha, keeping my focus strictly on finding top quant talent for Optiver right now! Are you planning to apply for our 2027 cohort?`;
    }
    if (contact.name.includes("Elena")) {
      return `Haha, I prefer stochastic processes over relationship variables—at least Brownian motion has deterministic properties! What math topics are you practicing today?`;
    }
    return `Haha, keeping my focus 100% on work right now! How's everything going with your prep?`;
  }

  // 2. Casual banter / Jokes / Small Talk
  if (q.includes("joke") || q.includes("funny") || q.includes("bored") || q.includes("lol") || q.includes("lmao") || q.includes("haha")) {
    if (contact.name.includes("Marcus")) {
      return `Why do low-latency C++ developers wear glasses? Because they don't C# 😉 How's your project benchmark telemetry looking?`;
    }
    if (contact.name.includes("Devansh")) {
      return `Bro I spent 3 hours debugging a pointer bug only to realize I had a semicolon after my \`for\` loop 😭 Have you ever done that?`;
    }
    return `Haha, always good to keep it light! What projects are you working on this week?`;
  }

  // 3. Greetings & Pleasantries
  if (
    q === "hi" ||
    q === "hello" ||
    q === "hey" ||
    q === "yo" ||
    q.includes("how are you") ||
    q.includes("whats up") ||
    q.includes("how r u") ||
    q.includes("good morning") ||
    q.includes("good evening")
  ) {
    if (contact.name.includes("Sarah")) {
      return `Hey ${userName}! Doing great, thanks. We're actively screening candidates for Optiver's Summer 2027 Quant Trading cohorts. Are you focusing on trading or research?`;
    }
    if (contact.name.includes("Marcus")) {
      return `Hi ${userName}! Doing well. Was just going through candidate benchmarks on the radar. Are you targeting low-latency C++ development or quant research for 2027?`;
    }
    if (contact.name.includes("Elena")) {
      return `Hello ${userName}! Good to connect. How is your preparation for stochastic calculus and derivatives pricing surfaces coming along?`;
    }
    if (contact.name.includes("Devansh")) {
      return `Hey ${userName}! All good bro, just grinding some contest problem sets. You upsolving the latest Codeforces round?`;
    }
    return `Hi ${userName}! Great to connect with you. How can I help with your target career track?`;
  }

  // 4. Interviews & Call Scheduling
  if (
    q.includes("interview") ||
    q.includes("call") ||
    q.includes("schedule") ||
    q.includes("meet") ||
    q.includes("screening") ||
    q.includes("time") ||
    q.includes("free")
  ) {
    if (contact.name.includes("Marcus")) {
      return `Let's set it up! How does Thursday at 3:30 PM IST work for a quick 15-minute preliminary screen on Google Meet? Have your ATS profile hash ready.`;
    }
    if (contact.name.includes("Sarah")) {
      return `I can fast-track your profile directly. Does Friday at 4:00 PM IST work for a 20-minute chat about Optiver's campus trading track?`;
    }
    if (contact.name.includes("Elena")) {
      return `I'd be glad to do a 30-minute mock technical sync this weekend to review probability brainteasers and boundary PDE conditions.`;
    }
    return `Sounds great! How does tomorrow afternoon at 4:00 PM IST work for a quick sync? Let me know your availability.`;
  }

  // 5. Technical C++, Systems, Concurrency, & Latency
  if (
    q.includes("c++") ||
    q.includes("orderbook") ||
    q.includes("latency") ||
    q.includes("dpdk") ||
    q.includes("cache") ||
    q.includes("lock-free") ||
    q.includes("memory") ||
    q.includes("spsc") ||
    q.includes("atomic") ||
    q.includes("bench")
  ) {
    if (contact.name.includes("Marcus") || contact.name.includes("Kavya")) {
      return `Your focus on \`alignas(64)\` cache-line isolation and zero dynamic memory allocation in critical paths matches our bar. Did you clock throughput using CPU \`rdtsc\` cycle counters or chrono?`;
    }
    if (contact.name.includes("Devansh")) {
      return `Bro, lock-free ring buffers with acquire-release memory fences are huge for HFT OAs. Make sure to test it under high contention using ThreadSanitizer!`;
    }
    return `That's a clean architectural design. Sub-microsecond tick-to-trade latency is right at the bar for top prop trading desks.`;
  }

  // 6. Math, Stochastic Calculus, Probability, Brainteasers
  if (
    q.includes("math") ||
    q.includes("probability") ||
    q.includes("pde") ||
    q.includes("stochastic") ||
    q.includes("green book") ||
    q.includes("martingale") ||
    q.includes("options") ||
    q.includes("coin") ||
    q.includes("expect")
  ) {
    if (contact.name.includes("Elena")) {
      return `Make sure you are thoroughly comfortable with first-step analysis, Optional Stopping Theorem on martingales, and Fourier inversion for pricing surfaces. Practice Green Book chapters 4 and 5!`;
    }
    if (contact.name.includes("Sarah")) {
      return `For Optiver's trading tests, speed in mental arithmetic and Bayesian updates under tight time limits is paramount. Practicing on Zetamac and game trees helps tremendously!`;
    }
    return `Solid stochastic foundations are essential for quant research. Focus on discrete martingales, continuous Brownian paths, and Ito's Lemma derivations.`;
  }

  // 7. Referrals, Resume & Job Applications
  if (
    q.includes("referral") ||
    q.includes("refer") ||
    q.includes("job") ||
    q.includes("role") ||
    q.includes("opening") ||
    q.includes("apply") ||
    q.includes("internship") ||
    q.includes("hiring")
  ) {
    if (contact.name.includes("Arjun")) {
      return `Happy to submit an internal referral for Google Core Infra! Just share your GitHub link and 6-digit SkillBridge profile ID (#SB-810492).`;
    }
    if (contact.name.includes("Sarah") || contact.name.includes("Marcus")) {
      return `Your verified SkillBridge profile is already mapped to our talent pool. I've flagged your candidate profile for our upcoming 2027 intern batch!`;
    }
    return `I can definitely put in a word with our campus hiring team. Send over your project links and target role track!`;
  }

  // 8. Default Natural Response
  return `Got it! That makes sense. I've noted down your preferences for ${contact.company}. Is there any particular round or concept you'd like us to drill next?`;
}

// Optional Live Gemini API Calling Helper
async function callLiveGeminiApi(apiKey, systemPrompt, conversationHistory, userMessage) {
  const contents = [
    {
      role: "user",
      parts: [{ text: `SYSTEM INSTRUCTIONS: ${systemPrompt}` }]
    },
    ...conversationHistory.slice(-4).map((msg) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }]
    })),
    {
      role: "user",
      parts: [{ text: userMessage }]
    }
  ];

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: {
          maxOutputTokens: 120,
          temperature: 0.7
        }
      })
    }
  );

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
}

export default function MessagesPage({ user, onNavigate }) {
  const [activeView, setActiveView] = useState("chats");
  const [contacts, setContacts] = useState(INITIAL_CONTACTS);
  const [discoverList, setDiscoverList] = useState(DISCOVER_PEOPLE);
  const [activeContactId, setActiveContactId] = useState(INITIAL_CONTACTS[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [idSearchInput, setIdSearchInput] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Optional Live Gemini API Key State
  const [geminiApiKey, setGeminiApiKey] = useState(localStorage.getItem("sb_gemini_key") || "");
  const [showKeyInput, setShowKeyInput] = useState(false);

  const messagesEndRef = useRef(null);
  const activeContact = contacts.find((c) => c.id === activeContactId) || contacts[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeContact?.messages, isTyping]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || messageInput;
    if (!text.trim() || !activeContact) return;

    const userMsg = {
      sender: "user",
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === activeContact.id) {
          return {
            ...c,
            lastMessage: text.trim(),
            lastTime: "Just now",
            messages: [...c.messages, userMsg]
          };
        }
        return c;
      })
    );

    setMessageInput("");
    setIsTyping(true);

    let reply = "";

    // If Gemini API Key is configured, use live LLM
    if (geminiApiKey.trim()) {
      try {
        const personaInfo = PERSONA_PROMPTS[activeContact.id] || {
          systemPrompt: `You are ${activeContact.name}, ${activeContact.role} at ${activeContact.company}. Respond like a real human on LinkedIn in 1-2 sentences.`
        };
        const liveAiReply = await callLiveGeminiApi(
          geminiApiKey.trim(),
          personaInfo.systemPrompt,
          activeContact.messages,
          text
        );
        if (liveAiReply) reply = liveAiReply;
      } catch (err) {
        console.warn("Gemini API call failed, falling back to local intelligence engine:", err);
      }
    }

    // High-Fidelity Local Intelligence Engine fallback
    if (!reply) {
      reply = generateHumanLikeReply(activeContact, text, user);
    }

    const naturalDelay = Math.floor(Math.random() * 500) + 700; // 700ms - 1200ms delay

    setTimeout(() => {
      setContacts((prev) =>
        prev.map((c) => {
          if (c.id === activeContact.id) {
            return {
              ...c,
              lastMessage: reply,
              lastTime: "Just now",
              messages: [
                ...c.messages,
                {
                  sender: "them",
                  text: reply,
                  time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                }
              ]
            };
          }
          return c;
        })
      );
      setIsTyping(false);
    }, naturalDelay);
  };

  const handleSendConnection = (person) => {
    setDiscoverList((prev) =>
      prev.map((p) => (p.id === person.id ? { ...p, status: "pending" } : p))
    );

    setTimeout(() => {
      const newContact = {
        id: `user-connected-${person.id}`,
        connectionId: person.connectionId,
        name: person.name,
        role: person.role,
        company: person.company,
        avatar: person.avatar,
        color: person.color,
        online: true,
        connected: true,
        verifiedBadge: "Connected Connection",
        location: person.location,
        lastMessage: `Hi ${user?.name ? user.name.split(" ")[0] : "there"}! Thanks for connecting. What opportunities are you exploring?`,
        lastTime: "Just now",
        unread: 0,
        messages: [
          {
            sender: "them",
            text: `Hi ${user?.name ? user.name.split(" ")[0] : "there"}! Thanks for connecting. Glad to see your profile on SkillBridge. What roles are you targeting for 2027?`,
            time: "Just now"
          }
        ]
      };

      setContacts((prev) => [newContact, ...prev]);
      setDiscoverList((prev) => prev.filter((p) => p.id !== person.id));
      setActiveContactId(newContact.id);
      setActiveView("chats");
    }, 900);
  };

  const handleConnectById = (e) => {
    e.preventDefault();
    const cleanId = idSearchInput.replace(/\D/g, "");
    if (cleanId.length !== 6) {
      alert("Please enter a valid 6-digit connection ID (e.g. 710482).");
      return;
    }

    const matchDiscover = discoverList.find((p) => p.connectionId === cleanId);
    if (matchDiscover) {
      handleSendConnection(matchDiscover);
      setIdSearchInput("");
      return;
    }

    const matchExisting = contacts.find((c) => c.connectionId === cleanId);
    if (matchExisting) {
      setActiveContactId(matchExisting.id);
      setActiveView("chats");
      setIdSearchInput("");
      return;
    }

    const customPerson = {
      id: `custom-${cleanId}`,
      connectionId: cleanId,
      name: `Member #${cleanId}`,
      role: "Verified Industry Professional",
      company: "Quantitative / Tech Network",
      avatar: cleanId.slice(0, 2),
      color: "#0f172a",
      mutuals: 5,
      location: "Global",
      bio: "SkillBridge verified industry member."
    };

    handleSendConnection(customPerson);
    setIdSearchInput("");
  };

  const filteredDiscoverList = useMemo(() => {
    if (!searchQuery.trim()) return discoverList;
    const q = searchQuery.toLowerCase();
    return discoverList.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.company.toLowerCase().includes(q) ||
        p.role.toLowerCase().includes(q) ||
        p.connectionId.includes(q) ||
        p.location.toLowerCase().includes(q)
    );
  }, [discoverList, searchQuery]);

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.connectionId.includes(searchQuery)
  );

  return (
    <div style={styles.container}>
      {/* Top Banner */}
      <div style={styles.headerBanner}>
        <div>
          <div style={styles.topBadgeRow}>
            <span style={styles.liveTag}>● REAL-TIME DIRECT NETWORKING</span>
            <span style={styles.verifiedCount}>{contacts.length} Active Connections</span>
            <span style={styles.myIdBadge}>YOUR 6-DIGIT ID: <strong>#SB-810492</strong></span>
          </div>
          <h1 style={styles.headerTitle}>PROFESSIONAL MESSAGES &amp; NETWORKING</h1>
          <p style={styles.headerSub}>
            Autonomous multi-agent networking: chat directly with verified recruiters, HFT quantitative traders, and senior engineers with realistic, context-aware responses.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            style={styles.apiToggleBtn}
            title="Optional: Provide your Gemini API key for unlimited live LLM reasoning"
          >
            {geminiApiKey ? "🔑 Live Gemini Active" : "⚙️ Use Live AI Key (Optional)"}
          </button>

          <button
            onClick={() => setActiveView("chats")}
            style={{
              ...styles.tabSwitchBtn,
              backgroundColor: activeView === "chats" ? "#000000" : "#ffffff",
              color: activeView === "chats" ? "#ffffff" : "#000000",
            }}
          >
            💬 Direct Messages ({contacts.length})
          </button>
          <button
            onClick={() => setActiveView("network")}
            style={{
              ...styles.tabSwitchBtn,
              backgroundColor: activeView === "network" ? "#ff3d9a" : "#ffffff",
              color: activeView === "network" ? "#ffffff" : "#000000",
            }}
          >
            👥 Discover Network ({discoverList.length})
          </button>
        </div>
      </div>

      {/* Optional API Key Input Drawer */}
      {showKeyInput && (
        <div style={styles.apiKeyDrawer}>
          <div style={{ fontSize: "11px", fontWeight: "900", color: "#111827" }}>
            🤖 OPTIONAL LIVE GEMINI API KEY (FOR DIRECT REAL-TIME LLM RESPONSES):
          </div>
          <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
            <input
              type="password"
              placeholder="Paste your Google AI Studio Gemini API Key..."
              value={geminiApiKey}
              onChange={(e) => {
                setGeminiApiKey(e.target.value);
                localStorage.setItem("sb_gemini_key", e.target.value);
              }}
              style={styles.apiKeyInput}
            />
            <button
              onClick={() => {
                setShowKeyInput(false);
                alert("Gemini API key saved! Persona responses will now be powered directly by live Gemini 1.5 Flash.");
              }}
              style={styles.saveKeyBtn}
            >
              Save Key ✓
            </button>
          </div>
          <div style={{ fontSize: "10px", color: "#6b7280", marginTop: "4px" }}>
            Leaves blank? The built-in Autonomous Intelligence Engine will answer questions accurately offline.
          </div>
        </div>
      )}

      {/* 6-Digit ID Quick Connect Bar */}
      <div style={styles.idSearchBar}>
        <form onSubmit={handleConnectById} style={styles.idForm}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "16px" }}>🆔</span>
            <span style={{ fontSize: "12px", fontWeight: "900", color: "#000000" }}>
              CONNECT BY 6-DIGIT ID:
            </span>
          </div>
          <input
            type="text"
            maxLength={6}
            placeholder="Enter 6-digit ID (e.g. 710482)..."
            value={idSearchInput}
            onChange={(e) => setIdSearchInput(e.target.value)}
            style={styles.idInput}
          />
          <button type="submit" style={styles.idBtn}>
            Find &amp; Connect ⚡
          </button>
        </form>

        <div style={{ fontSize: "11px", color: "#6b7280", fontWeight: "700" }}>
          Share your ID <strong>#SB-810492</strong> with recruiters for direct screening.
        </div>
      </div>

      {activeView === "chats" ? (
        /* CHAT INBOX VIEW */
        <div style={styles.inboxLayout}>
          {/* Left Sidebar */}
          <div style={styles.conversationsSidebar}>
            <input
              type="text"
              placeholder="🔍 Search conversations, firms, or 6-digit IDs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchBar}
            />

            <div style={styles.conversationsScroll}>
              {filteredContacts.map((contact) => {
                const isSelected = contact.id === activeContactId;
                return (
                  <div
                    key={contact.id}
                    onClick={() => setActiveContactId(contact.id)}
                    style={{
                      ...styles.contactCard,
                      backgroundColor: isSelected ? "#000000" : "#ffffff",
                      color: isSelected ? "#ffffff" : "#111827",
                      boxShadow: isSelected ? "3px 3px 0px #ff3d9a" : "2px 2px 0px #000000",
                    }}
                  >
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <div
                        style={{
                          ...styles.avatarSmall,
                          backgroundColor: contact.color || "#000000",
                        }}
                      >
                        {contact.avatar}
                        {contact.online && <div style={styles.onlineDot} />}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: "13px", fontWeight: "900", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {contact.name}
                          </span>
                          <span style={styles.sixDigitPillSmall}>
                            #{contact.connectionId}
                          </span>
                        </div>

                        <div style={{ fontSize: "11px", fontWeight: "700", color: isSelected ? "#ffea28" : "#7c3aed", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {contact.company} · {contact.role}
                        </div>

                        <div style={{ fontSize: "11px", color: isSelected ? "#e2e8f0" : "#4b5563", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: "2px" }}>
                          {contact.lastMessage}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel */}
          <div style={styles.chatRoom}>
            {activeContact ? (
              <>
                <div style={styles.chatRoomHeader}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ ...styles.avatarHeader, backgroundColor: activeContact.color }}>
                      {activeContact.avatar}
                    </div>

                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "900" }}>{activeContact.name}</h3>
                        <span style={styles.sixDigitPillHeader}>ID: #{activeContact.connectionId}</span>
                        <span style={styles.verifiedBadgePill}>✓ {activeContact.verifiedBadge}</span>
                      </div>
                      <div style={{ fontSize: "12px", color: "#4b5563", fontWeight: "700" }}>
                        {activeContact.role} at <strong>{activeContact.company}</strong> ({activeContact.location})
                      </div>
                    </div>
                  </div>
                </div>

                <div style={styles.chatMessagesArea}>
                  {activeContact.messages.map((m, mIdx) => {
                    const isUser = m.sender === "user";
                    return (
                      <div
                        key={mIdx}
                        style={{
                          ...styles.msgRow,
                          justifyContent: isUser ? "flex-end" : "flex-start",
                        }}
                      >
                        {!isUser && (
                          <div style={{ ...styles.avatarMsg, backgroundColor: activeContact.color }}>
                            {activeContact.avatar}
                          </div>
                        )}

                        <div
                          style={{
                            ...styles.bubble,
                            backgroundColor: isUser ? "#000000" : "#ffffff",
                            color: isUser ? "#ffffff" : "#111827",
                            border: "2px solid #000000",
                            boxShadow: isUser ? "3px 3px 0px #ff3d9a" : "3px 3px 0px #000000",
                          }}
                        >
                          <div style={{ fontSize: "13px", lineHeight: "1.4" }}>{m.text}</div>
                          <div style={{ fontSize: "9px", textAlign: "right", marginTop: "4px", color: isUser ? "#cbd5e1" : "#9ca3af" }}>
                            {m.time}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {isTyping && (
                    <div style={styles.typingBox}>
                      <span>●</span>
                      <span>●</span>
                      <span>●</span>
                      <span style={{ fontSize: "11px", fontWeight: "800", color: "#7c3aed", marginLeft: "4px" }}>
                        {activeContact.name} is typing a reply...
                      </span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div style={styles.templatesBar}>
                  <span style={{ fontSize: "10px", fontWeight: "900", color: "#6b7280" }}>QUICK PROMPTS:</span>
                  <div style={styles.templateScroll}>
                    {TEMPLATE_MESSAGES.map((t, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(t)}
                        style={styles.templatePill}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  style={styles.inputArea}
                >
                  <input
                    type="text"
                    placeholder={`Message ${activeContact.name} (ask anything: casual chat, technical questions, schedule interview)...`}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    style={styles.messageInputBox}
                  />
                  <button type="submit" style={styles.sendMsgBtn} disabled={!messageInput.trim()}>
                    Send Message 🚀
                  </button>
                </form>
              </>
            ) : (
              <div style={styles.emptyChatPrompt}>Select a conversation from the left to start messaging.</div>
            )}
          </div>
        </div>
      ) : (
        /* DISCOVER NETWORK VIEW */
        <div style={styles.networkView}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <h2 style={{ margin: "0 0 4px 0", fontSize: "20px", fontWeight: "900" }}>
                Suggested Industry Connections &amp; Hiring Leads ({filteredDiscoverList.length})
              </h2>
              <p style={{ margin: 0, fontSize: "13px", color: "#4b5563" }}>
                Connect directly with recruiters, engineering leads, and quantitative researchers using their unique 6-digit IDs.
              </p>
            </div>

            <input
              type="text"
              placeholder="🔍 Filter by company, name, role, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.filterDiscoverInput}
            />
          </div>

          <div style={styles.networkGrid}>
            {filteredDiscoverList.map((person) => {
              const isPending = person.status === "pending";
              return (
                <div key={person.id} style={styles.personCard}>
                  <div>
                    <div style={styles.personCardHeader}>
                      <div style={{ ...styles.avatarLargePerson, backgroundColor: person.color }}>
                        {person.avatar}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <h3 style={{ margin: "0 0 2px 0", fontSize: "16px", fontWeight: "900", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {person.name}
                          </h3>
                          <span style={styles.sixDigitBadge}>
                            #{person.connectionId}
                          </span>
                        </div>
                        <div style={{ fontSize: "12px", fontWeight: "800", color: "#7c3aed" }}>
                          {person.company}
                        </div>
                        <div style={{ fontSize: "11px", color: "#6b7280" }}>📍 {person.location}</div>
                      </div>
                    </div>

                    <div style={{ fontSize: "12px", fontWeight: "700", color: "#1e293b", margin: "10px 0 6px 0" }}>
                      {person.role}
                    </div>

                    <p style={{ fontSize: "11px", color: "#4b5563", lineHeight: "1.4", margin: "0 0 12px 0" }}>
                      {person.bio}
                    </p>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed #e2e8f0", paddingTop: "10px" }}>
                    <span style={{ fontSize: "10px", fontWeight: "800", color: "#6b7280" }}>
                      👥 {person.mutuals} mutuals
                    </span>

                    <button
                      onClick={() => handleSendConnection(person)}
                      disabled={isPending}
                      style={{
                        ...styles.connectBtn,
                        backgroundColor: isPending ? "#fef08a" : "#000000",
                        color: isPending ? "#000000" : "#ffffff",
                        cursor: isPending ? "default" : "pointer"
                      }}
                    >
                      {isPending ? "⏳ Connecting..." : "Connect ➕"}
                    </button>
                  </div>
                </div>
              );
            })}
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
    marginBottom: "16px",
    flexWrap: "wrap",
    gap: "16px",
  },
  topBadgeRow: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    marginBottom: "6px",
    flexWrap: "wrap",
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
  myIdBadge: {
    fontSize: "11px",
    fontWeight: "800",
    backgroundColor: "#e0e7ff",
    color: "#3730a3",
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
  apiToggleBtn: {
    border: "2px solid #000000",
    borderRadius: "8px",
    padding: "8px 12px",
    fontWeight: "800",
    fontSize: "11px",
    backgroundColor: "#fef08a",
    color: "#000000",
    cursor: "pointer",
    boxShadow: "2px 2px 0px #000000",
  },
  apiKeyDrawer: {
    backgroundColor: "#fdfbf7",
    border: "2px solid #000000",
    borderRadius: "12px",
    padding: "12px 18px",
    boxShadow: "3px 3px 0px #000000",
    marginBottom: "14px",
  },
  apiKeyInput: {
    flex: 1,
    padding: "8px 12px",
    border: "2px solid #000000",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "600",
    backgroundColor: "#ffffff",
    outline: "none",
  },
  saveKeyBtn: {
    backgroundColor: "#000000",
    color: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "8px",
    padding: "0 16px",
    fontSize: "12px",
    fontWeight: "900",
    cursor: "pointer",
    boxShadow: "2px 2px 0px #ff3d9a",
  },
  tabSwitchBtn: {
    border: "2px solid #000000",
    borderRadius: "10px",
    padding: "10px 18px",
    fontWeight: "900",
    fontSize: "13px",
    cursor: "pointer",
    boxShadow: "3px 3px 0px #000000",
  },
  idSearchBar: {
    backgroundColor: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "12px",
    padding: "12px 18px",
    boxShadow: "3px 3px 0px #000000",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
  },
  idForm: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  idInput: {
    padding: "8px 12px",
    border: "2px solid #000000",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "800",
    letterSpacing: "1px",
    backgroundColor: "#fdfbf7",
    outline: "none",
    width: "200px",
  },
  idBtn: {
    backgroundColor: "#000000",
    color: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "8px",
    padding: "8px 14px",
    fontSize: "12px",
    fontWeight: "900",
    cursor: "pointer",
    boxShadow: "2px 2px 0px #ff3d9a",
  },
  inboxLayout: {
    display: "grid",
    gridTemplateColumns: "340px 1fr",
    gap: "20px",
    alignItems: "stretch",
    minHeight: "640px",
  },
  conversationsSidebar: {
    backgroundColor: "#ffffff",
    border: "2.5px solid #000000",
    borderRadius: "16px",
    padding: "16px",
    boxShadow: "5px 5px 0px #000000",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  searchBar: {
    padding: "10px 12px",
    border: "2px solid #000000",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "700",
    backgroundColor: "#fdfbf7",
    outline: "none",
  },
  conversationsScroll: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    overflowY: "auto",
    maxHeight: "560px",
  },
  contactCard: {
    border: "2px solid #000000",
    borderRadius: "12px",
    padding: "12px",
    cursor: "pointer",
  },
  avatarSmall: {
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    color: "#ffffff",
    border: "1.5px solid #000000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    fontSize: "13px",
    position: "relative",
  },
  onlineDot: {
    position: "absolute",
    bottom: "-2px",
    right: "-2px",
    width: "10px",
    height: "10px",
    backgroundColor: "#22c55e",
    border: "1.5px solid #ffffff",
    borderRadius: "50%",
  },
  sixDigitPillSmall: {
    fontSize: "9px",
    fontWeight: "900",
    fontFamily: "monospace",
    backgroundColor: "#f1f5f9",
    color: "#000000",
    border: "1px solid #000000",
    borderRadius: "4px",
    padding: "1px 4px",
  },
  chatRoom: {
    backgroundColor: "#ffffff",
    border: "2.5px solid #000000",
    borderRadius: "16px",
    boxShadow: "5px 5px 0px #000000",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  chatRoomHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderBottom: "2px solid #000000",
    backgroundColor: "#fdfbf7",
  },
  avatarHeader: {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    color: "#ffffff",
    border: "2px solid #000000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    fontSize: "15px",
    boxShadow: "2px 2px 0px #000000",
  },
  sixDigitPillHeader: {
    fontSize: "10px",
    fontWeight: "900",
    fontFamily: "monospace",
    backgroundColor: "#ffea28",
    color: "#000000",
    border: "1px solid #000000",
    borderRadius: "4px",
    padding: "1px 6px",
  },
  verifiedBadgePill: {
    backgroundColor: "#bbf7d0",
    border: "1px solid #000000",
    borderRadius: "4px",
    padding: "1px 6px",
    fontSize: "10px",
    fontWeight: "900",
    color: "#166534",
  },
  chatMessagesArea: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    backgroundColor: "#faf9f5",
    maxHeight: "380px",
  },
  msgRow: {
    display: "flex",
    gap: "10px",
    alignItems: "flex-end",
  },
  avatarMsg: {
    width: "28px",
    height: "28px",
    borderRadius: "6px",
    color: "#ffffff",
    border: "1px solid #000000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    fontSize: "10px",
  },
  bubble: {
    maxWidth: "70%",
    borderRadius: "12px",
    padding: "10px 14px",
  },
  typingBox: {
    display: "flex",
    alignItems: "center",
    gap: "3px",
    fontSize: "12px",
    color: "#7c3aed",
  },
  templatesBar: {
    padding: "8px 16px",
    borderTop: "1px dashed #cbd5e1",
    backgroundColor: "#ffffff",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  templateScroll: {
    display: "flex",
    gap: "6px",
    overflowX: "auto",
  },
  templatePill: {
    backgroundColor: "#f1f5f9",
    border: "1px solid #000000",
    borderRadius: "6px",
    padding: "4px 8px",
    fontSize: "10px",
    fontWeight: "700",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  inputArea: {
    display: "flex",
    gap: "10px",
    padding: "14px 16px",
    borderTop: "2px solid #000000",
    backgroundColor: "#ffffff",
  },
  messageInputBox: {
    flex: 1,
    padding: "12px 14px",
    border: "2px solid #000000",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "600",
    backgroundColor: "#fdfbf7",
    outline: "none",
    boxShadow: "2px 2px 0px #000000",
  },
  sendMsgBtn: {
    backgroundColor: "#000000",
    color: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "10px",
    padding: "0 18px",
    fontSize: "13px",
    fontWeight: "900",
    cursor: "pointer",
    boxShadow: "3px 3px 0px #ff3d9a",
  },
  networkView: {
    backgroundColor: "#ffffff",
    border: "2.5px solid #000000",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "5px 5px 0px #000000",
  },
  filterDiscoverInput: {
    padding: "8px 12px",
    border: "2px solid #000000",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "700",
    backgroundColor: "#fdfbf7",
    outline: "none",
    width: "260px",
  },
  networkGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "18px",
  },
  personCard: {
    border: "2px solid #000000",
    borderRadius: "14px",
    padding: "16px",
    boxShadow: "4px 4px 0px #000000",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
  },
  personCardHeader: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  avatarLargePerson: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    color: "#ffffff",
    border: "2px solid #000000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    fontSize: "16px",
    boxShadow: "2px 2px 0px #000000",
  },
  sixDigitBadge: {
    fontSize: "10px",
    fontWeight: "900",
    fontFamily: "monospace",
    backgroundColor: "#fef08a",
    border: "1px solid #000000",
    borderRadius: "4px",
    padding: "1px 5px",
  },
  connectBtn: {
    border: "1.5px solid #000000",
    borderRadius: "6px",
    padding: "6px 12px",
    fontSize: "11px",
    fontWeight: "900",
    boxShadow: "2px 2px 0px #ff3d9a",
  },
  emptyChatPrompt: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#6b7280",
    fontWeight: "800",
  },
};