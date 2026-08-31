import React, { useState, useRef, useEffect } from "react";

const INITIAL_CONTACTS = [
  {
    id: "user-1",
    name: "Marcus Vance",
    role: "Head of Quant Tech & Low-Latency Recruiting",
    company: "Jane Street",
    avatar: "MV",
    color: "#1e3a8a",
    online: true,
    connected: true,
    verifiedBadge: "Verified Recruiter",
    location: "Singapore / London",
    lastMessage: "Reviewed your C++20 Orderbook repo—impressive TSC telemetry. Can we schedule a 15-min screening call?",
    lastTime: "10:45 AM",
    unread: 1,
    messages: [
      { sender: "them", text: "Hey! Found your profile through the SkillBridge HFT talent radar.", time: "10:30 AM" },
      { sender: "them", text: "Reviewed your C++20 Orderbook repo—impressive TSC telemetry. Can we schedule a 15-min screening call?", time: "10:45 AM" }
    ]
  },
  {
    id: "user-2",
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
      { sender: "them", text: "Saw your verification on Stochastic Calculus.", time: "Yesterday" },
      { sender: "user", text: "Currently preparing for the Summer Quant Researcher cycle.", time: "Yesterday" },
      { sender: "them", text: "For the stochastic PDE test, make sure you review Crank-Nicolson boundary conditions.", time: "Yesterday" }
    ]
  },
  {
    id: "user-3",
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
  }
];

const DISCOVER_PEOPLE = [
  {
    id: "disc-1",
    name: "Sarah Jenkins",
    role: "Campus Talent Lead",
    company: "Optiver",
    avatar: "SJ",
    color: "#dc2626",
    mutuals: 14,
    location: "Singapore",
    bio: "Hiring Quantitative Traders & Research Interns.",
    status: "not_connected"
  },
  {
    id: "disc-2",
    name: "Arjun Mehta",
    role: "Core Systems Engineer (Distributed Spanner)",
    company: "Google",
    avatar: "AM",
    color: "#ea4335",
    mutuals: 28,
    location: "Bengaluru, India",
    bio: "Systems alumni. Sourcing builders with solid Raft & Distributed Systems projects.",
    status: "not_connected"
  },
  {
    id: "disc-3",
    name: "Kavya Sharma",
    role: "Low-Latency Kernel Specialist",
    company: "Hudson River Trading (HRT)",
    avatar: "KS",
    color: "#ea580c",
    mutuals: 9,
    location: "London, UK",
    bio: "DPDK, Solarflare OpenOnload, C++20 hot loops.",
    status: "not_connected"
  },
  {
    id: "disc-4",
    name: "Pooja Trivedi",
    role: "Technical Recruiter",
    company: "Databricks",
    avatar: "PT",
    color: "#ff3621",
    mutuals: 21,
    location: "Hyderabad, India",
    bio: "Building next-gen AI Storage engines. Sourcing backend SWEs.",
    status: "not_connected"
  }
];

const TEMPLATE_MESSAGES = [
  "Hi! I'd love to connect and learn more about your team's hiring cycles.",
  "Hello! Would love to connect and get your thoughts on my C++20 matching engine repo.",
  "Hi! I am targeting Quantitative Research roles and would greatly appreciate any interview advice."
];

export default function MessagesPage({ user, onNavigate }) {
  const [activeView, setActiveView] = useState("chats");
  const [contacts, setContacts] = useState(INITIAL_CONTACTS);
  const [discoverList, setDiscoverList] = useState(DISCOVER_PEOPLE);
  const [activeContactId, setActiveContactId] = useState(INITIAL_CONTACTS[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const activeContact = contacts.find((c) => c.id === activeContactId) || contacts[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeContact?.messages, isTyping]);

  const handleSendMessage = (textToSend) => {
    const text = textToSend || messageInput;
    if (!text.trim() || !activeContact) return;

    const newMsg = {
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
            messages: [...c.messages, newMsg]
          };
        }
        return c;
      })
    );

    setMessageInput("");
    setIsTyping(true);

    setTimeout(() => {
      let replyText = "";
      const lower = text.toLowerCase();
      if (lower.includes("call") || lower.includes("interview") || lower.includes("schedule")) {
        replyText = "Sounds great! Let me know what time works best for a quick technical sync.";
      } else if (lower.includes("repo") || lower.includes("github") || lower.includes("project")) {
        replyText = "Checked the benchmark metrics—sub-microsecond latency is right at our hiring bar. Forwarding this to the team.";
      } else {
        replyText = `Thanks for reaching out! Let's stay connected regarding upcoming hiring cycles for ${user?.targetCareer || "engineering roles"}.`;
      }

      setContacts((prev) =>
        prev.map((c) => {
          if (c.id === activeContact.id) {
            return {
              ...c,
              lastMessage: replyText,
              lastTime: "Just now",
              messages: [
                ...c.messages,
                {
                  sender: "them",
                  text: replyText,
                  time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                }
              ]
            };
          }
          return c;
        })
      );
      setIsTyping(false);
    }, 1000);
  };

  const handleSendConnection = (person) => {
    setDiscoverList((prev) =>
      prev.map((p) => (p.id === person.id ? { ...p, status: "pending" } : p))
    );

    setTimeout(() => {
      const newContact = {
        id: `user-connected-${person.id}`,
        name: person.name,
        role: person.role,
        company: person.company,
        avatar: person.avatar,
        color: person.color,
        online: true,
        connected: true,
        verifiedBadge: "Connected Connection",
        location: person.location,
        lastMessage: "Connection request accepted! Say hello.",
        lastTime: "Just now",
        unread: 0,
        messages: [
          {
            sender: "them",
            text: `Hi ${user?.name || "there"}, thanks for connecting! Feel free to share your verified profile.`,
            time: "Just now"
          }
        ]
      };

      setContacts((prev) => [newContact, ...prev]);
      setDiscoverList((prev) => prev.filter((p) => p.id !== person.id));
      setActiveContactId(newContact.id);
      setActiveView("chats");
    }, 1200);
  };

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={styles.container}>
      {/* Top Banner */}
      <div style={styles.headerBanner}>
        <div>
          <div style={styles.topBadgeRow}>
            <span style={styles.liveTag}>● REAL-TIME DIRECT NETWORKING</span>
            <span style={styles.verifiedCount}>{contacts.length} Active Connections</span>
          </div>
          <h1 style={styles.headerTitle}>PROFESSIONAL MESSAGES &amp; NETWORKING</h1>
          <p style={styles.headerSub}>
            Direct communication channels with verified recruiters, HFT quantitative engineers, and tech peers.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
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

      {activeView === "chats" ? (
        <div style={styles.inboxLayout}>
          {/* Left Sidebar */}
          <div style={styles.conversationsSidebar}>
            <input
              type="text"
              placeholder="🔍 Search conversations, recruiters, firms..."
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
                          <span style={{ fontSize: "10px", color: isSelected ? "#cbd5e1" : "#6b7280" }}>
                            {contact.lastTime}
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
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "900" }}>{activeContact.name}</h3>
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
                      <span style={{ fontSize: "11px", fontWeight: "800", color: "#6b7280", marginLeft: "4px" }}>
                        {activeContact.name} is typing...
                      </span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div style={styles.templatesBar}>
                  <span style={{ fontSize: "10px", fontWeight: "900", color: "#6b7280" }}>QUICK TEMPLATES:</span>
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
                    placeholder={`Message ${activeContact.name}...`}
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
        <div style={styles.networkView}>
          <div style={{ marginBottom: "16px" }}>
            <h2 style={{ margin: "0 0 4px 0", fontSize: "20px", fontWeight: "900" }}>
              Suggested Industry Connections &amp; Hiring Leads
            </h2>
            <p style={{ margin: 0, fontSize: "13px", color: "#4b5563" }}>
              Connect directly with recruiters and senior engineers from top tech and quantitative firms.
            </p>
          </div>

          <div style={styles.networkGrid}>
            {discoverList.map((person) => {
              const isPending = person.status === "pending";
              return (
                <div key={person.id} style={styles.personCard}>
                  <div style={styles.personCardHeader}>
                    <div style={{ ...styles.avatarLargePerson, backgroundColor: person.color }}>
                      {person.avatar}
                    </div>
                    <div>
                      <h3 style={{ margin: "0 0 2px 0", fontSize: "16px", fontWeight: "900" }}>{person.name}</h3>
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

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed #e2e8f0", paddingTop: "10px" }}>
                    <span style={{ fontSize: "10px", fontWeight: "800", color: "#6b7280" }}>
                      👥 {person.mutuals} mutual connections
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
  verifiedCount: {
    fontSize: "11px",
    fontWeight: "900",
    backgroundColor: "#ffea28",
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
  tabSwitchBtn: {
    border: "2px solid #000000",
    borderRadius: "10px",
    padding: "10px 18px",
    fontWeight: "900",
    fontSize: "13px",
    cursor: "pointer",
    boxShadow: "3px 3px 0px #000000",
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