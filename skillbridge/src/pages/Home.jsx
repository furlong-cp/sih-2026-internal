import React, { useEffect, useState } from "react";
import quotes from "../data/quotes";

const jobs = [
  {
    company: "QuantForge",
    logo: "Q",
    role: "Quant Developer Intern",
    location: "Bengaluru · Hybrid",
    match: 94,
    salary: "₹18–28 LPA",
    skills: ["C++", "Probability", "Python", "DSA"],
  },
  {
    company: "Vertex Labs",
    logo: "V",
    role: "Software Engineer Intern",
    location: "Remote · India",
    match: 91,
    salary: "₹12–20 LPA",
    skills: ["C++", "DSA", "Git", "Systems"],
  },
  {
    company: "Nova Systems",
    logo: "N",
    role: "Backend Engineering Intern",
    location: "Hyderabad · Hybrid",
    match: 82,
    salary: "₹10–16 LPA",
    skills: ["Python", "SQL", "APIs"],
  },
];

const skills = [
  ["C++", 94, true],
  ["DSA", 88, true],
  ["Python", 81, false],
  ["Probability", 63, false],
  ["SQL", 58, false],
];

function Home() {
    const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((current) => {
        let next = Math.floor(Math.random() * quotes.length);

        // Prevent the exact same quote appearing twice
        while (next === current && quotes.length > 1) {
          next = Math.floor(Math.random() * quotes.length);
        }

        return next;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, []);
  return (
    <main className="dashboard">

      {/* ================= HEADER ================= */}

      <div className="dashboard-header">

        <div>
          <span className="eyebrow">
            CAREER COMMAND CENTER
          </span>

          <h1>
            Build proof.
            <span> Get noticed.</span>
          </h1>

          <p>
            Your career, skills and opportunities in one place.
          </p>
          <div className="motivation-quote" key={quoteIndex}>
            <span>✦</span>
            <p>{quotes[quoteIndex]}</p>

          </div>
        </div>

        <div className="header-actions">

          <button className="search-button">
            ⌕ Search anything
            <kbd>⌘ K</kbd>
          </button>

          <button className="notification">
            ♢
          </button>

          <button className="profile-button">
            <span>F</span>
            <div>
              <strong>Furlong</strong>
              <small>Student</small>
            </div>
            ▾
          </button>

        </div>

      </div>


      {/* ================= TOP STATS ================= */}

      <section className="stats-row">

        <div className="big-score-card">

          <div className="score-card-top">
            <span>SKILLBRIDGE SCORE</span>
            <span className="score-trend">↑ +24</span>
          </div>

          <div className="score-main">
            <strong>742</strong>

            <div className="score-ring">
              <span>74%</span>
            </div>
          </div>

          <div className="score-progress">
            <div />
          </div>

          <div className="score-bottom">
            <span>TOP 18% OF LEARNERS</span>
            <button>Improve score →</button>
          </div>

        </div>


        <div className="stat-card">

          <span>PROFILE STRENGTH</span>

          <strong>72%</strong>

          <div className="mini-progress">
            <div style={{ width: "72%" }} />
          </div>

          <small>
            3 actions remaining
          </small>

          <button>
            Complete profile →
          </button>

        </div>


        <div className="stat-card">

          <span>VERIFIED SKILLS</span>

          <strong>06</strong>

          <small className="positive">
            +2 this month
          </small>

          <button>
            View evidence →
          </button>

        </div>


        <div className="stat-card">

          <span>JOB MATCHES</span>

          <strong>24</strong>

          <small>
            8 high-match opportunities
          </small>

          <button>
            Explore jobs →
          </button>

        </div>


        <div className="stat-card">

          <span>PROJECTS</span>

          <strong>04</strong>

          <small>
            2 verified projects
          </small>

          <button>
            Manage projects →
          </button>

        </div>

      </section>


      {/* ================= COMMAND BAR ================= */}

      <section className="command-bar">

        <div>
          <span>QUICK ACTIONS</span>
          <strong>What do you want to accomplish?</strong>
        </div>

        <button>
          ⌕ Find Jobs
        </button>

        <button>
          ✓ Take Assessment
        </button>

        <button>
          + Add Project
        </button>

        <button>
          ✦ Ask Copilot
        </button>

      </section>


      {/* ================= MAIN LAYOUT ================= */}

      <div className="dashboard-layout">


        {/* ================= CENTER ================= */}

        <div className="dashboard-main">


          {/* NEXT ACTIONS */}

          <section className="panel">

            <div className="panel-header">

              <div>
                <span>RECOMMENDED</span>
                <h2>Your Next Best Actions</h2>
              </div>

              <button>
                View all →
              </button>

            </div>


            <div className="action-list">

              <div className="action-row">

                <div className="action-number">
                  01
                </div>

                <div className="action-content">

                  <strong>
                    Complete your C++ assessment
                  </strong>

                  <p>
                    Verify your C++ and problem-solving ability.
                  </p>

                  <span>
                    HIGH IMPACT
                  </span>

                </div>

                <b>
                  +42
                </b>

                <button>
                  Start →
                </button>

              </div>


              <div className="action-row">

                <div className="action-number">
                  02
                </div>

                <div className="action-content">

                  <strong>
                    Add a GitHub project
                  </strong>

                  <p>
                    Give recruiters evidence of what you can build.
                  </p>

                  <span>
                    PROFILE
                  </span>

                </div>

                <b>
                  +28
                </b>

                <button>
                  Add →
                </button>

              </div>


              <div className="action-row">

                <div className="action-number">
                  03
                </div>

                <div className="action-content">

                  <strong>
                    Practice Probability
                  </strong>

                  <p>
                    Your Quant target has a noticeable skill gap.
                  </p>

                  <span>
                    SKILL GAP
                  </span>

                </div>

                <b>
                  +19
                </b>

                <button>
                  Practice →
                </button>

              </div>

            </div>

          </section>


          {/* OPPORTUNITIES */}

          <section className="panel">

            <div className="panel-header">

              <div>
                <span>AI MATCHED</span>
                <h2>Opportunity Radar</h2>
              </div>

              <button>
                View all jobs →
              </button>

            </div>


            <div className="job-table">

              <div className="job-table-head">
                <span>OPPORTUNITY</span>
                <span>MATCH</span>
                <span>ACTION</span>
              </div>


              {jobs.map((job) => (

                <div className="job-row" key={job.role}>

                  <div className="job-info">

                    <div className="company-logo">
                      {job.logo}
                    </div>

                    <div>

                      <strong>
                        {job.role}
                      </strong>

                      <span>
                        {job.company}
                      </span>

                      <small>
                        {job.location}
                      </small>

                      <div className="job-tags">
                        {job.skills.map((skill) => (
                          <i key={skill}>
                            {skill}
                          </i>
                        ))}
                      </div>

                    </div>

                  </div>


                  <div className="match-score">

                    <strong>
                      {job.match}%
                    </strong>

                    <span>
                      MATCH
                    </span>

                  </div>


                  <div className="job-actions">

                    <button className="apply">
                      Apply
                    </button>

                    <button>
                      ☆
                    </button>

                  </div>

                </div>

              ))}

            </div>

          </section>

        </div>


        {/* ================= RIGHT ================= */}

        <aside className="dashboard-sidebar">


          {/* PROFILE CARD */}

          <section className="side-panel profile-card">

            <div className="profile-top">

              <div className="profile-avatar">
                F
              </div>

              <div>
                <strong>
                  Your Skill Profile
                </strong>

                <span>
                  72% complete
                </span>
              </div>

            </div>


            <div className="profile-progress">

              <div>
                <span>PROFILE STRENGTH</span>
                <strong>72%</strong>
              </div>

              <div className="mini-progress">
                <div style={{ width: "72%" }} />
              </div>

            </div>


            <button className="full-button">
              Complete profile →
            </button>

          </section>


          {/* SKILLS */}

          <section className="side-panel">

            <div className="side-heading">

              <div>
                <span>SKILL GRAPH</span>
                <h3>Current Skills</h3>
              </div>

              <button>
                •••
              </button>

            </div>


            <div className="skill-list">

              {skills.map(([name, score, verified]) => (

                <div className="skill-item" key={name}>

                  <div className="skill-name">

                    <span>
                      {name}
                    </span>

                    {verified && (
                      <i>✓</i>
                    )}

                  </div>

                  <strong>
                    {score}
                  </strong>

                  <div className="skill-bar">
                    <div
                      style={{
                        width: `${score}%`,
                      }}
                    />
                  </div>

                </div>

              ))}

            </div>


            <button className="full-button">
              View complete skill profile →
            </button>

          </section>


          {/* CAREER COPILOT */}

          <section className="side-panel copilot-mini">

            <div className="copilot-icon">
              ✦
            </div>

            <span>
              AI CAREER COPILOT
            </span>

            <h3>
              Your Probability score is 63.
            </h3>

            <p>
              Improve it toward 80 to unlock
              stronger Quant matches.
            </p>

            <button>
              Build my plan →
            </button>

          </section>


          {/* APPLICATIONS */}

          <section className="side-panel">

            <div className="side-heading">

              <div>
                <span>APPLICATIONS</span>
                <h3>Pipeline</h3>
              </div>

              <strong>
                24
              </strong>

            </div>


            <div className="pipeline-mini">

              <div>
                <strong>14</strong>
                <span>Applied</span>
              </div>

              <div>
                <strong>6</strong>
                <span>Review</span>
              </div>

              <div>
                <strong>3</strong>
                <span>Test</span>
              </div>

              <div>
                <strong>1</strong>
                <span>Interview</span>
              </div>

              <div>
                <strong>0</strong>
                <span>Offer</span>
              </div>

            </div>


            <button className="full-button">
              Open applications →
            </button>

          </section>


          {/* ACTIVITY */}

          <section className="side-panel">

            <div className="side-heading">

              <div>
                <span>ACTIVITY</span>
                <h3>Career Timeline</h3>
              </div>

              <button>
                View →
              </button>

            </div>


            <div className="timeline-item">
              <i>✓</i>
              <div>
                <strong>
                  C++ skill verified
                </strong>
                <span>
                  Assessment · 94%
                </span>
                <small>
                  2h ago
                </small>
              </div>
            </div>


            <div className="timeline-item">
              <i>◆</i>
              <div>
                <strong>
                  Project added
                </strong>
                <span>
                  Algorithmic Trading Simulator
                </span>
                <small>
                  Yesterday
                </small>
              </div>
            </div>


            <div className="timeline-item">
              <i>↗</i>
              <div>
                <strong>
                  Recruiter activity
                </strong>
                <span>
                  3 companies viewed your profile
                </span>
                <small>
                  2d ago
                </small>
              </div>
            </div>

          </section>

        </aside>

      </div>

    </main>
  );
}

export default Home;