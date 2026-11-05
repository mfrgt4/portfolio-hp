import { useEffect, useRef, type CSSProperties, type Ref } from "react";
import { profile } from "../data";
import "./HomeLetter.css";

// ---------------------------------------------------------------------------
// Contour irrégulier du sceau de cire (jamais un cercle parfait)
// ---------------------------------------------------------------------------
function waxOutline(cx: number, cy: number, r: number) {
  const N = 90;
  let d = "";
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const k =
      1 +
      0.04 * Math.sin(5 * a + 1.3) +
      0.028 * Math.sin(9 * a + 0.4) +
      0.016 * Math.sin(15 * a + 2.1);
    d += `${i ? "L" : "M"}${(cx + Math.cos(a) * r * k).toFixed(2)} ${(
      cy +
      Math.sin(a) * r * k
    ).toFixed(2)} `;
  }
  return d + "Z";
}

const SEAL_PATH = waxOutline(60, 60, 44);

// Poussières lumineuses dans l'air (valeurs fixes : pas de hasard au rendu)
const MOTES = Array.from({ length: 16 }, (_, i) => ({
  x: (i * 37 + 11) % 100,
  size: 2 + (i % 3),
  delay: -(i * 1.9),
  duration: 15 + (i % 5) * 3,
  drift: ((i % 7) - 3) * 22,
}));

const d = (seconds: number) =>
  ({ "--hl-d": `${seconds}s` }) as CSSProperties;

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

// ---------------------------------------------------------------------------
// Écusson doré en tête de lettre
// ---------------------------------------------------------------------------
function Crest() {
  return (
    <svg
      className="hl-crest-svg"
      viewBox="0 0 72 88"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="hl-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d9bd7d" />
          <stop offset=".5" stopColor="#a47f43" />
          <stop offset="1" stopColor="#c9a35f" />
        </linearGradient>
      </defs>

      <path
        d="M36 6 L65 14 V45 C65 63 52 76 36 83 C20 76 7 63 7 45 V14 Z"
        fill="rgba(116,31,43,.07)"
        stroke="url(#hl-gold)"
        strokeWidth="2"
      />
      <path
        d="M36 12 L59 18.5 V45 C59 59 49 70 36 76.5 C23 70 13 59 13 45 V18.5 Z"
        fill="none"
        stroke="url(#hl-gold)"
        strokeWidth=".8"
      />

      <text
        x="36"
        y="58"
        textAnchor="middle"
        fontSize="38"
        fill="#741F2B"
        fontFamily="'IM Fell English','Cormorant Garamond',serif"
      >
        M
      </text>

      <g fill="url(#hl-gold)">
        <path d="M36 1.5 l1.4 3 3.2.4 -2.4 2.2 .7 3.2 -2.9 -1.7 -2.9 1.7 .7 -3.2 -2.4 -2.2 3.2 -.4z" />
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Sceau de cire bordeaux
// ---------------------------------------------------------------------------
function WaxSeal({
  lightRef,
}: {
  lightRef: Ref<SVGFEPointLightElement>;
}) {
  return (
    <svg
      className="hl-seal-svg"
      viewBox="0 0 120 120"
      role="img"
      aria-label="Sceau de cire marqué d’un M"
    >
      <defs>
        <radialGradient id="hl-wax-g" cx="38%" cy="30%" r="85%">
          <stop offset="0" stopColor="#b43c4d" />
          <stop offset=".45" stopColor="#7d2230" />
          <stop offset="1" stopColor="#3e0c15" />
        </radialGradient>
        <radialGradient id="hl-wax-in" cx="62%" cy="66%" r="80%">
          <stop offset="0" stopColor="#8d2836" />
          <stop offset="1" stopColor="#581320" />
        </radialGradient>
        <linearGradient id="hl-glint-g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffe3d2" stopOpacity="0" />
          <stop offset=".5" stopColor="#ffe3d2" stopOpacity=".55" />
          <stop offset="1" stopColor="#ffe3d2" stopOpacity="0" />
        </linearGradient>

        <filter id="hl-wax-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.4" />
        </filter>

        {/* Reflet de lumière sur la cire, qui suit le curseur */}
        <filter
          id="hl-wax-light"
          x="-10%"
          y="-10%"
          width="120%"
          height="120%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceAlpha" stdDeviation="2.2" result="blur" />
          <feSpecularLighting
            in="blur"
            surfaceScale="3"
            specularConstant=".9"
            specularExponent="18"
            lightingColor="#ffd2c0"
            result="spec"
          >
            <fePointLight ref={lightRef} x="28" y="12" z="55" />
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceAlpha" operator="in" result="spec2" />
          <feComposite
            in="SourceGraphic"
            in2="spec2"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3=".6"
            k4="0"
          />
        </filter>

        <clipPath id="hl-wax-clip">
          <path d={SEAL_PATH} />
        </clipPath>
      </defs>

      {/* Ombre portée sur le papier */}
      <path
        d={SEAL_PATH}
        transform="translate(3 6)"
        fill="rgba(0,0,0,.5)"
        filter="url(#hl-wax-shadow)"
      />

      <g filter="url(#hl-wax-light)">
        <path d={SEAL_PATH} fill="url(#hl-wax-g)" />

        {/* Rebord en relief */}
        <circle
          cx="60"
          cy="60"
          r="34"
          fill="none"
          stroke="rgba(35,4,10,.55)"
          strokeWidth="3"
          transform="translate(1 1)"
        />
        <circle
          cx="60"
          cy="60"
          r="34"
          fill="none"
          stroke="rgba(255,175,160,.38)"
          strokeWidth="2.4"
          transform="translate(-1 -1)"
        />

        {/* Cuvette centrale */}
        <circle cx="60" cy="60" r="31" fill="url(#hl-wax-in)" />

        {/* Initiale gravée dans la cire */}
        <g
          textAnchor="middle"
          fontSize="46"
          fontFamily="'IM Fell English','Cormorant Garamond',serif"
        >
          <text x="61" y="76" fill="rgba(255,170,150,.4)">
            M
          </text>
          <text x="59.2" y="74.2" fill="rgba(25,2,8,.6)">
            M
          </text>
          <text x="60" y="75" fill="#6a1927">
            M
          </text>
        </g>
      </g>

      {/* Reflet qui balaie le sceau */}
      <g clipPath="url(#hl-wax-clip)">
        <rect
          className="hl-seal-glint"
          x="-50"
          y="-10"
          width="46"
          height="140"
          fill="url(#hl-glint-g)"
        />
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Section d'accueil : la lettre d'admission
// ---------------------------------------------------------------------------
export default function HomeLetter() {
  const sectionRef = useRef<HTMLElement>(null);
  const tiltRef = useRef<HTMLElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<SVGFEPointLightElement>(null);

  // Légère inclinaison de la lettre + lumière du sceau qui suit le curseur
  useEffect(() => {
    const section = sectionRef.current;
    const tilt = tiltRef.current;
    const seal = sealRef.current;
    const light = lightRef.current;

    if (!section || !tilt || !seal || !light) return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let x = 0;
    let y = 0;

    const apply = () => {
      raf = 0;

      if (!reduce) {
        tilt.style.setProperty(
          "--hl-tx",
          ((x / window.innerWidth - 0.5) * 2).toFixed(3),
        );
        tilt.style.setProperty(
          "--hl-ty",
          ((y / window.innerHeight - 0.5) * 2).toFixed(3),
        );
      }

      const r = seal.getBoundingClientRect();
      if (r.width) {
        light.setAttribute(
          "x",
          clamp(((x - r.left) / r.width) * 120, -80, 200).toFixed(1),
        );
        light.setAttribute(
          "y",
          clamp(((y - r.top) / r.height) * 120, -80, 200).toFixed(1),
        );
      }
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      tilt.style.setProperty("--hl-tx", "0");
      tilt.style.setProperty("--hl-ty", "0");
      light.setAttribute("x", "28");
      light.setAttribute("y", "12");
    };

    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section
      id="accueil"
      className="hl"
      ref={sectionRef}
      aria-label="Lettre d’invitation au portfolio"
    >
      {/* Décor : pièce à la lueur des bougies */}
      <div className="hl-backdrop" aria-hidden="true">
        <div className="hl-glow hl-glow--a" />
        <div className="hl-glow hl-glow--b" />

        {MOTES.map((m, i) => (
          <span
            key={i}
            className="hl-mote"
            style={
              {
                "--x": `${m.x}%`,
                "--s": `${m.size}px`,
                "--d": `${m.delay}s`,
                "--t": `${m.duration}s`,
                "--dx": `${m.drift}px`,
              } as CSSProperties
            }
          />
        ))}
      </div>

      {/* Filtre qui irrégularise les bords du papier */}
      <svg className="hl-defs" width="0" height="0" aria-hidden="true" focusable="false">
        <defs>
          <filter
            id="hl-edge"
            x="-3%"
            y="-3%"
            width="106%"
            height="106%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.035"
              numOctaves="2"
              seed="4"
              result="t1"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="t1"
              scale="12"
              xChannelSelector="R"
              yChannelSelector="G"
              result="d1"
            />
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.3"
              numOctaves="2"
              seed="9"
              result="t2"
            />
            <feDisplacementMap
              in="d1"
              in2="t2"
              scale="4"
              xChannelSelector="G"
              yChannelSelector="B"
            />
          </filter>
        </defs>
      </svg>

      <div className="hl-stage">
        <article className="hl-tilt" ref={tiltRef} aria-labelledby="hl-title">
          <div className="hl-sheet">
            <div className="hl-paper" aria-hidden="true" />

            <div className="hl-content">
              {/* En-tête */}
              <header className="hl-header">
                <div className="hl-crest hl-ink" style={d(0.5)}>
                  <Crest />
                </div>

                <p className="hl-school hl-ink" style={d(0.7)}>
                  École de création &amp; d’imagination
                </p>

                <div className="hl-rule hl-ink" style={d(0.8)} aria-hidden="true">
                  <span />
                  <i>✦</i>
                  <span />
                </div>

                <p className="hl-address hl-ink" style={d(0.95)}>
                  À l’attention de
                  <span className="hl-hand hl-address-name">{profile.name}</span>
                </p>

                <h1 id="hl-title" className="hl-title hl-ink" style={d(1.15)}>
                  Une invitation à découvrir <em>mon univers…</em>
                </h1>
              </header>

              {/* Corps de la lettre */}
              <div className="hl-body">
                <p className="hl-salutation hl-ink" style={d(1.55)}>
                  Chère visiteuse, cher visiteur,
                </p>

                <p className="hl-p hl-ink" style={d(1.75)}>
                  Nous avons le plaisir de vous inviter à découvrir l’univers
                  créatif de <strong className="hl-name">{profile.name}</strong>,
                  étudiante en deuxième année de BUT Métiers du Multimédia et de
                  l’Internet à l’Université Clermont Auvergne, au Puy-en-Velay.
                </p>

                <p className="hl-p hl-ink" style={d(1.95)}>
                  Entre design graphique, communication visuelle, UI/UX design et
                  création numérique, elle aime imaginer et donner vie à des
                  projets qui racontent une histoire.
                </p>

                <p className="hl-p hl-ink" style={d(2.15)}>
                  Nous vous invitons à parcourir ses créations et à découvrir les
                  différentes facettes de son univers.
                </p>

                <div className="hl-links hl-ink" style={d(2.4)}>
                  <a className="hl-link" href="#projets">
                    <b aria-hidden="true">✦</b>
                    <span>Découvrir mes projets</span>
                    <em aria-hidden="true">→</em>
                  </a>

                  <span className="hl-link-sep" aria-hidden="true" />

                  <a className="hl-link" href="#contact">
                    <b aria-hidden="true">✦</b>
                    <span>Me contacter</span>
                    <em aria-hidden="true">→</em>
                  </a>
                </div>
              </div>

              {/* Signature + sceau */}
              <div className="hl-sign">
                <div className="hl-sign-text">
                  <p className="hl-closing hl-ink" style={d(2.65)}>
                    Au plaisir de vous accueillir,
                  </p>

                  <p className="hl-signature hl-hand hl-ink" style={d(2.85)}>
                    {profile.name}
                  </p>

                  <svg
                    className="hl-flourish"
                    viewBox="0 0 260 24"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      pathLength="1"
                      d="M4 16 C 38 2, 82 26, 132 11 S 214 18, 256 6"
                    />
                  </svg>
                </div>

                <div className="hl-seal hl-stamp" ref={sealRef}>
                  <WaxSeal lightRef={lightRef} />
                </div>
              </div>

              <p className="hl-ps hl-hand hl-ink" style={d(3.5)}>
                P.-S. Disponible pour un stage à partir d’avril 2027.
              </p>

              <div className="hl-footer hl-ink" style={d(3.7)}>
                <div className="hl-rule" aria-hidden="true">
                  <span />
                  <i>✦</i>
                  <span />
                </div>
                <p>PORTFOLIO — ÉDITION POUDLARD · 2026</p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
