import { useState } from "react";

export default function Home() {
  const [completedActions, setCompletedActions] = useState([]);

  const actions = [
    {
      id: 1,
      title: "Complete your C++ assessment",
      description: "Verify your C++ and problem-solving skills.",
      tag: "HIGH IMPACT",
      points: "+42",
    },
    {
      id: 2,
      title: "Add a GitHub project",
      description: "Give recruiters evidence of what you can build.",
      tag: "PROFILE",
      points: "+28",
    },
    {
      id: 3,
      title: "Practice probability",
      description: "Your target Quant roles require stronger probability skills.",
      tag: "SKILL GAP",
      points: "+19",
    },
  ];

  const jobs = [
    {
      company: "Vertex Labs",
      role: "Software Engineer Intern",
      location: "Remote · India",
      match: 94,
      skills: ["C++", "DSA", "Git"],
    },
    {
      company: "QuantForge",
      role: "Quant Developer Intern",
      location: "Bengaluru · Hybrid",
      match: 88,
      skills: ["C++", "Probability", "Python"],
    },
    {
      company: "Nova Systems",
      role: "Backend Engineering Intern",
      location: "Hyderabad · Hybrid",
      match: 82,
      skills: ["Python", "SQL", "APIs"],
    },
  ];

  const skills = [
    { name: "C++", score: 94 },
    { name: "DSA", score: 88 },
    { name: "Python", score: 81 },
    { name: "Probability", score: 63 },
  ];

  const toggleAction = (id) => {
    setCompletedActions((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  return (
    <main className="home-page">
      <section className="hero-section">
        <div>
          <p className="eyebrow">YOUR CAREER COMMAND CENTER</p>

          <h1>
            Build proof.
            <br />
            <span>Not just a resume.</span>
          </h1>

          <p className="hero-description">
            SkillBridge helps you turn skills, projects and performance
            into opportunities.
          </p>
        </div>

        <div className="score-card">
          <div className="score-card-top">
            <span>SKILLBRIDGE SCORE</span>
            <span className="verified-dot">●</span>
          </div>

          <div className="score-number">742</div>

          <div className="score-bar">
            <div className="score-bar-fill" />
          </div>

          <div className="score-footer">
            <span>Top 18% of learners</span>
            <span>+24 this month</span>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">PROFILE</span>
          <strong>72%</strong>
          <span className="stat-subtext">3 actions remaining</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">VERIFIED SKILLS</span>
          <strong>6</strong>
          <span className="stat-subtext">+2 this month</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">JOB MATCHES</span>
          <strong>24</strong>
          <span className="stat-subtext">8 high match</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">PROJECTS</span>
          <strong>4</strong>
          <span className="stat-subtext">2 verified</span>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-main">
          <div className="section-heading">
            <div>
              <p className="eyebrow">RECOMMENDED</p>
              <h2>Your Next Best Actions</h2>
            </div>

            <button className="text-button">View all →</button>
          </div>

          <div className="actions-list">
            {actions.map((action) => {
              const completed = completedActions.includes(action.id);

              return (
                <button
                  key={action.id}
                  className={`action-card ${completed ? "completed" : ""}`}
                  onClick={() => toggleAction(action.id)}
                >
                  <div className="action-number">
                    {completed ? "✓" : String(action.id).padStart(2, "0")}
                  </div>

                  <div className="action-content">
                    <div className="action-top">
                      <span className="action-title">{action.title}</span>
                      <span className="action-points">{action.points}</span>
                    </div>

                    <p>{action.description}</p>

                    <span className="action-tag">{action.tag}</span>
                  </div>

                  <span className="action-arrow">
                    {completed ? "Done" : "→"}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="section-heading jobs-heading">
            <div>
              <p className="eyebrow">AI MATCHED</p>
              <h2>Opportunities for you</h2>
            </div>

            <button className="text-button">Explore jobs →</button>
          </div>

          <div className="jobs-list">
            {jobs.map((job) => (
              <article className="job-card" key={job.role}>
                <div className="company-logo">
                  {job.company.charAt(0)}
                </div>

                <div className="job-info">
                  <div className="job-company">{job.company}</div>
                  <h3>{job.role}</h3>
                  <p>{job.location}</p>

                  <div className="skill-tags">
                    {job.skills.map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                </div>

                <div className="job-match">
                  <span>MATCH</span>
                  <strong>{job.match}%</strong>
                  <button>View →</button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="dashboard-side">
          <div className="side-card">
            <div className="section-heading compact">
              <div>
                <p className="eyebrow">SKILL GRAPH</p>
                <h2>Current skills</h2>
              </div>

              <button className="dots-button">•••</button>
            </div>

            <div className="skills-list">
              {skills.map((skill) => (
                <div className="skill-row" key={skill.name}>
                  <div className="skill-row-top">
                    <span>{skill.name}</span>
                    <strong>{skill.score}</strong>
                  </div>

                  <div className="skill-track">
                    <div
                      className="skill-fill"
                      style={{ width: `${skill.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button className="outline-button">
              View complete skill profile
            </button>
          </div>

          <div className="side-card copilot-card">
            <div className="copilot-icon">✦</div>

            <p className="eyebrow">CAREER COPILOT</p>

            <h2>You have a probability gap.</h2>

            <p>
              Strengthening probability could increase your match
              with quantitative roles.
            </p>

            <button className="primary-button">
              Ask Career Copilot →
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
}
