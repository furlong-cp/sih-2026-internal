import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";

function App() {
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState({
    x: -500,
    y: -500,
  });

  useEffect(() => {
    const moveCursor = (event) => {
      setCursor({
        x: event.clientX,
        y: event.clientY,
      });

      document.documentElement.style.setProperty(
        "--mouse-x",
        `${event.clientX}px`
      );

      document.documentElement.style.setProperty(
        "--mouse-y",
        `${event.clientY}px`
      );
    };

    window.addEventListener("mousemove", moveCursor);

    /*
      IMPORTANT:

      This controls how long the INTRO remains visible.

      7000ms = 7 seconds
    */
    const timer = setTimeout(() => {
      setLoading(false);
    }, 7000);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      {/* =========================================
          GLOBAL BACKGROUND
      ========================================= */}

      <div className="ambient-background">
        <div className="noise-layer" />

        <div className="ambient-orb orb-one" />
        <div className="ambient-orb orb-two" />
        <div className="ambient-orb orb-three" />
        <div className="ambient-orb orb-four" />

        <div className="ambient-shape shape-one" />
        <div className="ambient-shape shape-two" />
        <div className="ambient-shape shape-three" />
      </div>


      {/* =========================================
          MULTICOLOR CURSOR
      ========================================= */}

      <div
        className="cursor-aura"
        style={{
          left: cursor.x,
          top: cursor.y,
        }}
      />

      <div
        className="cursor-core"
        style={{
          left: cursor.x,
          top: cursor.y,
        }}
      />


      {/* =========================================
          INTRO
      ========================================= */}

      {loading && <LoadingScreen />}


      {/* =========================================
          MAIN APP

          IMPORTANT:
          transition is intentionally FAST.
      ========================================= */}

      <div className={`app ${loading ? "app-hidden" : "app-visible"}`}>
        <Navbar />

        <div className="app-body">
          <Sidebar />
          <Home />
        </div>
      </div>
    </>
  );
}


/* =========================================================
   LOADING SCREEN
========================================================= */

function LoadingScreen() {
  const [statIndex, setStatIndex] = useState(0);

  const stats = [
    {
      number: "100K+",
      text: "candidates placed",
    },
    {
      number: "2.4M+",
      text: "skills verified",
    },
    {
      number: "48K+",
      text: "projects showcased",
    },
    {
      number: "12K+",
      text: "companies hiring",
    },
  ];

  useEffect(() => {
    /*
      First statistic gets extra time.

      100K+ stays for 2.5 seconds.
      Other statistics rotate faster.
    */

    const delays = [2500, 1100, 1100, 1100];

    const timer = setTimeout(() => {
      setStatIndex((current) => {
        if (current === stats.length - 1) {
          return current;
        }

        return current + 1;
      });
    }, delays[statIndex]);

    return () => clearTimeout(timer);
  }, [statIndex]);


  return (
    <div className="loading-screen">

      {/* =========================================
          COLOR FIELD
      ========================================= */}

      <div className="intro-color-field" />

      <div className="intro-blob blob-pink" />
      <div className="intro-blob blob-blue" />
      <div className="intro-blob blob-yellow" />
      <div className="intro-blob blob-green" />
      <div className="intro-blob blob-purple" />


      {/* =========================================
          DECORATIVE PATTERNS
      ========================================= */}

      <div className="checker checker-one" />
      <div className="checker checker-two" />

      <div className="dots dots-one" />
      <div className="dots dots-two" />

      <div className="squiggle squiggle-one">
        〰〰〰
      </div>

      <div className="squiggle squiggle-two">
        〰〰
      </div>


      {/* =========================================
          TOP BRAND
      ========================================= */}

      <div className="intro-top-brand">
        <div className="intro-logo">
          <img src="/logo.svg" alt="SkillBridge" />
        </div>

        <strong>
          SKILLBRIDGE
        </strong>

        <span>
          CAREER OS
        </span>
      </div>


      {/* =========================================
          INDIA → GLOBAL FLIGHT
      ========================================= */}

      <div className="global-flight">

        <div className="flight-origin">
          🇮🇳
          <span>INDIA</span>
        </div>

        <div className="flight-path">

          <div className="flight-line" />

          <div className="flight-plane">
            ✈️
          </div>

          <div className="flight-spark spark-one">
            ✦
          </div>

          <div className="flight-spark spark-two">
            ✦
          </div>

        </div>

        <div className="flight-destination">
          🌎
          <span>WORLD</span>
        </div>

      </div>


      {/* =========================================
          SYDNEY PHOTO
      ========================================= */}

      <div className="photo-card photo-sydney">

        <img
          src="https://images.unsplash.com/photo-1524293581917-878a6d017c71?auto=format&fit=crop&w=700&q=80"
          alt="Sydney"
        />

        <div className="photo-overlay">
          🇦🇺
          <strong>
            SYDNEY
          </strong>

          <small>
            Internship secured
          </small>
        </div>

      </div>


      {/* =========================================
          NEW YORK PHOTO
      ========================================= */}

      <div className="photo-card photo-newyork">

        <img
          src="https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=700&q=80"
          alt="New York"
        />

        <div className="photo-overlay">
          🇺🇸
          <strong>
            NEW YORK
          </strong>

          <small>
            Quant Developer
          </small>
        </div>

      </div>


      {/* =========================================
          SINGAPORE PHOTO
      ========================================= */}

      <div className="photo-card photo-singapore">

        <img
          src="https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=700&q=80"
          alt="Singapore"
        />

        <div className="photo-overlay">
          🇸🇬
          <strong>
            SINGAPORE
          </strong>

          <small>
            Software Engineer
          </small>
        </div>

      </div>


      {/* =========================================
          TORONTO PHOTO
      ========================================= */}

      <div className="photo-card photo-toronto">

        <img
          src="https://images.unsplash.com/photo-1517090504586-fde19ea6066f?auto=format&fit=crop&w=700&q=80"
          alt="Toronto"
        />

        <div className="photo-overlay">
          🇨🇦
          <strong>
            TORONTO
          </strong>

          <small>
            Backend Engineer
          </small>
        </div>

      </div>


      {/* =========================================
          HUGE STAT CARD
      ========================================= */}

      <div className="main-stat-card">

        <div className="stat-mini-label">
          SKILLBRIDGE NETWORK
        </div>

        <div
          className="main-stat-number"
          key={statIndex}
        >
          {stats[statIndex].number}
        </div>

        <div className="main-stat-text">
          {stats[statIndex].text}
        </div>


        <div className="stat-avatars">

          <div>AK</div>
          <div>RS</div>
          <div>JM</div>
          <div>NP</div>
          <div>VK</div>

          <span>
            +100K
          </span>

        </div>


        <div className="stat-progress">
          <div />
        </div>

      </div>


      {/* =========================================
          BRO GOT INTERNSHIP
      ========================================= */}

      <div className="sticker sticker-internship">

        <span>
          🚀
        </span>

        <strong>
          BRO GOT THE
          <br />
          INTERNSHIP
        </strong>

      </div>


      {/* =========================================
          DSA MEME
      ========================================= */}

      <div className="sticker sticker-dsa">

        <span>
          POV:
        </span>

        <strong>
          DSA
          <br />
          FINALLY
          <br />
          PAID OFF 😭
        </strong>

      </div>


      {/* =========================================
          GITHUB MEME
      ========================================= */}

      <div className="sticker sticker-github">

        <span>
          INTERVIEWER:
        </span>

        <strong>
          "Show me
          <br />
          your projects"
        </strong>

        <small>
          me opening GitHub 💀
        </small>

      </div>


      {/* =========================================
          OFFER
      ========================================= */}

      <div className="offer-ticket">

        <div className="offer-top">
          NEW OFFER
          <span>
            ✓
          </span>
        </div>

        <strong>
          ₹18L
        </strong>

        <span>
          Quant Developer
        </span>

        <small>
          0 → OFFER
        </small>

      </div>


      {/* =========================================
          CODING TERMINAL
      ========================================= */}

      <div className="mini-terminal">

        <div className="terminal-bar">

          <i />
          <i />
          <i />

          <span>
            skillbridge.cpp
          </span>

        </div>

        <div className="terminal-code">

          <span>
            <b>01</b> solve(problem);
          </span>

          <span>
            <b>02</b> optimize();
          </span>

          <span>
            <b>03</b> submit();
          </span>

          <span className="accepted">
            ✓ ACCEPTED
          </span>

        </div>

      </div>


      {/* =========================================
          CAREER GRAPH
      ========================================= */}

      <div className="growth-card">

        <span>
          CAREER GROWTH
        </span>

        <strong>
          +84%
        </strong>

        <svg viewBox="0 0 240 90">

          <polyline
            points="
              5,78
              30,70
              55,72
              80,55
              105,61
              130,39
              155,44
              180,25
              205,30
              235,5
            "
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />

        </svg>

      </div>


      {/* =========================================
          FLOATING CAREER TAGS
      ========================================= */}

      <div className="floating-tag tag-one">
        💻 C++
      </div>

      <div className="floating-tag tag-two">
        📈 PROBABILITY
      </div>

      <div className="floating-tag tag-three">
        🧠 DSA
      </div>

      <div className="floating-tag tag-four">
        ☁️ REMOTE
      </div>

      <div className="floating-tag tag-five">
        💼 OFFER
      </div>


      {/* =========================================
          CENTRAL LOADING PANEL
      ========================================= */}

      <div className="loading-panel">

        <div className="panel-logo">

          <img
            src="/logo.svg"
            alt="SkillBridge"
          />

          <span>
            SkillBridge
          </span>

        </div>


        <div className="panel-line" />


        <div className="panel-message">
          Connecting
          <br />
          <strong>
            talent ↔ opportunity
          </strong>
        </div>


        <div className="panel-status">

          <span>
            {statIndex === 0
              ? "BUILDING GLOBAL NETWORK"
              : "SYNCING CAREER DATA"}
          </span>

          <span>
            {Math.min(
              96,
              25 + statIndex * 22
            )}
            %
          </span>

        </div>

      </div>


      {/* =========================================
          BOTTOM PHRASE
      ========================================= */}

      <div className="intro-bottom">

        <span>
          BUILD
        </span>

        <b>
          →
        </b>

        <span>
          PROVE
        </span>

        <b>
          →
        </b>

        <span>
          CONNECT
        </span>

        <b>
          →
        </b>

        <span>
          GROW
        </span>

      </div>


      {/* =========================================
          LITTLE DECORATIVE TEXT
      ========================================= */}

      <div className="tiny-note note-one">
        YOUR SKILLS ARE THE RESUME
      </div>

      <div className="tiny-note note-two">
        01 / CAREER
      </div>

      <div className="tiny-note note-three">
        MADE FOR BUILDERS
      </div>

    </div>
  );
}


export default App;