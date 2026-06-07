import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
const C = {
  navy:     "#020B1E",
  navyMid:  "#041633",
  navyUp:   "#071D45",
  blue:     "#229ED9",
  blueB:    "#38B8F5",
  blueG:    "#0EA5E9",
  orange:   "#FF6B2B",
  orangeL:  "#FF8C55",
  white:    "#FFFFFF",
  w70:      "rgba(255,255,255,0.70)",
  w40:      "rgba(255,255,255,0.40)",
  w15:      "rgba(255,255,255,0.08)",
  w08:      "rgba(255,255,255,0.05)",
};

/* ─────────────────────────────────────────────
   GLOBAL STYLES (injected once)
───────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: ${C.navy};
    color: ${C.white};
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${C.navy}; }
  ::-webkit-scrollbar-thumb { background: rgba(56,184,245,0.3); border-radius: 3px; }

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(2deg); }
  }
  @keyframes floatB {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-14px) rotate(-1deg); }
    66% { transform: translateY(8px) rotate(1deg); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.05); }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes ping {
    0% { transform: scale(1); opacity: 0.8; }
    70%, 100% { transform: scale(2.2); opacity: 0; }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(40px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 20px rgba(34,158,217,0.3); }
    50% { box-shadow: 0 0 40px rgba(34,158,217,0.6), 0 0 60px rgba(56,184,245,0.2); }
  }
  @keyframes orbPulse {
    0%, 100% { transform: scale(1); opacity: 0.6; }
    50% { transform: scale(1.1); opacity: 0.9; }
  }
  @keyframes notifSlide {
    0% { opacity: 0; transform: translateY(-12px) scale(0.96); }
    15%, 85% { opacity: 1; transform: translateY(0) scale(1); }
    100% { opacity: 0; transform: translateY(8px) scale(0.96); }
  }
  @keyframes countUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes borderGlow {
    0%, 100% { border-color: rgba(56,184,245,0.2); }
    50% { border-color: rgba(56,184,245,0.5); }
  }
  @keyframes rotateOrb {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .fade-up {
    opacity: 0;
    transform: translateY(32px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .fade-up.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 14px 28px;
    border-radius: 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    text-decoration: none;
    transition: all 0.25s ease;
    background: linear-gradient(135deg, ${C.blue}, ${C.blueB});
    color: white;
    box-shadow: 0 8px 32px rgba(34,158,217,0.35);
    position: relative;
    overflow: hidden;
  }
  .btn-primary::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, ${C.blueB}, #6DD5FA);
    opacity: 0;
    transition: opacity 0.25s;
  }
  .btn-primary:hover::before { opacity: 1; }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(34,158,217,0.5); }
  .btn-primary span { position: relative; z-index: 1; }

  .btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 14px 28px;
    border-radius: 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    border: 1px solid rgba(56,184,245,0.25);
    background: rgba(56,184,245,0.06);
    color: ${C.w70};
    transition: all 0.25s ease;
    text-decoration: none;
    backdrop-filter: blur(8px);
  }
  .btn-secondary:hover {
    background: rgba(56,184,245,0.12);
    border-color: rgba(56,184,245,0.5);
    color: white;
    transform: translateY(-2px);
  }

  .glass {
    background: rgba(255,255,255,0.04);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.08);
  }

  .section-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    border-radius: 100px;
    background: rgba(56,184,245,0.08);
    border: 1px solid rgba(56,184,245,0.2);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: ${C.blueB};
    margin-bottom: 20px;
  }

  .section-title {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: clamp(32px, 5vw, 52px);
    letter-spacing: -1.5px;
    line-height: 1.05;
    color: white;
    margin-bottom: 16px;
  }

  .section-sub {
    font-size: 17px;
    line-height: 1.65;
    color: ${C.w70};
    max-width: 520px;
  }

  .gradient-text {
    background: linear-gradient(90deg, ${C.blueB}, #6DD5FA, ${C.blueB});
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 4s linear infinite;
  }

  .orange-text {
    background: linear-gradient(90deg, ${C.orange}, ${C.orangeL});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

/* ─────────────────────────────────────────────
   INTERSECTION OBSERVER HOOK
───────────────────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ─────────────────────────────────────────────
   TELEGRAM ICON SVG
───────────────────────────────────────────── */
function TelegramIcon({ size = 20, color = "white" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.64 7.72c-.12.56-.44.7-.9.44l-2.5-1.84-1.2 1.16c-.14.14-.26.26-.52.26l.18-2.56 4.64-4.2c.2-.18-.04-.28-.32-.1L7.28 14.4 4.8 13.64c-.56-.18-.58-.56.12-.82l9.24-3.56c.46-.16.86.1.68.54z"/>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   BACKGROUND CANVAS
───────────────────────────────────────────── */
function BackgroundCanvas() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {/* Grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(rgba(56,184,245,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(56,184,245,0.03) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />
      {/* Orb 1 */}
      <div style={{
        position: "absolute", width: 800, height: 800, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(34,158,217,0.12) 0%, transparent 70%)",
        top: -200, right: -150,
        animation: "orbPulse 8s ease-in-out infinite",
      }} />
      {/* Orb 2 */}
      <div style={{
        position: "absolute", width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,107,43,0.07) 0%, transparent 70%)",
        bottom: "30%", left: -100,
        animation: "orbPulse 10s ease-in-out infinite 2s",
      }} />
      {/* Orb 3 */}
      <div style={{
        position: "absolute", width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(56,184,245,0.08) 0%, transparent 70%)",
        bottom: "10%", right: "10%",
        animation: "orbPulse 7s ease-in-out infinite 1s",
      }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "0 24px",
      transition: "all 0.3s ease",
      ...(scrolled ? {
        background: "rgba(2,11,30,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(56,184,245,0.1)",
        boxShadow: "0 4px 30px rgba(0,0,0,0.3)",
      } : {}),
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 72,
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: "linear-gradient(135deg, #229ED9, #38B8F5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 20px rgba(34,158,217,0.4)",
            animation: "glow 3s ease-in-out infinite",
          }}>
            <TelegramIcon size={20} />
          </div>
          <span style={{
            fontFamily: "Syne, sans-serif", fontWeight: 800,
            fontSize: 20, letterSpacing: "-0.5px",
          }}>
            Target<span style={{ color: C.blueB }}>Job</span>
          </span>
        </div>

        {/* Nav Links */}
        <div style={{ display: "flex", alignItems: "center", gap: 32, fontSize: 14, color: C.w70 }}>
          {["How It Works", "Features", "Ecosystem", "Reviews"].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`} style={{
              color: C.w70, textDecoration: "none",
              transition: "color 0.2s",
            }}
              onMouseEnter={e => e.target.style.color = "white"}
              onMouseLeave={e => e.target.style.color = C.w70}
            >{l}</a>
          ))}
        </div>

        {/* CTA */}
        <a href="https://t.me/TargetJobGE" className="btn-primary" style={{ padding: "10px 20px", fontSize: 14 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <TelegramIcon size={16} /> <span>Join Telegram</span>
          </span>
        </a>
      </div>
    </nav>
  );
}

/* ─────────────────────────────────────────────
   PHONE MOCKUP (animated notifications)
───────────────────────────────────────────── */
const NOTIFICATIONS = [
  { icon: "💻", title: "Frontend Developer", loc: "Remote", type: "Full-time", salary: "$2,500–4,000", hot: true },
  { icon: "🎨", title: "Product Designer", loc: "Tbilisi", type: "Hybrid", salary: "$1,800–3,200", hot: false },
  { icon: "📊", title: "Marketing Manager", loc: "Tbilisi", type: "Office", salary: "$1,500–2,500", hot: false },
  { icon: "⚙️", title: "Backend Engineer", loc: "Remote", type: "Full-time", salary: "$3,000–5,000", hot: true },
  { icon: "🔍", title: "SEO Specialist", loc: "Hybrid", type: "Part-time", salary: "$800–1,500", hot: false },
];

function PhoneMockup() {
  const [active, setActive] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive(p => (p + 1) % NOTIFICATIONS.length);
      setAnimKey(k => k + 1);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const notif = NOTIFICATIONS[active];

  return (
    <div style={{
      position: "relative",
      width: 280,
      animation: "float 6s ease-in-out infinite",
      flexShrink: 0,
    }}>
      {/* Glow behind phone */}
      <div style={{
        position: "absolute",
        inset: -40,
        background: "radial-gradient(circle, rgba(34,158,217,0.2) 0%, transparent 70%)",
        borderRadius: "50%",
        animation: "pulse 4s ease-in-out infinite",
        zIndex: 0,
      }} />

      {/* Phone shell */}
      <div style={{
        width: 280, height: 560,
        background: "linear-gradient(160deg, #1A2B45 0%, #0D1B2E 100%)",
        borderRadius: 44,
        border: "1.5px solid rgba(56,184,245,0.25)",
        boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 60px rgba(34,158,217,0.15)",
        position: "relative",
        zIndex: 1,
        overflow: "hidden",
      }}>
        {/* Side button */}
        <div style={{
          position: "absolute", right: -3, top: 110,
          width: 4, height: 55,
          background: "#1E3050", borderRadius: "0 3px 3px 0",
        }} />

        {/* Screen */}
        <div style={{
          position: "absolute",
          top: 14, left: 8, right: 8, bottom: 14,
          background: "#0D1625",
          borderRadius: 36,
          overflow: "hidden",
        }}>
          {/* Notch */}
          <div style={{
            position: "absolute", top: 0, left: "50%",
            transform: "translateX(-50%)",
            width: 90, height: 26,
            background: "#0D1625",
            borderRadius: "0 0 16px 16px",
            zIndex: 10,
          }} />

          <div style={{ paddingTop: 28 }}>
            {/* Status bar */}
            <div style={{
              display: "flex", justifyContent: "space-between",
              padding: "6px 20px 0",
              fontSize: 10, color: "rgba(255,255,255,0.45)",
            }}>
              <span>9:41</span>
              <span style={{ display: "flex", gap: 3 }}>
                <span>▪▪▪</span>
              </span>
            </div>

            {/* TG Header */}
            <div style={{
              background: "#17212B",
              padding: "10px 14px",
              display: "flex", alignItems: "center", gap: 10,
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "linear-gradient(135deg, #229ED9, #38B8F5)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <TelegramIcon size={18} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "white" }}>TargetJob Bot</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>12,840 members</div>
              </div>
            </div>

            {/* Categories */}
            <div style={{
              display: "flex", gap: 6,
              padding: "10px 12px",
              overflowX: "hidden",
            }}>
              {["💻 Tech", "🎨 Design", "📊 Marketing"].map((c, i) => (
                <div key={c} style={{
                  padding: "4px 10px",
                  borderRadius: 100,
                  fontSize: 10,
                  fontWeight: 500,
                  background: i === 0 ? "rgba(56,184,245,0.2)" : "rgba(255,255,255,0.05)",
                  border: i === 0 ? "1px solid rgba(56,184,245,0.4)" : "1px solid rgba(255,255,255,0.08)",
                  color: i === 0 ? C.blueB : "rgba(255,255,255,0.5)",
                  whiteSpace: "nowrap",
                }}>{c}</div>
              ))}
            </div>

            {/* Live notification card */}
            <div key={animKey} style={{
              margin: "4px 10px",
              padding: "12px",
              background: "linear-gradient(135deg, rgba(34,158,217,0.12), rgba(14,165,233,0.06))",
              border: "1px solid rgba(56,184,245,0.25)",
              borderRadius: 14,
              animation: "notifSlide 2.8s ease forwards",
            }}>
              {notif.hot && (
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  padding: "2px 8px",
                  borderRadius: 100,
                  background: "linear-gradient(90deg, rgba(255,107,43,0.2), rgba(255,140,85,0.15))",
                  border: "1px solid rgba(255,107,43,0.3)",
                  fontSize: 9, fontWeight: 600, color: C.orangeL,
                  marginBottom: 6,
                }}>🔥 NEW</div>
              )}
              <div style={{ fontSize: 13, fontWeight: 600, color: "white", marginBottom: 4 }}>
                {notif.icon} {notif.title}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 6 }}>
                <span style={{
                  fontSize: 9, padding: "2px 7px", borderRadius: 100,
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.5)",
                }}>📍 {notif.loc}</span>
                <span style={{
                  fontSize: 9, padding: "2px 7px", borderRadius: 100,
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.5)",
                }}>⏱ {notif.type}</span>
              </div>
              <div style={{
                fontSize: 12, fontWeight: 600,
                background: "linear-gradient(90deg, #38B8F5, #6DD5FA)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>{notif.salary}</div>
              <div style={{
                marginTop: 8, padding: "6px 10px",
                background: "linear-gradient(90deg, rgba(34,158,217,0.25), rgba(56,184,245,0.15))",
                borderRadius: 8,
                fontSize: 10, fontWeight: 600,
                color: C.blueB,
                textAlign: "center",
                cursor: "pointer",
              }}>View Details →</div>
            </div>

            {/* Static older cards */}
            {[
              { icon: "🎨", title: "UI/UX Designer", loc: "Remote", salary: "$1,800–3,200" },
              { icon: "📊", title: "Data Analyst", loc: "Tbilisi", salary: "$2,000–3,500" },
            ].map((j) => (
              <div key={j.title} style={{
                margin: "6px 10px",
                padding: "10px 12px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 12,
                opacity: 0.7,
              }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.8)", marginBottom: 3 }}>
                  {j.icon} {j.title}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>📍 {j.loc}</span>
                  <span style={{ fontSize: 9, color: C.blueB }}>{j.salary}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating notification badges */}
      <div style={{
        position: "absolute",
        top: 80, right: -90,
        padding: "8px 14px",
        background: "rgba(4,22,51,0.9)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(56,184,245,0.3)",
        borderRadius: 12,
        boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
        animation: "floatB 5s ease-in-out infinite",
        whiteSpace: "nowrap",
        zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ position: "relative" }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "#22C55E",
            }} />
            <div style={{
              position: "absolute", inset: 0,
              background: "#22C55E", borderRadius: "50%",
              animation: "ping 1.5s ease-out infinite",
            }} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 600, color: "white" }}>New match found!</span>
        </div>
        <div style={{ fontSize: 10, color: C.w40, marginTop: 2 }}>Frontend Dev — Remote</div>
      </div>

      <div style={{
        position: "absolute",
        bottom: 140, left: -80,
        padding: "8px 14px",
        background: "rgba(4,22,51,0.9)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,107,43,0.3)",
        borderRadius: 12,
        boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
        animation: "float 7s ease-in-out infinite 1s",
        whiteSpace: "nowrap",
        zIndex: 10,
      }}>
        <div style={{ fontSize: 10, color: C.orangeL, fontWeight: 600, marginBottom: 2 }}>95% Match</div>
        <div style={{ fontSize: 11, color: "white", fontWeight: 500 }}>Product Designer</div>
        <div style={{ fontSize: 10, color: C.w40 }}>Tbilisi • Hybrid</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   HERO SECTION
───────────────────────────────────────────── */
function Hero() {
  return (
    <section style={{
      minHeight: "100vh",
      display: "flex", alignItems: "center",
      position: "relative", zIndex: 1,
      paddingTop: 100,
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        padding: "80px 24px",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 60,
        flexWrap: "wrap",
      }}>
        {/* Left content */}
        <div style={{ maxWidth: 560, flex: "1 1 400px" }}>
          {/* Eyebrow */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 14px",
            borderRadius: 100,
            background: "rgba(56,184,245,0.08)",
            border: "1px solid rgba(56,184,245,0.2)",
            marginBottom: 24,
            animation: "fadeUp 0.6s ease both",
          }}>
            <TelegramIcon size={14} color={C.blueB} />
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: C.blueB }}>
              Telegram-First Job Platform
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(38px, 6vw, 68px)",
            letterSpacing: "-2px",
            lineHeight: 1.04,
            marginBottom: 24,
            animation: "fadeUp 0.6s ease 0.1s both",
          }}>
            Find Only The Jobs<br />
            <span className="gradient-text">That Matter</span><br />
            <span style={{ color: "white" }}>To You</span>
          </h1>

          {/* Sub */}
          <p style={{
            fontSize: 18, lineHeight: 1.65, color: C.w70,
            marginBottom: 36,
            animation: "fadeUp 0.6s ease 0.2s both",
          }}>
            Stop scrolling through hundreds of irrelevant vacancies. TargetJob delivers personalized job opportunities directly through Telegram based on your preferences.
          </p>

          {/* CTAs */}
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 14,
            animation: "fadeUp 0.6s ease 0.3s both",
          }}>
            <a href="https://t.me/TargetJobGE" className="btn-primary">
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <TelegramIcon size={18} />
                <span>Join Telegram</span>
              </span>
            </a>
            <a href="#how-it-works" className="btn-secondary">
              Learn More →
            </a>
          </div>

          {/* Social proof */}
          <div style={{
            display: "flex", alignItems: "center", gap: 20,
            marginTop: 40,
            animation: "fadeUp 0.6s ease 0.4s both",
          }}>
            <div style={{ display: "flex" }}>
              {["#229ED9", "#FF6B2B", "#22C55E", "#A855F7"].map((bg, i) => (
                <div key={i} style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${bg}, ${bg}99)`,
                  border: "2px solid #020B1E",
                  marginLeft: i === 0 ? 0 : -8,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12,
                }}>
                  {["👩", "👨", "👩", "👨"][i]}
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "white" }}>12,000+ members joined</div>
              <div style={{ fontSize: 12, color: C.w40 }}>⭐ 4.9 satisfaction rate</div>
            </div>
          </div>
        </div>

        {/* Right: phone */}
        <div style={{ flex: "0 0 auto", display: "flex", justifyContent: "center" }}>
          <PhoneMockup />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   HOW IT WORKS
───────────────────────────────────────────── */
const STEPS = [
  {
    num: "01",
    title: "Join TargetJob Bot",
    desc: "Open Telegram and start the TargetJob bot with one tap. No registration required.",
    icon: "🚀",
    color: C.blue,
  },
  {
    num: "02",
    title: "Set Your Preferences",
    desc: "Choose your profession, industry, experience, salary range, location and work type.",
    icon: "⚙️",
    tags: ["Profession", "Industry", "Experience", "Salary", "Location", "Remote / Hybrid / Office"],
    color: C.orange,
  },
  {
    num: "03",
    title: "Receive Matched Jobs",
    desc: "Instantly get personalized job alerts that fit your exact criteria — no noise, only signal.",
    icon: "⚡",
    color: "#22C55E",
  },
];

function HowItWorks() {
  const [ref, vis] = useInView(0.1);
  return (
    <section id="how-it-works" ref={ref} style={{
      position: "relative", zIndex: 1,
      padding: "120px 24px",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 72 }} className={`fade-up ${vis ? "visible" : ""}`}>
          <div className="section-label">How It Works</div>
          <div className="section-title">Three Steps to Better Jobs</div>
          <p className="section-sub" style={{ margin: "0 auto", textAlign: "center" }}>
            TargetJob removes the friction from job hunting and replaces it with precision-matched opportunities.
          </p>
        </div>

        {/* Steps */}
        <div style={{
          display: "flex",
          gap: 32,
          position: "relative",
          flexWrap: "wrap",
        }}>
          {/* Connector line */}
          <div style={{
            position: "absolute",
            top: 60, left: "16.6%", right: "16.6%",
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(56,184,245,0.3), rgba(255,107,43,0.3), transparent)",
            display: "none",
          }} />

          {STEPS.map((s, i) => (
            <div key={i} className={`fade-up ${vis ? "visible" : ""}`} style={{
              flex: "1 1 280px",
              transitionDelay: `${i * 0.12}s`,
            }}>
              <div className="glass" style={{
                padding: "36px 32px",
                borderRadius: 24,
                position: "relative",
                overflow: "hidden",
                transition: "transform 0.3s, box-shadow 0.3s",
                cursor: "default",
                animation: `borderGlow ${3 + i}s ease-in-out infinite`,
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = `0 20px 60px rgba(0,0,0,0.4), 0 0 40px ${s.color}22`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                {/* Step number bg */}
                <div style={{
                  position: "absolute", top: -10, right: -10,
                  fontFamily: "Syne, sans-serif", fontWeight: 800,
                  fontSize: 80, color: "rgba(255,255,255,0.03)",
                  lineHeight: 1, userSelect: "none",
                }}>{s.num}</div>

                {/* Icon */}
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: `${s.color}15`,
                  border: `1px solid ${s.color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 24, marginBottom: 20,
                  boxShadow: `0 0 20px ${s.color}20`,
                }}>{s.icon}</div>

                {/* Number badge */}
                <div style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: 28, height: 28, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${s.color}, ${s.color}99)`,
                  fontSize: 12, fontWeight: 700, color: "white",
                  marginBottom: 14,
                }}>{i + 1}</div>

                <h3 style={{
                  fontFamily: "Syne, sans-serif", fontWeight: 700,
                  fontSize: 20, marginBottom: 10,
                  color: "white",
                }}>{s.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: C.w70, marginBottom: s.tags ? 16 : 0 }}>
                  {s.desc}
                </p>
                {s.tags && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
                    {s.tags.map(t => (
                      <span key={t} style={{
                        padding: "3px 10px", borderRadius: 100,
                        background: "rgba(56,184,245,0.08)",
                        border: "1px solid rgba(56,184,245,0.2)",
                        fontSize: 11, fontWeight: 500, color: C.blueB,
                      }}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FEATURES
───────────────────────────────────────────── */
const FEATURES = [
  { icon: "🎯", title: "Personalized Job Alerts", desc: "Receive only jobs that match your exact profile — profession, experience, and location.", color: C.blue },
  { icon: "💬", title: "Telegram Integration", desc: "Everything works natively inside Telegram. No apps to install, no websites to browse.", color: "#229ED9" },
  { icon: "📍", title: "Location-Based Jobs", desc: "Find opportunities near your preferred area or go fully remote — your choice.", color: C.orange },
  { icon: "🔍", title: "Smart Filtering", desc: "Advanced matching by profession, salary expectations, experience level and work type.", color: "#A855F7" },
  { icon: "⚡", title: "Fast Application Access", desc: "Apply directly from Telegram the moment a matching vacancy appears.", color: "#22C55E" },
  { icon: "🔔", title: "Real-Time Notifications", desc: "Instant alerts the second a new job matching your criteria gets posted.", color: "#F59E0B" },
];

function Features() {
  const [ref, vis] = useInView(0.1);
  return (
    <section id="features" ref={ref} style={{
      position: "relative", zIndex: 1,
      padding: "120px 24px",
    }}>
      {/* Section bg accent */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(180deg, transparent 0%, rgba(7,29,69,0.4) 50%, transparent 100%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 72 }} className={`fade-up ${vis ? "visible" : ""}`}>
          <div className="section-label">Core Features</div>
          <div className="section-title">Built for Job Seekers<br /><span className="orange-text">Who Value Their Time</span></div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {FEATURES.map((f, i) => (
            <div key={i} className={`fade-up ${vis ? "visible" : ""}`} style={{ transitionDelay: `${i * 0.08}s` }}>
              <div className="glass" style={{
                padding: "32px 28px",
                borderRadius: 20,
                height: "100%",
                position: "relative", overflow: "hidden",
                transition: "all 0.3s ease",
                cursor: "default",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.borderColor = `${f.color}40`;
                  e.currentTarget.style.background = `${f.color}08`;
                  e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,0.3), 0 0 30px ${f.color}15`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.borderColor = "";
                  e.currentTarget.style.background = "";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                {/* bg glow */}
                <div style={{
                  position: "absolute", top: -20, right: -20,
                  width: 100, height: 100, borderRadius: "50%",
                  background: `radial-gradient(circle, ${f.color}15 0%, transparent 70%)`,
                  pointerEvents: "none",
                }} />

                <div style={{
                  fontSize: 28, marginBottom: 16,
                  width: 52, height: 52, borderRadius: 14,
                  background: `${f.color}12`,
                  border: `1px solid ${f.color}25`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{f.icon}</div>

                <h3 style={{
                  fontFamily: "Syne, sans-serif", fontWeight: 700,
                  fontSize: 17, color: "white", marginBottom: 10,
                }}>{f.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: C.w70 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   ECOSYSTEM
───────────────────────────────────────────── */
const ECOSYSTEM = [
  {
    icon: "📢",
    title: "Job Opportunities Channel",
    handle: "@TargetJobGE",
    desc: "Daily verified vacancies from multiple industries, curated and posted every day. Never miss a relevant opportunity.",
    tags: ["Daily Updates", "Verified", "Multi-Industry"],
    color: C.blue,
    members: "12K+",
  },
  {
    icon: "🎓",
    title: "Career Development Channel",
    handle: "@TargetJobCareer",
    desc: "Career growth content, interview preparation, CV tips, salary guides and in-depth industry insights.",
    tags: ["Interview Prep", "CV Tips", "Insights"],
    color: C.orange,
    members: "8K+",
  },
  {
    icon: "💬",
    title: "Career Advice Community",
    handle: "@TargetJobChat",
    desc: "Ask questions, share experiences and get guidance from industry professionals and fellow job seekers.",
    tags: ["Community", "Q&A", "Networking"],
    color: "#A855F7",
    members: "5K+",
  },
];

function Ecosystem() {
  const [ref, vis] = useInView(0.1);
  return (
    <section id="ecosystem" ref={ref} style={{
      position: "relative", zIndex: 1,
      padding: "120px 24px",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 72 }} className={`fade-up ${vis ? "visible" : ""}`}>
          <div className="section-label">TargetJob Ecosystem</div>
          <div className="section-title">Three Channels, One Mission</div>
          <p className="section-sub" style={{ margin: "0 auto", textAlign: "center" }}>
            A complete Telegram ecosystem designed to support every stage of your career journey.
          </p>
        </div>

        {/* Cards connected */}
        <div style={{ position: "relative" }}>
          {/* Connection line */}
          <div style={{
            position: "absolute",
            top: "50%", left: "10%", right: "10%",
            height: 1,
            background: "linear-gradient(90deg, rgba(56,184,245,0.3), rgba(255,107,43,0.3), rgba(168,85,247,0.3))",
            display: "none", // hidden on small screens
          }} />

          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {ECOSYSTEM.map((e, i) => (
              <div key={i} className={`fade-up ${vis ? "visible" : ""}`} style={{
                flex: "1 1 280px",
                transitionDelay: `${i * 0.12}s`,
              }}>
                <div style={{
                  padding: "36px 30px",
                  borderRadius: 24,
                  background: `linear-gradient(135deg, ${e.color}08, rgba(255,255,255,0.02))`,
                  border: `1px solid ${e.color}25`,
                  position: "relative",
                  overflow: "hidden",
                  transition: "all 0.35s ease",
                  cursor: "default",
                  height: "100%",
                }}
                  onMouseEnter={ev => {
                    ev.currentTarget.style.transform = "translateY(-6px) scale(1.01)";
                    ev.currentTarget.style.boxShadow = `0 24px 60px rgba(0,0,0,0.4), 0 0 40px ${e.color}20`;
                    ev.currentTarget.style.borderColor = `${e.color}50`;
                  }}
                  onMouseLeave={ev => {
                    ev.currentTarget.style.transform = "";
                    ev.currentTarget.style.boxShadow = "";
                    ev.currentTarget.style.borderColor = `${e.color}25`;
                  }}
                >
                  {/* bg glow */}
                  <div style={{
                    position: "absolute", top: -40, right: -40,
                    width: 160, height: 160, borderRadius: "50%",
                    background: `radial-gradient(circle, ${e.color}15 0%, transparent 70%)`,
                    pointerEvents: "none",
                  }} />

                  {/* Members badge */}
                  <div style={{
                    position: "absolute", top: 20, right: 20,
                    padding: "4px 10px", borderRadius: 100,
                    background: `${e.color}15`,
                    border: `1px solid ${e.color}30`,
                    fontSize: 11, fontWeight: 600, color: e.color,
                  }}>{e.members} members</div>

                  <div style={{
                    fontSize: 32, marginBottom: 16,
                    width: 60, height: 60, borderRadius: 18,
                    background: `${e.color}12`,
                    border: `1px solid ${e.color}25`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>{e.icon}</div>

                  <h3 style={{
                    fontFamily: "Syne, sans-serif", fontWeight: 700,
                    fontSize: 19, color: "white", marginBottom: 4,
                  }}>{e.title}</h3>

                  <div style={{
                    fontSize: 13, fontWeight: 600, color: e.color,
                    marginBottom: 14,
                    fontFamily: "DM Sans, sans-serif",
                  }}>{e.handle}</div>

                  <p style={{ fontSize: 14, lineHeight: 1.65, color: C.w70, marginBottom: 16 }}>{e.desc}</p>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {e.tags.map(t => (
                      <span key={t} style={{
                        padding: "3px 10px", borderRadius: 100,
                        background: `${e.color}10`,
                        border: `1px solid ${e.color}20`,
                        fontSize: 11, fontWeight: 500, color: `${e.color}CC`,
                      }}>{t}</span>
                    ))}
                  </div>

                  <a href={`https://t.me/${e.handle.slice(1)}`} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    marginTop: 24, padding: "10px 18px",
                    borderRadius: 12,
                    background: `${e.color}12`,
                    border: `1px solid ${e.color}25`,
                    color: e.color, fontSize: 13, fontWeight: 600,
                    textDecoration: "none",
                    transition: "all 0.2s",
                    width: "fit-content",
                  }}
                    onMouseEnter={ev => ev.currentTarget.style.background = `${e.color}22`}
                    onMouseLeave={ev => ev.currentTarget.style.background = `${e.color}12`}
                  >
                    <TelegramIcon size={14} color={e.color} />
                    Join Channel
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   BOT FLOW SECTION
───────────────────────────────────────────── */
function BotFlow() {
  const [ref, vis] = useInView(0.1);
  const steps = [
    { icon: "👤", label: "Your Preferences", sub: "Profession · Salary · Location · Type", color: C.blue },
    { icon: "🤖", label: "TargetJob AI", sub: "Matching engine processes your profile", color: C.orange, big: true },
    { icon: "📬", label: "Your Perfect Job", sub: "Instant notification in Telegram", color: "#22C55E" },
  ];

  return (
    <section style={{ position: "relative", zIndex: 1, padding: "120px 24px" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, transparent, rgba(7,29,69,0.5) 50%, transparent)",
        pointerEvents: "none",
      }} />
      <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative" }} ref={ref}>
        <div style={{ textAlign: "center", marginBottom: 72 }} className={`fade-up ${vis ? "visible" : ""}`}>
          <div className="section-label">How Matching Works</div>
          <div className="section-title">AI-Powered Job Matching</div>
          <p className="section-sub" style={{ margin: "0 auto", textAlign: "center" }}>
            Your preferences flow through our matching engine to deliver the most relevant opportunities instantly.
          </p>
        </div>

        <div className={`fade-up ${vis ? "visible" : ""}`} style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 0, flexWrap: "wrap",
        }}>
          {steps.map((s, i) => (
            <>
              <div key={i} style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                padding: "36px 32px",
                borderRadius: 24,
                background: s.big
                  ? `linear-gradient(135deg, ${s.color}20, ${s.color}08)`
                  : "rgba(255,255,255,0.03)",
                border: `1px solid ${s.color}${s.big ? "40" : "20"}`,
                minWidth: s.big ? 220 : 180,
                boxShadow: s.big ? `0 0 60px ${s.color}20` : "none",
                position: "relative",
                zIndex: s.big ? 2 : 1,
                animation: s.big ? "glow 3s ease-in-out infinite" : "none",
                transition: "transform 0.3s",
                cursor: "default",
              }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
                onMouseLeave={e => e.currentTarget.style.transform = ""}
              >
                <div style={{
                  width: s.big ? 72 : 56, height: s.big ? 72 : 56,
                  borderRadius: 18,
                  background: `${s.color}15`,
                  border: `1px solid ${s.color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: s.big ? 32 : 26,
                  marginBottom: 14,
                  boxShadow: `0 0 20px ${s.color}20`,
                }}>{s.icon}</div>
                <div style={{
                  fontFamily: "Syne, sans-serif", fontWeight: 700,
                  fontSize: s.big ? 17 : 15, color: "white", textAlign: "center", marginBottom: 6,
                }}>{s.label}</div>
                <div style={{ fontSize: 12, color: C.w40, textAlign: "center", lineHeight: 1.5 }}>{s.sub}</div>
                {s.big && (
                  <div style={{
                    marginTop: 12, padding: "4px 12px", borderRadius: 100,
                    background: `${s.color}15`, border: `1px solid ${s.color}30`,
                    fontSize: 11, fontWeight: 600, color: s.color,
                  }}>95% Accuracy</div>
                )}
              </div>
              {i < steps.length - 1 && (
                <div key={`arrow-${i}`} style={{
                  display: "flex", alignItems: "center", padding: "0 8px",
                  color: C.w40, fontSize: 24,
                }}>→</div>
              )}
            </>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   STATS
───────────────────────────────────────────── */
const STATS = [
  { value: "12,000+", label: "Active Members", icon: "👥", color: C.blue },
  { value: "50+", label: "Weekly Vacancies", icon: "💼", color: C.orange },
  { value: "8+", label: "Job Categories", icon: "🗂", color: "#A855F7" },
  { value: "95%", label: "User Satisfaction", icon: "⭐", color: "#22C55E" },
];

function Stats() {
  const [ref, vis] = useInView(0.2);
  return (
    <section ref={ref} style={{ position: "relative", zIndex: 1, padding: "80px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 24,
        }}>
          {STATS.map((s, i) => (
            <div key={i} className={`fade-up ${vis ? "visible" : ""}`} style={{
              transitionDelay: `${i * 0.1}s`,
            }}>
              <div className="glass" style={{
                padding: "32px 28px",
                borderRadius: 20,
                textAlign: "center",
                border: `1px solid ${s.color}20`,
                position: "relative", overflow: "hidden",
                transition: "transform 0.3s",
                cursor: "default",
              }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseLeave={e => e.currentTarget.style.transform = ""}
              >
                <div style={{
                  position: "absolute", inset: 0,
                  background: `radial-gradient(circle at 50% 0%, ${s.color}08 0%, transparent 70%)`,
                  pointerEvents: "none",
                }} />
                <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                <div style={{
                  fontFamily: "Syne, sans-serif", fontWeight: 800,
                  fontSize: 40, letterSpacing: "-2px",
                  background: `linear-gradient(90deg, ${s.color}, ${s.color}99)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: 4,
                }}>{s.value}</div>
                <div style={{ fontSize: 14, color: C.w70, fontWeight: 500 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   TESTIMONIALS
───────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    name: "Nino Kapanadze",
    role: "Frontend Developer",
    company: "Hired at TBC Bank",
    avatar: "NK",
    color: C.blue,
    text: "I spent months on job boards with no luck. Two weeks after joining TargetJob, I got a notification for exactly the role I wanted. One interview later — I had the offer.",
    rating: 5,
  },
  {
    name: "Giorgi Beridze",
    role: "Product Designer",
    company: "Now at Bpay",
    avatar: "GB",
    color: C.orange,
    text: "The filtering is incredible. I set my preferences once and now I only get jobs that are genuinely relevant to my skills and salary expectations. Zero noise.",
    rating: 5,
  },
  {
    name: "Mariam Tsiklauri",
    role: "Marketing Manager",
    company: "Remote at Global Company",
    avatar: "MT",
    color: "#A855F7",
    text: "Found a fully remote marketing role through TargetJob that I would never have discovered on traditional job sites. The Telegram experience is seamless.",
    rating: 5,
  },
  {
    name: "Luka Mchedlishvili",
    role: "Data Analyst",
    company: "Placed at Galt & Taggart",
    avatar: "LM",
    color: "#22C55E",
    text: "TargetJob is the future of job hunting. Instead of me searching for jobs, jobs come to me. I landed my dream role in data analytics in under a month.",
    rating: 5,
  },
  {
    name: "Ana Kvaratskhelia",
    role: "HR Specialist",
    company: "Hired at Liberty Bank",
    avatar: "AK",
    color: "#F59E0B",
    text: "The Career Development channel alone is worth it. The CV tips and interview guides helped me finally crack the interviews I was failing before.",
    rating: 5,
  },
  {
    name: "David Maisuradze",
    role: "Backend Engineer",
    company: "Placed at Space International",
    avatar: "DM",
    color: "#EC4899",
    text: "I appreciate that every notification is relevant. No spam, no irrelevant openings. Just clean, curated opportunities that match my exact tech stack.",
    rating: 5,
  },
];

function Testimonials() {
  const [ref, vis] = useInView(0.1);
  return (
    <section id="reviews" ref={ref} style={{ position: "relative", zIndex: 1, padding: "120px 24px" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, transparent, rgba(7,29,69,0.4) 50%, transparent)",
        pointerEvents: "none",
      }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 72 }} className={`fade-up ${vis ? "visible" : ""}`}>
          <div className="section-label">Testimonials</div>
          <div className="section-title">Real Stories, Real Results</div>
          <p className="section-sub" style={{ margin: "0 auto", textAlign: "center" }}>
            Thousands of job seekers have found their next opportunity through TargetJob.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className={`fade-up ${vis ? "visible" : ""}`} style={{ transitionDelay: `${i * 0.08}s` }}>
              <div className="glass" style={{
                padding: "28px 26px",
                borderRadius: 20,
                border: "1px solid rgba(255,255,255,0.07)",
                height: "100%",
                position: "relative",
                transition: "all 0.3s ease",
                cursor: "default",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.borderColor = `${t.color}30`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                }}
              >
                {/* Stars */}
                <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                  {Array(t.rating).fill("⭐").map((s, j) => (
                    <span key={j} style={{ fontSize: 13 }}>{s}</span>
                  ))}
                </div>

                <p style={{
                  fontSize: 14, lineHeight: 1.7, color: C.w70,
                  marginBottom: 20, fontStyle: "italic",
                }}>"{t.text}"</p>

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: `linear-gradient(135deg, ${t.color}, ${t.color}80)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 700, color: "white", flexShrink: 0,
                  }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "white" }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: t.color, fontWeight: 500 }}>{t.role}</div>
                    <div style={{ fontSize: 11, color: C.w40 }}>{t.company}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FINAL CTA
───────────────────────────────────────────── */
function FinalCTA() {
  const [ref, vis] = useInView(0.2);
  return (
    <section ref={ref} style={{ position: "relative", zIndex: 1, padding: "120px 24px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div className={`fade-up ${vis ? "visible" : ""}`}>
          <div style={{
            padding: "72px 60px",
            borderRadius: 32,
            background: "linear-gradient(135deg, rgba(34,158,217,0.12), rgba(7,29,69,0.8), rgba(255,107,43,0.08))",
            border: "1px solid rgba(56,184,245,0.2)",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 40px 80px rgba(0,0,0,0.4)",
            animation: "borderGlow 4s ease-in-out infinite",
          }}>
            {/* bg orbs */}
            <div style={{
              position: "absolute", top: -60, left: -60,
              width: 200, height: 200, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(34,158,217,0.15) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />
            <div style={{
              position: "absolute", bottom: -60, right: -60,
              width: 200, height: 200, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,107,43,0.1) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />

            <div style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 72, height: 72, borderRadius: 22,
              background: "linear-gradient(135deg, #229ED9, #38B8F5)",
              marginBottom: 28,
              boxShadow: "0 0 40px rgba(34,158,217,0.4)",
              animation: "glow 3s ease-in-out infinite",
            }}>
              <TelegramIcon size={34} />
            </div>

            <h2 style={{
              fontFamily: "Syne, sans-serif", fontWeight: 800,
              fontSize: "clamp(28px, 5vw, 44px)",
              letterSpacing: "-1.5px", lineHeight: 1.1,
              marginBottom: 18, color: "white",
            }}>
              Start Receiving Better<br />
              <span className="gradient-text">Job Opportunities Today</span>
            </h2>

            <p style={{
              fontSize: 17, lineHeight: 1.65, color: C.w70,
              maxWidth: 480, margin: "0 auto 36px",
            }}>
              Tell us what kind of job you're looking for and let TargetJob do the searching for you.
            </p>

            <a href="https://t.me/TargetJobGE" className="btn-primary" style={{
              padding: "16px 36px", fontSize: 16,
              boxShadow: "0 12px 40px rgba(34,158,217,0.4)",
            }}>
              <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <TelegramIcon size={20} />
                <span>Join TargetJob on Telegram</span>
              </span>
            </a>

            <div style={{
              marginTop: 24, fontSize: 13, color: C.w40,
            }}>Free to join · No registration required · Start in seconds</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{
      position: "relative", zIndex: 1,
      borderTop: "1px solid rgba(255,255,255,0.06)",
      padding: "48px 24px",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 24,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #229ED9, #38B8F5)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <TelegramIcon size={18} />
          </div>
          <span style={{
            fontFamily: "Syne, sans-serif", fontWeight: 800,
            fontSize: 18, letterSpacing: "-0.5px",
          }}>
            Target<span style={{ color: C.blueB }}>Job</span>
          </span>
        </div>

        <div style={{ fontSize: 13, color: C.w40 }}>
          © 2025 TargetJob. Personalized job discovery on Telegram.
        </div>

        <div style={{ display: "flex", gap: 20 }}>
          {[
            { label: "Jobs Channel", href: "https://t.me/TargetJobGE" },
            { label: "Career Channel", href: "https://t.me/TargetJobCareer" },
            { label: "Community", href: "https://t.me/TargetJobChat" },
          ].map(l => (
            <a key={l.label} href={l.href} style={{
              fontSize: 13, color: C.w40, textDecoration: "none",
              transition: "color 0.2s",
            }}
              onMouseEnter={e => e.target.style.color = C.blueB}
              onMouseLeave={e => e.target.style.color = C.w40}
            >{l.label}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────── */
export default function App() {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(155deg, ${C.navy} 0%, ${C.navyMid} 40%, ${C.navyUp} 70%, ${C.navy} 100%)`,
      fontFamily: "DM Sans, sans-serif",
      color: "white",
      position: "relative",
    }}>
      <BackgroundCanvas />
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Ecosystem />
      <BotFlow />
      <Stats />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </div>
  );
}
