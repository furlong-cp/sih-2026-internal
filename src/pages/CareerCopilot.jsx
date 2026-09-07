import React, { useState, useMemo } from "react";

const CAREER_OPTIONS = [
  "Software Engineer",
  "Quant Developer",
  "Data Scientist",
  "Product Manager",
  "General / Exploring"
];

const LEVEL_OPTIONS = ["Beginner", "Intermediate", "Advanced"];

const ROADMAP_TEMPLATES = {
  "Software Engineer": [
    {
      title: "Foundations",
      tasks: [
        "Get comfortable with one language end-to-end (Python or JavaScript)",
        "Learn core data structures: arrays, hash maps, trees, graphs",
        "Build 2 small projects and push them to GitHub"
      ]
    },
    {
      title: "Core Skills",
      tasks: [
        "Practice algorithms daily (aim for 3 problems/week)",
        "Learn Git branching, PRs, and code review basics",
        "Build a full-stack project with a database and an API"
      ]
    },
    {
      title: "System Design & Depth",
      tasks: [
        "Study system design fundamentals (caching, load balancing, queues)",
        "Contribute to an open-source repo",
        "Write documentation for one of your projects"
      ]
    },
    {
      title: "Interview Ready",
      tasks: [
        "Do 4–6 mock interviews (peer or platform-based)",
        "Polish your resume and GitHub profile",
        "Apply and track applications weekly"
      ]
    }
  ],
  "Quant Developer": [
    {
      title: "Math & Programming Base",
      tasks: [
        "Refresh probability, linear algebra, and calculus fundamentals",
        "Get fluent in Python (NumPy/Pandas) and start learning C++",
        "Solve 20+ problems on a competitive programming site"
      ]
    },
    {
      title: "Core Quant Skills",
      tasks: [
        "Learn stochastic processes and basic option pricing",
        "Study concurrency and memory models in C++",
        "Build a simple backtester or order-book simulator"
      ]
    },
    {
      title: "Applied Projects",
      tasks: [
        "Implement a lock-free data structure or low-latency component",
        "Work through past quant interview problem sets",
        "Read one finance/quant book cover to cover"
      ]
    },
    {
      title: "Interview Ready",
      tasks: [
        "Practice mental math and probability puzzles daily",
        "Do timed mock interviews focused on brainteasers and coding",
        "Target applications to prop desks and trading firms"
      ]
    }
  ],
  "Data Scientist": [
    {
      title: "Foundations",
      tasks: [
        "Learn Python for data analysis (Pandas, NumPy, Matplotlib)",
        "Review statistics: distributions, hypothesis testing, regression",
        "Complete a guided exploratory data analysis project"
      ]
    },
    {
      title: "Core Machine Learning",
      tasks: [
        "Learn supervised and unsupervised learning fundamentals",
        "Practice feature engineering and model evaluation",
        "Enter a beginner-friendly Kaggle competition"
      ]
    },
    {
      title: "Applied Projects",
      tasks: [
        "Build an end-to-end project with a deployed model",
        "Learn SQL well enough to query real datasets confidently",
        "Write up a project as a short case study"
      ]
    },
    {
      title: "Interview Ready",
      tasks: [
        "Review classic ML interview questions and case studies",
        "Practice explaining projects clearly and concisely",
        "Apply broadly and iterate on your portfolio"
      ]
    }
  ],
  "Product Manager": [
    {
      title: "Foundations",
      tasks: [
        "Learn the basics of product strategy and user research",
        "Study how metrics and KPIs are used to guide decisions",
        "Shadow or interview a working PM about their day-to-day"
      ]
    },
    {
      title: "Core Skills",
      tasks: [
        "Practice writing a one-page product spec (PRD)",
        "Learn to read basic SQL to answer product questions",
        "Run a small user interview or survey"
      ]
    },
    {
      title: "Applied Projects",
      tasks: [
        "Design a case study: pick a product and propose an improvement",
        "Practice prioritization frameworks (RICE, MoSCoW)",
        "Build a simple roadmap for a hypothetical product"
      ]
    },
    {
      title: "Interview Ready",
      tasks: [
        "Practice product sense and estimation questions",
        "Prepare 2–3 strong stories using the STAR format",
        "Apply and tailor your resume per role"
      ]
    }
  ],
  "General / Exploring": [
    {
      title: "Explore",
      tasks: [
        "Talk to 3 people working in fields you're curious about",
        "Try a short intro course in 2 different areas",
        "Note what kind of problems you enjoy solving"
      ]
    },
    {
      title: "Narrow Down",
      tasks: [
        "Pick one direction to focus on for the next stretch",
        "List the core skills that direction requires",
        "Find one project you could build to test your interest"
      ]
    },
    {
      title: "Build Skills",
      tasks: [
        "Work through a structured course in your chosen area",
        "Build a small project and share it for feedback",
        "Join a community or group related to the field"
      ]
    },
    {
      title: "Take Action",
      tasks: [
        "Update your resume to reflect your new direction",
        "Reach out to people already working in the field",
        "Apply to a role, internship, or relevant program"
      ]
    }
  ]
};

const COURSE_LIBRARY = {
  "Software Engineer": [
    { title: "CS50: Introduction to Computer Science", provider: "Harvard / edX", level: "Beginner", url: "https://www.edx.org/learn/computer-science/harvard-university-cs50-s-introduction-to-computer-science" },
    { title: "The Odin Project — Full Stack Path", provider: "The Odin Project (Free)", level: "Beginner–Intermediate", url: "https://www.theodinproject.com/" },
    { title: "Data Structures & Algorithms", provider: "freeCodeCamp (Free)", level: "Intermediate", url: "https://www.freecodecamp.org/learn/coding-interview-prep/" },
    { title: "Grokking the System Design Interview", provider: "Educative", level: "Advanced", url: "https://www.educative.io/courses/grokking-the-system-design-interview" }
  ],
  "Quant Developer": [
    { title: "Mathematics for Machine Learning Specialization", provider: "Coursera", level: "Beginner–Intermediate", url: "https://www.coursera.org/specializations/mathematics-machine-learning" },
    { title: "Financial Engineering and Risk Management", provider: "Columbia / Coursera", level: "Intermediate", url: "https://www.coursera.org/specializations/financialengineering" },
    { title: "QuantStart — Quantitative Trading Articles", provider: "QuantStart (Free)", level: "Intermediate–Advanced", url: "https://www.quantstart.com/" },
    { title: "C++ Concurrency in Practice (search)", provider: "Udemy", level: "Advanced", url: "https://www.udemy.com/courses/search/?q=c%2B%2B%20concurrency" }
  ],
  "Data Scientist": [
    { title: "Machine Learning Specialization", provider: "Andrew Ng / Coursera", level: "Beginner–Intermediate", url: "https://www.coursera.org/specializations/machine-learning-introduction" },
    { title: "IBM Data Science Professional Certificate", provider: "IBM / edX", level: "Beginner", url: "https://www.edx.org/professional-certificate/ibm-data-science" },
    { title: "Kaggle Learn — Free Micro-Courses", provider: "Kaggle (Free)", level: "Beginner–Intermediate", url: "https://www.kaggle.com/learn" },
    { title: "Deep Learning Specialization", provider: "Andrew Ng / Coursera", level: "Advanced", url: "https://www.coursera.org/specializations/deep-learning" }
  ],
  "Product Manager": [
    { title: "Digital Product Management Specialization", provider: "University of Virginia / Coursera", level: "Beginner–Intermediate", url: "https://www.coursera.org/specializations/uva-darden-digital-product-management" },
    { title: "Product Management Resources", provider: "Product School (Free & Paid)", level: "Beginner", url: "https://productschool.com/" },
    { title: "Reforge Programs", provider: "Reforge", level: "Intermediate–Advanced", url: "https://www.reforge.com/" },
    { title: "SQL for Data Analysis", provider: "Udacity", level: "Beginner", url: "https://www.udacity.com/course/sql-for-data-analysis--ud198" }
  ],
  "General / Exploring": [
    { title: "Coursera Career Explorer", provider: "Coursera", level: "Beginner", url: "https://www.coursera.org/browse" },
    { title: "Google Career Certificates", provider: "Google / Coursera", level: "Beginner", url: "https://grow.google/certificates/" },
    { title: "Khan Academy — Career Skills", provider: "Khan Academy (Free)", level: "Beginner", url: "https://www.khanacademy.org/college-careers-more" },
    { title: "80,000 Hours Career Guide", provider: "80,000 Hours (Free)", level: "Beginner", url: "https://80000hours.org/career-guide/" }
  ]
};

export default function CareerCopilotPage({ user, score = 0, onNavigate }) {
  const [career, setCareer] = useState(user?.targetCareer && CAREER_OPTIONS.includes(user.targetCareer) ? user.targetCareer : CAREER_OPTIONS[0]);
  const [level, setLevel] = useState("Beginner");
  const [months, setMonths] = useState(3);
  const [roadmap, setRoadmap] = useState(null);
  const [checked, setChecked] = useState({});

  const courses = COURSE_LIBRARY[career] || COURSE_LIBRARY["General / Exploring"];

  const handleGenerate = () => {
    const template = ROADMAP_TEMPLATES[career] || ROADMAP_TEMPLATES["General / Exploring"];
    const totalWeeks = Math.max(months, 1) * 4;
    const perPhase = Math.max(Math.round(totalWeeks / template.length), 1);

    const generated = template.map((phase, i) => ({
      ...phase,
      weekRange: `Weeks ${i * perPhase + 1}–${(i + 1) * perPhase}`
    }));

    setRoadmap(generated);
    setChecked({});
  };

  const toggleTask = (phaseIdx, taskIdx) => {
    const key = `${phaseIdx}-${taskIdx}`;
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const progress = useMemo(() => {
    if (!roadmap) return 0;
    const totalTasks = roadmap.reduce((sum, p) => sum + p.tasks.length, 0);
    const doneTasks = Object.values(checked).filter(Boolean).length;
    return totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);
  }, [roadmap, checked]);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.headerBanner}>
        <div>
          <span style={styles.liveTag}>Career Copilot</span>
          <h1 style={styles.headerTitle}>Plan your next career move</h1>
          <p style={styles.headerSub}>
            {user?.name ? `Hi ${user.name}, build` : "Build"} a roadmap and find courses for the role you're aiming for.
          </p>
        </div>
        <div style={styles.telemetryItem}>
          <span>Skill Score:</span> <strong>{score} / 1000</strong>
        </div>
      </div>

      {/* Setup card */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Build your roadmap</h3>
        <div style={styles.formRow}>
          <label style={styles.formField}>
            <span style={styles.fieldLabel}>Target role</span>
            <select style={styles.select} value={career} onChange={(e) => setCareer(e.target.value)}>
              {CAREER_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <label style={styles.formField}>
            <span style={styles.fieldLabel}>Current level</span>
            <select style={styles.select} value={level} onChange={(e) => setLevel(e.target.value)}>
              {LEVEL_OPTIONS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </label>
          <label style={styles.formField}>
            <span style={styles.fieldLabel}>Timeframe (months)</span>
            <input
              type="number"
              min={1}
              max={24}
              value={months}
              onChange={(e) => setMonths(Number(e.target.value) || 1)}
              style={styles.select}
            />
          </label>
        </div>
        <button style={styles.generateBtn} onClick={handleGenerate}>
          Generate roadmap
        </button>
      </div>

      {/* Roadmap */}
      {roadmap && (
        <div style={styles.card}>
          <div style={styles.roadmapHeader}>
            <h3 style={styles.cardTitle}>Your {career} roadmap</h3>
            <div style={styles.progressWrap}>
              <div style={styles.progressTrack}>
                <div style={{ ...styles.progressFill, width: `${progress}%` }} />
              </div>
              <span style={styles.progressLabel}>{progress}% complete</span>
            </div>
          </div>

          <div style={styles.phaseGrid}>
            {roadmap.map((phase, pIdx) => (
              <div key={pIdx} style={styles.phaseCard}>
                <div style={styles.phaseHeader}>
                  <span style={styles.phaseNumber}>{pIdx + 1}</span>
                  <div>
                    <div style={styles.phaseTitle}>{phase.title}</div>
                    <div style={styles.phaseWeeks}>{phase.weekRange}</div>
                  </div>
                </div>
                <ul style={styles.taskList}>
                  {phase.tasks.map((task, tIdx) => {
                    const key = `${pIdx}-${tIdx}`;
                    const done = !!checked[key];
                    return (
                      <li key={key} style={styles.taskItem} onClick={() => toggleTask(pIdx, tIdx)}>
                        <span style={{ ...styles.checkbox, backgroundColor: done ? "#000" : "#fff" }}>
                          {done ? "✓" : ""}
                        </span>
                        <span style={{ textDecoration: done ? "line-through" : "none", opacity: done ? 0.55 : 1 }}>
                          {task}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended courses */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Recommended courses for {career}</h3>
        <div style={styles.courseGrid}>
          {courses.map((course, idx) => (
            <a key={idx} href={course.url} target="_blank" rel="noopener noreferrer" style={styles.courseCard}>
              <div style={styles.courseLevel}>{course.level}</div>
              <div style={styles.courseTitle}>{course.title}</div>
              <div style={styles.courseProvider}>{course.provider}</div>
              <div style={styles.courseLink}>View course ↗</div>
            </a>
          ))}
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
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: "16px"
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
    flexWrap: "wrap",
    gap: "16px"
  },
  liveTag: {
    fontSize: "12px",
    fontWeight: 700,
    color: "#7c3aed"
  },
  headerTitle: {
    margin: "6px 0 4px 0",
    fontSize: "24px",
    fontWeight: 900,
    letterSpacing: "-0.5px"
  },
  headerSub: {
    margin: 0,
    fontSize: "13px",
    color: "#4b5563"
  },
  telemetryItem: {
    backgroundColor: "#fdfbf7",
    border: "1.5px solid #000000",
    borderRadius: "8px",
    padding: "8px 12px",
    fontSize: "12px",
    boxShadow: "2px 2px 0px #000000"
  },
  card: {
    backgroundColor: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "16px",
    padding: "20px 24px",
    boxShadow: "4px 4px 0px #000000"
  },
  cardTitle: {
    margin: "0 0 14px 0",
    fontSize: "16px",
    fontWeight: 900
  },
  formRow: {
    display: "flex",
    gap: "14px",
    flexWrap: "wrap",
    marginBottom: "16px"
  },
  formField: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    flex: "1 1 180px"
  },
  fieldLabel: {
    fontSize: "11px",
    fontWeight: 700,
    color: "#6b7280"
  },
  select: {
    padding: "10px 12px",
    border: "2px solid #000000",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: 600,
    backgroundColor: "#fdfbf7"
  },
  generateBtn: {
    backgroundColor: "#000000",
    color: "#ffffff",
    border: "2px solid #000000",
    borderRadius: "10px",
    padding: "10px 20px",
    fontSize: "13px",
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "3px 3px 0px #7c3aed"
  },
  roadmapHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "10px"
  },
  progressWrap: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  progressTrack: {
    width: "140px",
    height: "8px",
    borderRadius: "4px",
    backgroundColor: "#e5e7eb",
    border: "1px solid #000000",
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#7c3aed",
    transition: "width 0.2s ease"
  },
  progressLabel: {
    fontSize: "11px",
    fontWeight: 700,
    color: "#6b7280"
  },
  phaseGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "14px"
  },
  phaseCard: {
    border: "1.5px solid #000000",
    borderRadius: "12px",
    padding: "14px",
    backgroundColor: "#faf9f5"
  },
  phaseHeader: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    marginBottom: "10px"
  },
  phaseNumber: {
    width: "28px",
    height: "28px",
    borderRadius: "8px",
    backgroundColor: "#ffea28",
    border: "1.5px solid #000000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900,
    fontSize: "13px",
    flexShrink: 0
  },
  phaseTitle: {
    fontSize: "13px",
    fontWeight: 800
  },
  phaseWeeks: {
    fontSize: "11px",
    color: "#6b7280"
  },
  taskList: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  taskItem: {
    display: "flex",
    gap: "8px",
    alignItems: "flex-start",
    fontSize: "12px",
    cursor: "pointer",
    lineHeight: 1.4
  },
  checkbox: {
    width: "16px",
    height: "16px",
    borderRadius: "4px",
    border: "1.5px solid #000000",
    color: "#ffffff",
    fontSize: "11px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: "1px"
  },
  courseGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px"
  },
  courseCard: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    border: "1.5px solid #000000",
    borderRadius: "12px",
    padding: "14px",
    textDecoration: "none",
    color: "#111827",
    backgroundColor: "#fdfbf7",
    boxShadow: "2px 2px 0px #000000"
  },
  courseLevel: {
    fontSize: "10px",
    fontWeight: 800,
    color: "#7c3aed",
    textTransform: "uppercase"
  },
  courseTitle: {
    fontSize: "13px",
    fontWeight: 800
  },
  courseProvider: {
    fontSize: "11px",
    color: "#6b7280"
  },
  courseLink: {
    fontSize: "11px",
    fontWeight: 800,
    marginTop: "4px"
  }
};
