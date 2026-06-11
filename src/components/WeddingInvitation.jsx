import React, { useEffect, useRef, useState, useCallback } from "react";
import { MapPin, Heart, ChevronDown } from "lucide-react";

const WEDDING_DATE = new Date(2026, 7, 8, 19, 0, 0); // August 8 2026, 19:00

const t = {
  saveTheDate: { sq: "SAVE THE DATE",              tr: "TARİHİ KAYDET" },
  weddingDay:  { sq: "Dita e Dasmës",              tr: "Düğün Günü" },
  date:        { sq: "E SHTUNË, 8 GUSHT 2026",    tr: "CUMARTESİ, 8 AĞUSTOS 2026" },
  time:        { sq: "ORA 19:00",                  tr: "SAAT 19:00" },
  countdown:   { sq: "Festa Fillon",               tr: "Kutlama Başlıyor" },
  soonSee:     { sq: "Shihemi së shpejti ",      tr: "Yakında görüşürüz " },
  couple:      { sq: "ÇIFTI I LUMTUR",             tr: "MUTLU ÇİFT" },
  together:    { sq: "Bashkë përgjithmonë",        tr: "Sonsuza dek birlikte" },
  quote:       { sq: "Dashuria është mrekullia jonë, besnikëria është forca jonë, dhe bashkë jemi të plotë", tr: "Aşk mucizemizdır, sadakat gücümüzdür ve birlikte bütünüz" },
  celebration: { sq: "NJË FESTË E DASHURISË",     tr: "AŞKIN KUTLAMASI" },
  location:    { sq: "VENDNDODHJA",                tr: "KONUM" },
  openMaps:    { sq: "HAP NË GOOGLE MAPS",         tr: "GOOGLE HARİTALARDA AÇ" },
  closing:     { sq: "Me padurim presim të festojmë së bashku me ju, për mos ardhje na lajmroni paraprakisht.", tr: "Sizinle birlikte kutlamayı dört gözle bekliyoruz, gelmemeniz durumunda lütfen önceden haber verin." },
  days:        { sq: "Ditë",  tr: "Gün" },
  hours:       { sq: "Orë",   tr: "Saat" },
  minutes:     { sq: "Min",   tr: "Dak" },
  seconds:     { sq: "Sek",   tr: "San" },
  loveBegins:  { sq: "Me dashuri fillon gjithçka ✨", tr: "Her şey sevgiyle başlar ✨" },
};

function calcCountdown() {
  const distance = WEDDING_DATE.getTime() - Date.now();
  if (distance <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days:    Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((distance % (1000 * 60)) / 1000),
  };
}

function FloatingHearts() {
  return (
    <div className="floating-hearts" aria-hidden="true">
      {[...Array(5)].map((_, i) => (
        <Heart
          key={i}
          className="floating-heart"
          style={{
            left: `${12 + i * 18}%`,
            animationDelay: `${i * 1.1}s`,
            animationDuration: `${5 + i * 0.7}s`,
          }}
          size={14}
          fill="#c9a96e"
          color="#c9a96e"
        />
      ))}
    </div>
  );
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400;1,600&family=Great+Vibes&display=swap');

  :root {
    --cream:  #f5efe6;
    --cream2: #ede4d6;
    --cream3: #e6dbc8;
    --gold:   #c9a96e;
    --ink:    #2c2416;
    --muted:  #7a6a52;
  }

  *, *::before, *::after { box-sizing: border-box; }

  html, body {
    margin: 0; padding: 0;
    width: 100%;
    overflow-x: clip;          /* clip (not hidden) — avoids iOS Safari scroll-container conflict that snaps page back to top */
    background: var(--cream);
  }

  .font-script  { font-family: "Great Vibes", cursive; }
  .font-caps    { font-family: "Cormorant Garamond", serif; letter-spacing: .2em; text-transform: uppercase; }
  .font-serif   { font-family: "Cormorant Garamond", serif; }
  .font-display { font-family: "Playfair Display", serif; }

  /* ── PAGE CONTAINER ── */
  .inv-page {
    width: 100%;
    overflow-x: clip;
    background: var(--cream);
  }

  /* ── SECTIONS ── */
  .inv-section {
    min-height: 100vh;
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 24px 80px;
    overflow: hidden;
  }

  /* ── DIVIDERS ── */
  .divider {
    height: 1px;
    background: linear-gradient(to right, transparent, var(--gold), transparent);
    opacity: .55;
    max-width: 240px;
    margin: 0 auto;
    width: 100%;
  }
  .divider-lg {
    height: 1px;
    background: linear-gradient(to right, transparent, var(--gold), transparent);
    opacity: .4;
    max-width: 80%;
    margin: 0 auto;
    width: 100%;
  }

  /* ── ORNAMENT ROW ── */
  .ornament {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: var(--gold);
    opacity: .65;
  }
  .ornament::before, .ornament::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--gold);
    opacity: .45;
    max-width: 56px;
  }

  /* ── SCROLL REVEAL ── */
  .reveal {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity .6s ease-out, transform .6s ease-out;
  }
  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* ── COUNTDOWN ── */
  .cd-row {
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }
  .cd-unit { text-align: center; min-width: 58px; }
  .cd-num {
    font-family: "Playfair Display", serif;
    font-size: clamp(44px, 13vw, 64px);
    font-weight: 700;
    color: var(--ink);
    line-height: 1;
  }
  .cd-colon {
    font-family: "Playfair Display", serif;
    font-size: clamp(40px, 11vw, 56px);
    font-weight: 700;
    color: var(--gold);
    line-height: 1;
    padding: 0 3px;
    margin-top: 1px;
  }
  .cd-label {
    font-family: "Cormorant Garamond", serif;
    font-size: 10px;
    letter-spacing: .14em;
    color: var(--muted);
    margin-top: 5px;
    text-transform: uppercase;
    line-height: 1.6;
  }

  /* ── SCROLL HINT ── */
  .scroll-hint {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;
    animation: bounceUD 2s ease-in-out infinite;
    transition: opacity .6s ease;
    pointer-events: none;
  }
  .scroll-hint.hidden { opacity: 0; }
  @keyframes bounceUD {
    0%,100% { transform: translateX(-50%) translateY(0); }
    50%      { transform: translateX(-50%) translateY(-10px); }
  }

  /* ── FLOATING HEARTS ── */
  .floating-hearts { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
  .floating-heart  {
    position: absolute; bottom: -30px;
    animation: floatUp 6s ease-in infinite;
    will-change: transform;
  }
  @keyframes floatUp {
    0%   { transform: translate3d(0,0,0) rotate(0deg);   opacity: 0; }
    10%  { opacity: .35; }
    90%  { opacity: .35; }
    100% { transform: translate3d(0,-105vh,0) rotate(360deg); opacity: 0; }
  }

  /* ── GLOW (static — no per-frame repaint, keeps scrolling smooth) ── */
  .glow { text-shadow: 0 0 16px rgba(201,169,110,.35); }

  /* ── IMAGE FRAME ── */
  .img-frame {
    border: 6px solid rgba(255,255,255,.95);
    box-shadow: 0 8px 36px rgba(0,0,0,.12), inset 0 0 0 1px rgba(201,169,110,.3);
    border-radius: 3px;
    overflow: hidden;
  }

  /* ── LANG SWITCHER ── */
  .lang-switcher {
    position: fixed;
    top: 16px;
    right: 16px;
    z-index: 200;
    display: flex;
    border-radius: 999px;
    overflow: hidden;
    border: 1px solid rgba(201,169,110,.5);
    background: rgba(245,239,230,.96);
    box-shadow: 0 2px 10px rgba(0,0,0,.08);
  }
  .lang-btn {
    padding: 6px 14px;
    font-family: "Cormorant Garamond", serif;
    font-size: 11px;
    letter-spacing: .12em;
    text-transform: uppercase;
    border: none;
    background: transparent;
    color: var(--muted);
    cursor: pointer;
    transition: background .2s, color .2s;
    -webkit-tap-highlight-color: transparent;
  }
  .lang-btn.active {
    background: var(--gold);
    color: #fff;
  }

  /* ── OPEN MAP BUTTON ── */
  .map-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 32px;
    border-radius: 999px;
    background: var(--gold);
    color: #fff;
    font-family: "Cormorant Garamond", serif;
    letter-spacing: .15em;
    font-size: 11px;
    text-transform: uppercase;
    border: none;
    cursor: pointer;
    transition: opacity .2s ease, transform .15s ease;
    -webkit-tap-highlight-color: transparent;
  }
  .map-btn:active { opacity: .85; transform: scale(.97); }

  /* ── INTRO ── */
  .intro-fadeout { opacity: 0; transform: translateY(10px); transition: all 500ms ease; }
`;

const INTRO_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:wght@300;400&display=swap');
  :root { --cream:#f5efe6; --gold:#c9a96e; --ink:#2c2416; --muted:#7a6a52; }
  .font-script { font-family: "Great Vibes", cursive; }
  .font-caps   { font-family: "Cormorant Garamond", serif; letter-spacing: .22em; text-transform: uppercase; }
  .intro-fadeout { opacity:0; transform:translateY(10px); transition:all 500ms ease; }
  @keyframes pulse { 0%,100%{transform:scale(1) translateX(-50%);opacity:.9} 50%{transform:scale(1.04) translateX(-50%);opacity:1} }
`;

export default function WeddingInvitation() {
  const [stage, setStage]               = useState("intro");
  const [fadeOut, setFadeOut]           = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [countdown, setCountdown]       = useState(calcCountdown);
  const [lang, setLang]                 = useState("sq");

  const introRef    = useRef(null);
  const sectionsRef = useRef([]);

  // Countdown ticker
  useEffect(() => {
    if (stage !== "details") return;
    const tick = () => setCountdown(calcCountdown());
    tick(); // immediate first tick
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [stage]);

  // Hide scroll hint after user scrolls a bit
  useEffect(() => {
    if (stage !== "details") return;
    const onScroll = () => { if (window.scrollY > 80) setShowScrollHint(false); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [stage]);

  // Scroll reveal via IntersectionObserver
  useEffect(() => {
    if (stage !== "details") return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      // Reveal well BEFORE the section enters view, so it's already shown when you scroll to it
      { threshold: 0, rootMargin: "0px 0px 40% 0px" }
    );
    sectionsRef.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [stage]);

  const openMap = useCallback(() => {
    window.open("https://maps.app.goo.gl/WJpMtdx6Vfah7tuc8", "_blank", "noopener");
  }, []);

  const handleIntroClick = async () => {
    const v = introRef.current;
    if (!v) return;
    try {
      v.currentTime = 0;
      await v.play();
    } catch (e) {
      handleIntroEnded();
    }
  };

  const handleIntroEnded = () => {
    setFadeOut(true);
    setTimeout(() => {
      setStage("details");
    }, 500);
  };

  // ── INTRO SCREEN ────────────────────────────────────────────
  if (stage === "intro") {
    return (
      <div style={{ position:"fixed", inset:0, background:"#f5f0e8" }}>
        <style>{INTRO_STYLES}</style>

        <div style={{ position:"absolute", inset:0, cursor:"pointer", background:"#f5f0e8" }} onClick={handleIntroClick}>
          <video
            ref={introRef}
            src="/intro.mp4"
            poster="/intro-poster.jpg"
            style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }}
            playsInline
            muted
            preload="auto"
            onEnded={handleIntroEnded}
          />

          {/* Black fade out */}
          <div style={{ position:"absolute", inset:0, background:"black", opacity: fadeOut ? 1 : 0, transition:"opacity 500ms ease", pointerEvents:"none" }} />

          {/* Names + tap hint */}
          <div style={{ position:"absolute", left:0, right:0, bottom:52, display:"flex", justifyContent:"center", padding:"0 24px", opacity: fadeOut ? 0 : 1, transition:"opacity 400ms ease" }}>
            <div style={{ textAlign:"center" }}>
              <div className="font-script" style={{ color:"#fff", fontSize:"clamp(52px,16vw,70px)", lineHeight:1.05, textShadow:"0 2px 16px rgba(0,0,0,.5)" }}>
                Arben & Sumeja
              </div>
              <div className="font-caps" style={{ color:"rgba(255,255,255,.6)", fontSize:"10px", marginTop:"8px", letterSpacing:".22em" }}>
                08 · 08 · 2026
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── DETAILS ─────────────────────────────────────────────────
  return (
    <div className="inv-page">
      <style>{STYLES}</style>

      {/* Language switcher */}
      <div className="lang-switcher">
        <button className={`lang-btn ${lang === "sq" ? "active" : ""}`} onClick={() => setLang("sq")}>SQ</button>
        <button className={`lang-btn ${lang === "tr" ? "active" : ""}`} onClick={() => setLang("tr")}>TR</button>
      </div>

      {/* Scroll hint */}
      <div className={`scroll-hint ${showScrollHint ? "" : "hidden"}`} aria-hidden="true">
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
          <span className="font-caps" style={{ color:"var(--gold)", fontSize:"9px" }}>
            {lang === "sq" ? "RRËSHQIT POSHTË" : "AŞAĞI KAYDIRIN"}
          </span>
          <ChevronDown size={26} color="#c9a96e" strokeWidth={1.5} />
        </div>
      </div>

      {/* ══ SECTION 1 — HERO IMAGE ══ */}
      <section
        ref={(el) => (sectionsRef.current[0] = el)}
        className="reveal visible"
        style={{
          position:"relative", width:"100%", height:"100vh",
          display:"flex", alignItems:"flex-end", justifyContent:"center",
          overflow:"hidden", flexShrink:0,
        }}
      >
        {/* Full-bleed hero image */}
        <img
          src="/homeimg.png"
          alt=""
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", objectPosition:"center top" }}
        />

        {/* Bottom gradient so text is readable */}
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(30,20,10,.72) 0%, rgba(30,20,10,.18) 45%, transparent 100%)" }} />

        {/* Names overlay */}
        <div style={{ position:"relative", zIndex:2, textAlign:"center", paddingBottom:"52px", width:"100%" }}>
          <h1 className="font-script" style={{ fontSize:"clamp(62px,19vw,88px)", lineHeight:1, color:"#fff", margin:0, textShadow:"0 2px 18px rgba(0,0,0,.45)" }}>
            Arben
          </h1>
          <div className="font-script" style={{ fontSize:"clamp(38px,12vw,52px)", color:"var(--gold)", lineHeight:.9, margin:"4px 0" }}>
            &
          </div>
          <h1 className="font-script" style={{ fontSize:"clamp(62px,19vw,88px)", lineHeight:1, color:"#fff", margin:0, textShadow:"0 2px 18px rgba(0,0,0,.45)" }}>
            Sumeja
          </h1>

          <div style={{ height:1, background:"linear-gradient(to right,transparent,rgba(255,255,255,.5),transparent)", maxWidth:200, margin:"18px auto" }} />

          <p className="font-caps" style={{ color:"rgba(255,255,255,.95)", fontSize:"20px", letterSpacing:".18em", margin:0, textShadow:"0 1px 8px rgba(0,0,0,.5)" }}>
            {t.date[lang]}
          </p>
          <p className="font-caps" style={{ color:"rgba(255,255,255,.85)", fontSize:"17px", letterSpacing:".16em", margin:"8px 0 0", textShadow:"0 1px 8px rgba(0,0,0,.5)" }}>
            {t.time[lang]}
          </p>
        </div>
      </section>

      {/* ══ SECTION 2 — TEXT IMAGE CARD ══ */}
      <section
        ref={(el) => (sectionsRef.current[1] = el)}
        className="reveal"
        style={{
          position:"relative", width:"100%", height:"100vh",
          display:"flex", alignItems:"center", justifyContent:"center",
          background:"var(--cream2)", overflow:"hidden", flexShrink:0,
        }}
      >
        {/* Frame image fills full section */}
        <img
          src="/textimg.png"
          alt=""
          style={{
            position:"absolute", inset:0,
            width:"100%", height:"100%",
            objectFit:"fill",
          }}
        />

        {/* Quote overlaid inside the frame */}
        <div style={{ position:"relative", zIndex:2, textAlign:"center", width:"100%", padding:"0 52px", marginTop:"20%" }}>

          <span style={{ fontFamily:"Georgia,serif", fontSize:"60px", lineHeight:"0.3", color:"var(--gold)", opacity:.45, display:"block" }}>"</span>

          <p className="font-serif" style={{ fontSize:"clamp(25px,5vw,21px)", lineHeight:1.7, fontStyle:"italic", color:"var(--ink)", margin:"16px 0 0" }}>
            {lang === "sq"
              ? <>"Dashuria nuk është vetëm<br />një ndjenjë — është zgjedhja<br />që bën çdo ditë,<br />me zemër të plotë."</>
              : <>"Aşk sadece bir duygu değil —<br />her gün tam bir kalpte<br />verilen karardır."</>
            }
          </p>

          <span style={{ fontFamily:"Georgia,serif", fontSize:"60px", lineHeight:"0.3", color:"var(--gold)", opacity:.45, display:"block", transform:"rotate(180deg)", marginTop:"16px" }}>"</span>
        </div>
      </section>

      {/* ══ SECTION 3 — COUNTDOWN ══ */}
      <section
        ref={(el) => (sectionsRef.current[2] = el)}
        className="inv-section reveal"
        style={{ background:"var(--cream2)" }}
      >
        <FloatingHearts />
        <div style={{ textAlign:"center", width:"100%", maxWidth:360, position:"relative", zIndex:1 }}>

          <p className="font-script glow" style={{ fontSize:"clamp(44px,14vw,56px)", color:"var(--ink)", lineHeight:1.1, margin:0 }}>
            {t.countdown[lang]}
          </p>

          <div className="ornament" style={{ margin:"20px 0" }}>
            <span style={{ color:"var(--gold)", fontSize:"14px" }}>✦</span>
          </div>

          {/* Big countdown */}
          <div className="cd-row">
            {[
              [countdown.days,    t.days],
              [countdown.hours,   t.hours],
              [countdown.minutes, t.minutes],
              [countdown.seconds, t.seconds],
            ].map(([val, label], i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="cd-colon">:</span>}
                <div className="cd-unit">
                  <div className="cd-num">{String(val).padStart(2, "0")}</div>
                  <div className="cd-label">{label[lang]}</div>
                </div>
              </React.Fragment>
            ))}
          </div>

          <div className="divider-lg" style={{ margin:"36px auto" }} />

          <p className="font-script" style={{ fontSize:"38px", color:"var(--gold)", margin:0 }}>
            {t.soonSee[lang]}
          </p>
        </div>
      </section>

      {/* ══ SECTION 4 — PHOTO ══ */}
      <section
        ref={(el) => (sectionsRef.current[3] = el)}
        className="inv-section reveal"
        style={{ background:"var(--cream)" }}
      >
        <div style={{ textAlign:"center", width:"100%", maxWidth:320, position:"relative", zIndex:1 }}>

          <p className="font-caps" style={{ color:"var(--muted)", fontSize:"14px", letterSpacing:".22em", margin:"0 0 20px" }}>
            {t.couple[lang]}
          </p>

          <div className="img-frame" style={{ maxWidth:260, margin:"0 auto" }}>
            <img
              src="/photo1.jpg"
              alt="Arben & Sumeja"
              style={{ width:"100%", height:"auto", objectFit:"cover", aspectRatio:"3/4", maxHeight:"58vh", display:"block" }}
            />
          </div>

          <p className="font-script glow" style={{ fontSize:"44px", color:"var(--gold)", margin:"28px 0 0" }}>
            Arben & Sumeja
          </p>
          <p className="font-serif" style={{ fontSize:"16px", fontStyle:"italic", color:"var(--muted)", margin:"6px 0 0" }}>
            {t.together[lang]}
          </p>
        </div>
      </section>

      {/* ══ SECTION 5 — ROMANTIC TEXT ══ */}
      <section
        ref={(el) => (sectionsRef.current[4] = el)}
        className="inv-section reveal"
        style={{ position:"relative", background:"var(--cream)", overflow:"hidden" }}
      >
        {/* Faded homeimg background */}
        <img
          src="/homeimg.png"
          alt=""
          aria-hidden="true"
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", objectPosition:"center", opacity:.1 }}
        />
        <FloatingHearts />

        <div style={{ position:"relative", zIndex:1, textAlign:"center", width:"100%", maxWidth:340 }}>
          <div className="ornament" style={{ margin:"0 0 24px" }}>
            <span style={{ color:"var(--gold)", fontSize:"18px" }}>✦</span>
          </div>

          <p className="font-script glow" style={{ fontSize:"clamp(46px,14vw,60px)", color:"var(--ink)", lineHeight:1.1, margin:0 }}>
            {lang === "sq" ? "Dasma jonë" : "Düğünümüz"}
          </p>

          <div className="divider" style={{ margin:"20px auto" }} />

          <p className="font-serif" style={{ fontSize:"clamp(25px,5vw,21px)", lineHeight:1.85, fontStyle:"italic", color:"var(--ink)", margin:0 }}>
            {lang === "sq" ? (
              <>Çdo dashuri ka historinë e vet,<br />çdo zemër ka zanafillën e vet.<br />Në 8 Gusht 2026,<br />historia jonë bëhet e plotë.</>
            ) : (
              <>Her aşkın kendi hikâyesi vardır,<br />her kalbin kendi başlangıcı.<br />8 Ağustos 2026'da,<br />hikâyemiz tamamlanıyor.</>
            )}
          </p>

          <div className="divider" style={{ margin:"20px auto" }} />

          <p className="font-script" style={{ fontSize:"clamp(32px,10vw,42px)", color:"var(--gold)", margin:0 }}>
            Arben & Sumeja
          </p>
          <p className="font-caps" style={{ fontSize:"19px", color:"var(--muted)", letterSpacing:".22em", margin:"10px 0 0" }}>
            {lang === "sq" ? "08 · 08 · 2026" : "08 · 08 · 2026"}
          </p>
        </div>
      </section>

      {/* ══ SECTION 6 — QUOTE ══ */}
      <section
        ref={(el) => (sectionsRef.current[5] = el)}
        className="inv-section reveal"
        style={{ background:"var(--cream2)" }}
      >
        <FloatingHearts />
        <div style={{ textAlign:"center", width:"100%", maxWidth:340, position:"relative", zIndex:1 }}>

          <div className="ornament" style={{ margin:"0 0 20px" }}>
            <span style={{ color:"var(--gold)", fontSize:"16px" }}>✦</span>
          </div>

          <span style={{ fontFamily:"Georgia,serif", fontSize:"60px", lineHeight:"0.4", color:"var(--gold)", opacity:.35, display:"block" }}>"</span>

          <p className="font-serif" style={{ fontSize:"clamp(18px,5.5vw,22px)", lineHeight:1.75, fontStyle:"italic", color:"var(--ink)", margin:"16px 0 0", padding:"0 8px" }}>
            {t.quote[lang]}
          </p>

          <span style={{ fontFamily:"Georgia,serif", fontSize:"60px", lineHeight:"0.4", color:"var(--gold)", opacity:.35, display:"block", transform:"rotate(180deg)", marginTop:"16px" }}>"</span>

          <div className="divider" style={{ margin:"28px auto" }} />

          <p className="font-caps" style={{ color:"var(--muted)", fontSize:"13px", letterSpacing:".28em", lineHeight:2 }}>
            {t.celebration[lang]}
          </p>
        </div>
      </section>

      {/* ══ SECTION 7 — LOCATION ══ */}
      <section
        ref={(el) => (sectionsRef.current[6] = el)}
        className="inv-section reveal"
        style={{ background:"var(--cream3)" }}
      >
        <FloatingHearts />
        <div style={{ textAlign:"center", width:"100%", maxWidth:360, position:"relative", zIndex:1 }}>

          <p className="font-caps" style={{ color:"var(--muted)", fontSize:"13px", letterSpacing:".3em" }}>
            {t.location[lang]}
          </p>

          <div className="ornament" style={{ margin:"16px 0" }}>
            <span style={{ color:"var(--gold)", fontSize:"16px" }}>✦</span>
          </div>

          <MapPin size={36} color="#c9a96e" strokeWidth={1.5} style={{ margin:"0 auto 12px", display:"block" }} />

          <h2 className="font-display" style={{ fontSize:"clamp(36px,11vw,48px)", color:"var(--ink)", fontWeight:700, margin:0 }}>
            New Star
          </h2>

          <p className="font-serif" style={{ fontSize:"24px", color:"var(--muted)", margin:"8px 0 0" }}>
            {lang === "sq" ? "Vizebeg / Skopje" : "Vizebeg / Skopje"}
          </p>
          <p className="font-caps" style={{ fontSize:"17px", color:"var(--muted)", margin:"6px 0 0" }}>
            {lang === "sq" ? "ORA 19:00" : "SAAT 19:00"}
          </p>

          <div className="divider-lg" style={{ margin:"24px auto" }} />

          {/* Map embed */}
          <div style={{ borderRadius:"16px", overflow:"hidden", border:"1px solid rgba(201,169,110,.3)" }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2963.031726917443!2d21.4116667!3d42.0425!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x135414c58cf9cde3%3A0x6b2dcfdfba6711ce!2sHotel%20New%20Star!5e0!3m2!1sen!2srs!4v1781189540362!5m2!1sen!2srs"
              width="100%"
              height="220"
              style={{ border:0, display:"block" }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              title="New Star Restaurant - Vizebeg / Skopje"
            />
          </div>

          <button className="map-btn" onClick={openMap} style={{ margin:"24px auto 0", display:"inline-flex", fontSize:"13px", padding:"16px 38px" }}>
            <MapPin size={16} />
            {t.openMaps[lang]}
          </button>

          <div className="divider-lg" style={{ margin:"28px auto" }} />

          <div style={{ display:"flex", alignItems:"flex-start", gap:10, justifyContent:"center", padding:"0 4px" }}>
            <Heart size={16} color="#c9a96e" fill="#c9a96e" style={{ flexShrink:0, marginTop:4 }} />
            <div>
              <p className="font-serif" style={{ fontSize:"18px", lineHeight:1.7, color:"var(--muted)", margin:0 }}>
                {t.closing[lang]}
              </p>
            </div>
            <Heart size={16} color="#c9a96e" fill="#c9a96e" style={{ flexShrink:0, marginTop:4 }} />
          </div>

          {/* Footer */}
          <p className="font-serif" style={{ fontSize:"25px", fontStyle:"italic", color:"var(--muted)", margin:"12px 0 0" }}>
            Me rrespekt, familja Nuredin
          </p>
          <p className="font-caps" style={{ fontSize:"19px", color:"var(--muted)", letterSpacing:".18em", margin:"8px 0 0" }}>
            RSVP: 070 403 703
          </p>
          <p className="font-caps" style={{ fontSize:"18px", color:"var(--muted)", letterSpacing:".25em", margin:"14px 0 0" }}>
            08 · 08 · 2026
          </p>
        </div>
      </section>
    </div>
  );
}
