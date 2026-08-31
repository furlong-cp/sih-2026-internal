import React, { useState, useMemo } from "react";

const SUB_COMMUNITIES = [
  // Reddit Subreddits
  {
    id: "r-quant",
    name: "r/quant",
    platform: "Reddit",
    icon: "📈",
    color: "#ff4500",
    members: "148k members",
    desc: "The premier forum for Quantitative Trading, Research, Stochastic PDEs & Alpha Discovery.",
    externalUrl: "https://www.reddit.com/r/quant/"
  },
  {
    id: "r-cpp",
    name: "r/cpp",
    platform: "Reddit",
    icon: "💻",
    color: "#004482",
    members: "280k members",
    desc: "Modern C++20/23 language standards, lock-free memory models, compiler optimizations.",
    externalUrl: "https://www.reddit.com/r/cpp/"
  },
  {
    id: "r-cscareerquestions",
    name: "r/cscareerquestions",
    platform: "Reddit",
    icon: "💼",
    color: "#ff4500",
    members: "1.2M members",
    desc: "Compensation breakdowns, early career advice, resume reviews, and big tech hiring trends.",
    externalUrl: "https://www.reddit.com/r/cscareerquestions/"
  },
  {
    id: "r-algorithms",
    name: "r/algorithms",
    platform: "Reddit",
    icon: "🧠",
    color: "#ff4500",
    members: "95k members",
    desc: "Graph theory, tree decompositions, asymptotic proofs, and competitive programming.",
    externalUrl: "https://www.reddit.com/r/algorithms/"
  },

  // LinkedIn Circles
  {
    id: "li-quant-referrals",
    name: "LinkedIn: Quant & HFT Referral Circle",
    platform: "LinkedIn",
    icon: "👔",
    color: "#0a66c2",
    members: "42k quants",
    desc: "Direct recruiters and desk heads from Jane Street, Citadel, Optiver, and HRT.",
    externalUrl: "https://www.linkedin.com"
  },
  {
    id: "li-staff-engineers",
    name: "LinkedIn: Staff Engineers & Tech Leads",
    platform: "LinkedIn",
    icon: "🛡️",
    color: "#0a66c2",
    members: "85k engineers",
    desc: "Distributed systems architectural teardowns and direct engineering referrals.",
    externalUrl: "https://www.linkedin.com"
  },

  // Quora Topics
  {
    id: "quora-quant-deconstruct",
    name: "Quora: Quant Interview Deconstructions",
    platform: "Quora",
    icon: "❓",
    color: "#b92b27",
    members: "310k followers",
    desc: "Long-form written answers by industry veterans on brainteasers, PDEs, and market making.",
    externalUrl: "https://www.quora.com/topic/Quantitative-Finance"
  },
  {
    id: "quora-systems",
    name: "Quora: High-Performance Architecture",
    platform: "Quora",
    icon: "⚙️",
    color: "#b92b27",
    members: "190k followers",
    desc: "CPU caches, cache line bouncing, kernel bypass drivers, and networking primitives.",
    externalUrl: "https://www.quora.com/topic/Computer-Architecture"
  },

  // Discord War Rooms
  {
    id: "dc-cp-war-room",
    name: "Discord: Codeforces Div. 1/2 War Room",
    platform: "Discord",
    icon: "👾",
    color: "#5865f2",
    members: "18k builders",
    desc: "Live voice and text contest review rooms right after Codeforces rounds conclude.",
    externalUrl: "https://discord.com"
  }
];

const INITIAL_POSTS = [
  {
    id: "POST-101",
    subCommunityId: "r-quant",
    platform: "Reddit",
    author: {
      name: "Rohan V.",
      college: "IIT Bombay",
      role: "Incoming Jane Street Intern",
      avatar: "RV",
      color: "#1e3a8a",
      rank: "Grandmaster (2410)",
      connectionId: "849201"
    },
    title: "[r/quant] Jane Street 2027 OA & Phone Screen Breakdown: SPSC Queues + Martingales",
    content:
      "Cross-posted from r/quant: Key interview stages for the Quant Dev intern cycle. Focus areas: 1) SPSC ring buffer memory fences (acquire/release), 2) Continuous coin-toss Markov transition equations, and 3) Custom allocator alignment on 64-byte boundaries. Practice Green Book Chapters 4 & 5.",
    timestamp: "2 hours ago",
    upvotes: 184,
    userUpvoted: false,
    tags: ["r/quant", "JaneStreet", "HFT", "ModernCpp", "Stochastics"],
    comments: [
      {
        id: "C-1",
        author: "Devansh G.",
        text: "Did they test discrete martingales or continuous Brownian motion in the second round?",
        time: "1 hour ago",
        avatar: "DG"
      },
      {
        id: "C-2",
        author: "Rohan V.",
        text: "First-step analysis and stopping times (Optional Stopping Theorem).",
        time: "45 mins ago",
        avatar: "RV"
      }
    ]
  },
  {
    id: "POST-102",
    subCommunityId: "li-quant-referrals",
    platform: "LinkedIn",
    author: {
      name: "Sarah Jenkins",
      college: "Optiver Campus Recruiting",
      role: "Campus Talent Lead",
      avatar: "SJ",
      color: "#dc2626",
      rank: "Verified Recruiter",
      connectionId: "710482"
    },
    title: "[LinkedIn Referral] Optiver 2027 Quantitative Trading & Research Track Open",
    content:
      "Direct referral intake for students graduating in Class of 2027 / 2028. Bypassing standard ATS filters for candidates with verified SkillBridge scores >= 720 and Codeforces >= 1800. Message your 6-digit SkillBridge ID directly.",
    timestamp: "4 hours ago",
    upvotes: 215,
    userUpvoted: false,
    tags: ["LinkedIn", "Optiver", "Hiring", "Referrals"],
    comments: [
      {
        id: "C-3",
        author: "Kavya S.",
        text: "Sent my 6-digit SkillBridge profile ID (#SB-810492) in DM!",
        time: "3 hours ago",
        avatar: "KS"
      }
    ]
  },
  {
    id: "POST-103",
    subCommunityId: "quora-quant-deconstruct",
    platform: "Quora",
    author: {
      name: "Elena Rostova",
      college: "Citadel Securities / Oxford",
      role: "Senior Quant Researcher",
      avatar: "ER",
      color: "#0f172a",
      rank: "Hiring Lead",
      connectionId: "392019"
    },
    title: "[Quora Answer] How to intuitively solve the 2-Heads (HH) Coin Toss expectation?",
    content:
      "Mathematical derivation: Let E be the expected total tosses. Formulate state transition equations:\nE = 1 + 0.5*E (if T) + 0.25*(1 + E) (if HT) + 0.25*(1) (if HH).\nSolving this linear system gives E = 6 total flips.",
    timestamp: "8 hours ago",
    upvotes: 142,
    userUpvoted: false,
    tags: ["Quora", "Probability", "Brainteasers", "Math"],
    comments: []
  },
  {
    id: "POST-104",
    subCommunityId: "r-cpp",
    platform: "Reddit",
    author: {
      name: "Arjun Mehta",
      college: "Google Cloud Spanner",
      role: "Senior Systems Engineer",
      avatar: "AM",
      color: "#ea4335",
      rank: "Google Core Infra",
      connectionId: "629104"
    },
    title: "[r/cpp] Linux io_uring vs Epoll: Benchmark numbers on 100K concurrent sockets",
    content:
      "Benchmark results on Linux kernel 6.8: io_uring ring-buffer submissions reduced syscall context switch overhead by 34% compared to standard epoll_wait in our high-QPS reverse proxy. Full GitHub benchmark and thread attached.",
    timestamp: "1 day ago",
    upvotes: 168,
    userUpvoted: false,
    tags: ["r/cpp", "LinuxKernel", "io_uring", "Epoll"],
    comments: []
  },
  {
    id: "POST-105",
    subCommunityId: "dc-cp-war-room",
    platform: "Discord",
    author: {
      name: "Aditya S.",
      college: "IIT Delhi",
      role: "Candidate Master (1945)",
      avatar: "AS",
      color: "#ea580c",
      rank: "Candidate Master",
      connectionId: "392019"
    },
    title: "[Discord War Room] Tonight's Codeforces Div. 2 Post-Contest Upsolving Sync",
    content:
      "We are holding a live Discord stage voice call right after Codeforces Round 954 ends to upsolve Problems D & E (Heavy-Light Decomposition and Treaps). Join the voice channel at 9:35 PM IST!",
    timestamp: "1 day ago",
    upvotes: 95,
    userUpvoted: false,
    tags: ["Discord", "Codeforces", "Upsolving", "WarRoom"],
    comments: []
  }
];

export default function CommunityPage({ user, onNavigate }) {
  const [subCommunitiesList, setSubCommunitiesList] = useState(SUB_COMMUNITIES);
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [selectedSubId, setSelectedSubId] = useState("all");
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});

  // New Post State
  const [newPost, setNewPost] = useState({
    subCommunityId: "r-quant",
    title: "",
    content: "",
    tags: ""
  });

  const platforms = ["All", "Reddit", "LinkedIn", "Quora", "Discord"];

  const handleUpvote = (postId) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            upvotes: p.userUpvoted ? p.upvotes - 1 : p.upvotes + 1,
            userUpvoted: !p.userUpvoted
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    const newC = {
      id: `C-${Date.now()}`,
      author: user?.name || "Alex Henderson",
      text: text.trim(),
      time: "Just now",
      avatar: user?.name ? user.name.slice(0, 2).toUpperCase() : "AH"
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...p.comments, newC]
          };
        }
        return p;
      })
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    const targetSub = subCommunitiesList.find((s) => s.id === newPost.subCommunityId);

    const created = {
      id: `POST-${Date.now()}`,
      subCommunityId: newPost.subCommunityId,
      platform: targetSub ? targetSub.platform : "Reddit",
      author: {
        name: user?.name || "Alex Henderson",
        college: user?.college || "NIT Warangal / IIT Guwahati",
        role: user?.targetCareer || "Quant Developer Track",
        avatar: user?.name ? user.name.slice(0, 2).toUpperCase() : "AH",
        color: "#000000",
        rank: "Candidate Master",
        connectionId: "810492"
      },
      title: `[${targetSub ? targetSub.name : "Community"}] ${newPost.title}`,
      content: newPost.content,
      timestamp: "Just now",
      upvotes: 1,
      userUpvoted: true,
      tags: newPost.tags.split(",").map((t) => t.trim()).filter(Boolean),
      comments: []
    };

    setPosts([created, ...posts]);
    setIsCreateModalOpen(false);
    setNewPost({ subCommunityId: "r-quant", title: "", content: "", tags: "" });
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchSub = selectedSubId === "all" || p.subCommunityId === selectedSubId;
      const matchPlat = selectedPlatform === "All" || p.platform === selectedPlatform;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.author.name.toLowerCase().includes(q);

      return matchSub && matchPlat && matchSearch;
    });
  }, [posts, selectedSubId, selectedPlatform, searchQuery]);

  const activeSubDetails = subCommunitiesList.find((s) => s.id === selectedSubId);

  return (
    <div style={styles.container}>
      {/* Top Banner */}
      <div style={styles.headerBanner}>
        <div>
          <div style={styles.topBadgeRow}>
            <span style={styles.liveTag}>● CROSS-PLATFORM SUB-COMMUNITIES HUB</span>
            <span style={styles.verifiedCount}>{subCommunitiesList.length} Top Industry Sub-Hubs</span>
          </div>
          <h1 style={styles.headerTitle}>REDDIT, LINKEDIN, QUORA &amp; DISCORD NETWORKS</h1>
          <p style={styles.headerSub}>
            Directly participate in top engineering subreddits, LinkedIn recruiter referral circles, Quora mathematical deconstructions, and Discord contest rooms.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          style={styles.createPostBtn}
        >
          + Post to Any Sub-Community ⚡
        </button>
      </div>

      {/* Platform Filter Selector Strip */}
      <div style={styles.platformBar}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "11px", fontWeight: "900", color: "#000000" }}>
            SELECT SOURCE PLATFORM:
          </span>
        </div>

        <div style={styles.platformPillsRow}>
          {platforms.map((plat) => {
            const isSelected = selectedPlatform === plat;
            return (
              <button
                key={plat}
                onClick={() => {
                  setSelectedPlatform(plat);
                  setSelectedSubId("all");
                }}
                style={{
                  ...styles.platBtn,
                  backgroundColor: isSelected ? "#000000" : "#ffffff",
                  color: isSelected ? "#ffffff" : "#000000",
                  boxShadow: isSelected ? "3px 3px 0px #ff3d9a" : "2px 2px 0px #000000"
                }}
              >
                {plat === "Reddit" && "🔴 "}
                {plat === "LinkedIn" && "💼 "}
                {plat === "Quora" && "🔴 "}
                {plat === "Discord" && "👾 "}
                {plat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Layout Grid */}
      <div style={styles.layoutGrid}>
        {/* Left: Sub-Communities Sidebar */}
        <div style={styles.sidebar}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={styles.sidebarHeader}>EXPLORE SUB-COMMUNITIES</span>
            <span style={{ fontSize: "10px", fontWeight: "900", color: "#7c3aed" }}>
              {subCommunitiesList.length} HUBS
            </span>
          </div>

          <div
            onClick={() => setSelectedSubId("all")}
            style={{
              ...styles.subCardItem,
              backgroundColor: selectedSubId === "all" ? "#000000" : "#ffffff",
              color: selectedSubId === "all" ? "#ffffff" : "#111827",
              boxShadow: selectedSubId === "all" ? "3px 3px 0px #ff3d9a" : "2px 2px 0px #000000"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "18px" }}>🌐</span>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "900" }}>All Cross-Platform Feeds</div>
                <div style={{ fontSize: "10px", opacity: 0.8 }}>Consolidated live feed from all networks</div>
              </div>
            </div>
          </div>

          <div style={styles.subList}>
            {subCommunitiesList
              .filter((s) => selectedPlatform === "All" || s.platform === selectedPlatform)
              .map((sub) => {
                const isSelected = selectedSubId === sub.id;
                return (
                  <div
                    key={sub.id}
                    onClick={() => setSelectedSubId(sub.id)}
                    style={{
                      ...styles.subCardItem,
                      backgroundColor: isSelected ? "#000000" : "#ffffff",
                      color: isSelected ? "#ffffff" : "#111827",
                      boxShadow: isSelected ? "3px 3px 0px #ff3d9a" : "2px 2px 0px #000000"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <span style={{ fontSize: "11px", fontWeight: "900", color: isSelected ? "#ffea28" : sub.color }}>
                        {sub.platform.toUpperCase()}
                      </span>
                      <span style={{ fontSize: "9px", color: isSelected ? "#cbd5e1" : "#6b7280", fontWeight: "700" }}>
                        {sub.members}
                      </span>
                    </div>

                    <div style={{ fontSize: "13px", fontWeight: "900", marginBottom: "2px" }}>
                      {sub.icon} {sub.name}
                    </div>

                    <div style={{ fontSize: "11px", opacity: 0.85, lineHeight: "1.3" }}>
                      {sub.desc}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Center/Right: Feed Stream */}
        <div style={styles.feedContainer}>
          {/* Active Sub-Hub Context Banner */}
          {activeSubDetails && (
            <div style={styles.subHeaderBox}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "24px" }}>{activeSubDetails.icon}</span>
                    <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "900" }}>{activeSubDetails.name}</h2>
                    <span style={styles.platformBadge}>{activeSubDetails.platform}</span>
                  </div>
                  <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#4b5563" }}>
                    {activeSubDetails.desc} · <strong>{activeSubDetails.members}</strong>
                  </p>
                </div>

                <a
                  href={activeSubDetails.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.openExternalBtn}
                >
                  Open Official {activeSubDetails.platform} ↗
                </a>
              </div>
            </div>
          )}

          {/* Search Bar */}
          <input
            type="text"
            placeholder="🔍 Search Reddit, LinkedIn referrals, Quora math deconstructions (e.g. Jane Street, io_uring, Optiver)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchBar}
          />

          {/* Posts Feed */}
          <div style={styles.postsList}>
            {filteredPosts.map((post) => (
              <div key={post.id} style={styles.postCard}>
                {/* Author & Source Bar */}
                <div style={styles.authorBar}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <div style={{ ...styles.avatarBox, backgroundColor: post.author.color }}>
                      {post.author.avatar}
                    </div>

                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "14px", fontWeight: "900" }}>{post.author.name}</span>
                        <span style={styles.authorRankBadge}>{post.author.rank}</span>
                        <span style={styles.authorIdBadge}>#{post.author.connectionId}</span>
                        <span
                          style={{
                            ...styles.originPill,
                            backgroundColor:
                              post.platform === "Reddit"
                                ? "#ff4500"
                                : post.platform === "LinkedIn"
                                ? "#0a66c2"
                                : post.platform === "Quora"
                                ? "#b92b27"
                                : "#5865f2"
                          }}
                        >
                          {post.platform}
                        </span>
                      </div>
                      <div style={{ fontSize: "11px", color: "#6b7280", fontWeight: "700" }}>
                        {post.author.role} · {post.author.college}
                      </div>
                    </div>
                  </div>

                  <span style={{ fontSize: "11px", color: "#9ca3af" }}>{post.timestamp}</span>
                </div>

                {/* Post Content */}
                <h3 style={styles.postTitle}>{post.title}</h3>
                <p style={styles.postText}>{post.content}</p>

                {/* Tags */}
                <div style={styles.tagsRow}>
                  {post.tags.map((tag, tIdx) => (
                    <span key={tIdx} style={styles.tagPill}>
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Post Footer */}
                <div style={styles.postFooter}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <button
                      onClick={() => handleUpvote(post.id)}
                      style={{
                        ...styles.upvoteBtn,
                        backgroundColor: post.userUpvoted ? "#ffea28" : "#f1f5f9",
                        border: "1.5px solid #000000"
                      }}
                    >
                      ▲ Upvote ({post.upvotes})
                    </button>
                    <span style={{ fontSize: "12px", fontWeight: "800", color: "#4b5563" }}>
                      💬 {post.comments.length} Comments
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      if (onNavigate) {
                        onNavigate("Messages");
                      }
                    }}
                    style={styles.dmAuthorBtn}
                  >
                    DM Author (ID: #{post.author.connectionId}) ↗
                  </button>
                </div>

                {/* Comments Thread */}
                {post.comments.length > 0 && (
                  <div style={styles.commentsBox}>
                    {post.comments.map((c) => (
                      <div key={c.id} style={styles.commentItem}>
                        <div style={styles.commentAvatar}>{c.avatar}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <strong style={{ fontSize: "12px" }}>{c.author}</strong>
                            <span style={{ fontSize: "10px", color: "#9ca3af" }}>{c.time}</span>
                          </div>
                          <div style={{ fontSize: "12px", color: "#374151", marginTop: "2px" }}>{c.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Add Comment */}
                <div style={styles.addCommentBar}>
                  <input
                    type="text"
                    placeholder="Write a reply or follow-up question..."
                    value={commentInputs[post.id] || ""}
                    onChange={(e) =>
                      setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddComment(post.id);
                    }}
                    style={styles.commentInput}
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    style={styles.commentSendBtn}
                  >
                    Reply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CREATE NEW POST MODAL */}
      {isCreateModalOpen && (
        <div style={modalStyles.overlay} onClick={() => setIsCreateModalOpen(false)}>
          <div style={modalStyles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={modalStyles.header}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: "900", color: "#6b7280" }}>CROSS-COMMUNITY FORUM</div>
                <h2 style={{ margin: "2px 0 0 0", fontSize: "20px", fontWeight: "900" }}>Publish Discussion / Referral</h2>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} style={modalStyles.closeBtn}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} style={modalStyles.formBody}>
              <div style={modalStyles.inputGroup}>
                <label style={modalStyles.label}>Target Sub-Community *</label>
                <select
                  value={newPost.subCommunityId}
                  onChange={(e) => setNewPost({ ...newPost, subCommunityId: e.target.value })}
                  style={modalStyles.select}
                >
                  {subCommunitiesList.map((s) => (
                    <option key={s.id} value={s.id}>
                      [{s.platform}] {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={modalStyles.inputGroup}>
                <label style={modalStyles.label}>Discussion / Referral Title *</label>
                <input
                  type="text"
                  placeholder="e.g. SPSC Lock-Free Queue Invariants in C++20 for HFT"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  style={modalStyles.input}
                  required
                />
              </div>

              <div style={modalStyles.inputGroup}>
                <label style={modalStyles.label}>Content / Code / Math Derivation *</label>
                <textarea
                  rows="4"
                  placeholder="Share detailed takeaways, OA debriefs, code snippets, or referral requirements..."
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  style={modalStyles.textarea}
                  required
                />
              </div>

              <div style={modalStyles.inputGroup}>
                <label style={modalStyles.label}>Tags (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="e.g. r/quant, JaneStreet, HFT, Probability"
                  value={newPost.tags}
                  onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                  style={modalStyles.input}
                />
              </div>

              <div style={modalStyles.actionRow}>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  style={modalStyles.cancelBtn}
                >
                  Cancel
                </button>
                <button type="submit" style={modalStyles.submitBtn}>
                  Publish to Sub-Community 🚀
                </button>
              </div>
            </form>
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
  createPostBtn: {
    backgroundColor: "#000000",
    color: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "10px",
    padding: "12px 18px",
    fontSize: "13px",
    fontWeight: "900",
    cursor: "pointer",
    boxShadow: "3px 3px 0px #ff3d9a"
  },
  platformBar: {
    backgroundColor: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "12px",
    padding: "10px 18px",
    boxShadow: "3px 3px 0px #000000",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "10px"
  },
  platformPillsRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap"
  },
  platBtn: {
    border: "1.5px solid #000000",
    borderRadius: "8px",
    padding: "6px 12px",
    fontSize: "12px",
    fontWeight: "900",
    cursor: "pointer"
  },
  layoutGrid: {
    display: "grid",
    gridTemplateColumns: "320px 1fr",
    gap: "20px",
    alignItems: "flex-start"
  },
  sidebar: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  sidebarHeader: {
    fontSize: "11px",
    fontWeight: "900",
    color: "#6b7280",
    letterSpacing: "0.5px"
  },
  subList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    maxHeight: "680px",
    overflowY: "auto"
  },
  subCardItem: {
    border: "2px solid #000000",
    borderRadius: "12px",
    padding: "12px 14px",
    cursor: "pointer",
    transition: "transform 0.1s ease"
  },
  feedContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  subHeaderBox: {
    backgroundColor: "#ffffff",
    border: "2.5px solid #000000",
    borderRadius: "14px",
    padding: "16px 20px",
    boxShadow: "4px 4px 0px #000000"
  },
  platformBadge: {
    backgroundColor: "#fef08a",
    border: "1px solid #000000",
    borderRadius: "4px",
    padding: "1px 6px",
    fontSize: "10px",
    fontWeight: "900"
  },
  openExternalBtn: {
    backgroundColor: "#ffffff",
    color: "#000000",
    border: "1.5px solid #000000",
    borderRadius: "8px",
    padding: "6px 12px",
    fontSize: "11px",
    fontWeight: "900",
    textDecoration: "none",
    boxShadow: "2px 2px 0px #000000"
  },
  searchBar: {
    padding: "12px 16px",
    border: "2.5px solid #000000",
    borderRadius: "12px",
    fontSize: "13px",
    fontWeight: "600",
    backgroundColor: "#ffffff",
    boxShadow: "4px 4px 0px #000000",
    outline: "none"
  },
  postsList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  postCard: {
    backgroundColor: "#ffffff",
    border: "2.5px solid #000000",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "5px 5px 0px #000000"
  },
  authorBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px"
  },
  avatarBox: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    color: "#ffffff",
    border: "2px solid #000000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    fontSize: "14px",
    boxShadow: "2px 2px 0px #000000"
  },
  authorRankBadge: {
    backgroundColor: "#ffea28",
    border: "1px solid #000000",
    borderRadius: "4px",
    padding: "1px 6px",
    fontSize: "10px",
    fontWeight: "900"
  },
  authorIdBadge: {
    backgroundColor: "#f1f5f9",
    border: "1px solid #000000",
    borderRadius: "4px",
    padding: "1px 5px",
    fontSize: "9px",
    fontWeight: "800",
    fontFamily: "monospace"
  },
  originPill: {
    color: "#ffffff",
    borderRadius: "4px",
    padding: "1px 6px",
    fontSize: "9px",
    fontWeight: "900"
  },
  postTitle: {
    margin: "0 0 8px 0",
    fontSize: "17px",
    fontWeight: "900",
    lineHeight: "1.3"
  },
  postText: {
    fontSize: "13px",
    color: "#374151",
    lineHeight: "1.5",
    margin: "0 0 12px 0"
  },
  tagsRow: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
    marginBottom: "14px"
  },
  tagPill: {
    backgroundColor: "#fdfbf7",
    border: "1px solid #000000",
    borderRadius: "6px",
    padding: "2px 6px",
    fontSize: "10px",
    fontWeight: "800",
    color: "#7c3aed"
  },
  postFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px dashed #e2e8f0",
    paddingTop: "12px",
    flexWrap: "wrap",
    gap: "10px"
  },
  upvoteBtn: {
    borderRadius: "8px",
    padding: "6px 12px",
    fontSize: "11px",
    fontWeight: "900",
    cursor: "pointer",
    boxShadow: "2px 2px 0px #000000"
  },
  dmAuthorBtn: {
    backgroundColor: "#ffffff",
    border: "1.5px solid #000000",
    borderRadius: "8px",
    padding: "6px 12px",
    fontSize: "11px",
    fontWeight: "900",
    cursor: "pointer",
    boxShadow: "2px 2px 0px #000000"
  },
  commentsBox: {
    marginTop: "12px",
    backgroundColor: "#faf9f5",
    border: "1.5px solid #000000",
    borderRadius: "10px",
    padding: "10px 12px",
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  commentItem: {
    display: "flex",
    gap: "8px",
    alignItems: "flex-start"
  },
  commentAvatar: {
    width: "24px",
    height: "24px",
    borderRadius: "6px",
    backgroundColor: "#000000",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "9px",
    fontWeight: "900"
  },
  addCommentBar: {
    display: "flex",
    gap: "8px",
    marginTop: "12px"
  },
  commentInput: {
    flex: 1,
    padding: "8px 12px",
    border: "1.5px solid #000000",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "600",
    backgroundColor: "#ffffff",
    outline: "none"
  },
  commentSendBtn: {
    backgroundColor: "#000000",
    color: "#ffffff",
    border: "1.5px solid #000000",
    borderRadius: "8px",
    padding: "0 14px",
    fontSize: "11px",
    fontWeight: "900",
    cursor: "pointer",
    boxShadow: "2px 2px 0px #ff3d9a"
  }
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
    padding: "20px"
  },
  modalCard: {
    backgroundColor: "#ffffff",
    border: "3px solid #000000",
    borderRadius: "20px",
    boxShadow: "10px 10px 0px #000000",
    maxWidth: "540px",
    width: "100%",
    padding: "26px",
    fontFamily: "'Space Grotesk', system-ui, sans-serif"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottom: "2px solid #000000",
    paddingBottom: "12px",
    marginBottom: "16px"
  },
  closeBtn: {
    background: "none",
    border: "2px solid #000000",
    borderRadius: "6px",
    width: "28px",
    height: "28px",
    fontWeight: "900",
    cursor: "pointer",
    boxShadow: "2px 2px 0px #000000"
  },
  formBody: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },
  label: {
    fontSize: "11px",
    fontWeight: "800",
    color: "#374151"
  },
  input: {
    padding: "10px 12px",
    border: "2px solid #000000",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    backgroundColor: "#fdfbf7",
    outline: "none"
  },
  select: {
    padding: "10px 12px",
    border: "2px solid #000000",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "700",
    backgroundColor: "#ffffff",
    cursor: "pointer"
  },
  textarea: {
    padding: "10px 12px",
    border: "2px solid #000000",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    backgroundColor: "#fdfbf7",
    outline: "none",
    resize: "vertical"
  },
  actionRow: {
    display: "flex",
    gap: "10px",
    marginTop: "12px"
  },
  cancelBtn: {
    backgroundColor: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "8px",
    padding: "10px 16px",
    fontWeight: "800",
    fontSize: "12px",
    cursor: "pointer",
    boxShadow: "2px 2px 0px #000000"
  },
  submitBtn: {
    flex: 1,
    backgroundColor: "#000000",
    color: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "8px",
    padding: "10px 16px",
    fontWeight: "900",
    fontSize: "12px",
    cursor: "pointer",
    boxShadow: "3px 3px 0px #ff3d9a"
  }
};