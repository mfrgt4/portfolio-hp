import { useEffect, useRef, type CSSProperties, type Ref } from "react";
import { profile } from "../data";
import "./AboutHogwarts.css";

const delay = (seconds: number) =>
  ({ "--d": `${seconds}s` }) as CSSProperties;

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

const STAR_PATH =
  "M20 2 L24 16 L38 20 L24 24 L20 38 L16 24 L2 20 L16 16 Z";

function HogwartsStar() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <path d={STAR_PATH} fill="currentColor" />
    </svg>
  );
}

// Contour irrégulier du sceau de cire
function waxOutline(cx: number, cy: number, r: number) {
  const N = 90;
  let d = "";
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const k =
      1 +
      0.04 * Math.sin(5 * a + 0.7) +
      0.028 * Math.sin(9 * a + 1.9) +
      0.016 * Math.sin(15 * a + 0.3);
    d += `${i ? "L" : "M"}${(cx + Math.cos(a) * r * k).toFixed(2)} ${(
      cy +
      Math.sin(a) * r * k
    ).toFixed(2)} `;
  }
  return d + "Z";
}

const SEAL_PATH = waxOutline(60, 60, 44);

// ---------------------------------------------------------------------------
// Sceau de cire marqué d'une étoile (la lumière suit le curseur)
// ---------------------------------------------------------------------------
function WaxSeal({ lightRef }: { lightRef: Ref<SVGFEPointLightElement> }) {
  return (
    <svg viewBox="0 0 120 120" role="img" aria-label="Sceau de cire">
      <defs>
        <radialGradient id="ab-wax-g" cx="38%" cy="30%" r="85%">
          <stop offset="0" stopColor="#b43c4d" />
          <stop offset=".45" stopColor="#7d2230" />
          <stop offset="1" stopColor="#3e0c15" />
        </radialGradient>
        <radialGradient id="ab-wax-in" cx="62%" cy="66%" r="80%">
          <stop offset="0" stopColor="#8d2836" />
          <stop offset="1" stopColor="#581320" />
        </radialGradient>
        <linearGradient id="ab-glint-g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffe3d2" stopOpacity="0" />
          <stop offset=".5" stopColor="#ffe3d2" stopOpacity=".55" />
          <stop offset="1" stopColor="#ffe3d2" stopOpacity="0" />
        </linearGradient>

        <filter id="ab-wax-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.4" />
        </filter>

        <filter
          id="ab-wax-light"
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

        <clipPath id="ab-wax-clip">
          <path d={SEAL_PATH} />
        </clipPath>
      </defs>

      <path
        d={SEAL_PATH}
        transform="translate(3 6)"
        fill="rgba(0,0,0,.55)"
        filter="url(#ab-wax-shadow)"
      />

      <g filter="url(#ab-wax-light)">
        <path d={SEAL_PATH} fill="url(#ab-wax-g)" />

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
        <circle cx="60" cy="60" r="31" fill="url(#ab-wax-in)" />

        {/* Étoile gravée dans la cire */}
        <g transform="translate(36 36) scale(1.2)">
          <path
            d={STAR_PATH}
            transform="translate(.8 .8)"
            fill="rgba(255,170,150,.4)"
          />
          <path
            d={STAR_PATH}
            transform="translate(-.7 -.7)"
            fill="rgba(25,2,8,.6)"
          />
          <path d={STAR_PATH} fill="#6a1927" />
        </g>
      </g>

      <g clipPath="url(#ab-wax-clip)">
        <rect
          className="ab-seal-glint"
          x="-50"
          y="-10"
          width="46"
          height="140"
          fill="url(#ab-glint-g)"
        />
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Grand sceau de l'école, gravé en filigrane dans le cuir
// ---------------------------------------------------------------------------
function Watermark() {
  return (
    <svg
      className="ab-watermark"
      viewBox="0 0 300 300"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <path
          id="ab-ring"
          d="M150 150 m-113 0 a113 113 0 1 1 226 0 a113 113 0 1 1 -226 0"
        />
      </defs>

      <g fill="none" stroke="currentColor">
        <circle cx="150" cy="150" r="146" strokeWidth="2" />
        <circle cx="150" cy="150" r="140" strokeWidth=".8" />
        <circle cx="150" cy="150" r="90" strokeWidth="1.2" />
        <circle cx="150" cy="150" r="85" strokeWidth=".6" />
      </g>

      <text
        fill="currentColor"
        fontSize="15"
        fontWeight="600"
        fontFamily="'Cormorant Garamond', Georgia, serif"
      >
        <textPath
          href="#ab-ring"
          textLength="700"
          lengthAdjust="spacing"
        >
          ÉCOLE DE CRÉATION &amp; D’IMAGINATION · POUDLARD · ÉDITION 2026 ·
        </textPath>
      </text>

      <g transform="translate(95 95) scale(2.75)" fill="currentColor">
        <path d={STAR_PATH} />
      </g>
    </svg>
  );
}

export default function AboutHogwarts() {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<SVGFEPointLightElement>(null);

  const firstName = profile.name.split(" ")[0];
  const initials = profile.name
    .split(" ")
    .map((w) => w[0])
    .join("");

  // Inclinaison 3D, dorure et reflets qui suivent le curseur
  useEffect(() => {
    const stage = stageRef.current;
    const card = cardRef.current;
    const seal = sealRef.current;
    const light = lightRef.current;

    if (!stage || !card) return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let x = 0;
    let y = 0;

    const apply = () => {
      raf = 0;

      const r = card.getBoundingClientRect();
      const px = clamp((x - r.left) / r.width, 0, 1);
      const py = clamp((y - r.top) / r.height, 0, 1);

      if (!reduce) {
        stage.style.setProperty("--tx", ((px - 0.5) * 2).toFixed(3));
        stage.style.setProperty("--ty", ((py - 0.5) * 2).toFixed(3));
      }
      stage.style.setProperty("--mx", (px * 100).toFixed(1));
      stage.style.setProperty("--my", (py * 100).toFixed(1));
      stage.style.setProperty("--fx", (px * 100).toFixed(1));

      if (seal && light) {
        const s = seal.getBoundingClientRect();
        if (s.width) {
          light.setAttribute(
            "x",
            clamp(((x - s.left) / s.width) * 120, -80, 200).toFixed(1),
          );
          light.setAttribute(
            "y",
            clamp(((y - s.top) / s.height) * 120, -80, 200).toFixed(1),
          );
        }
      }
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      stage.dataset.hover = "true";
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      stage.dataset.hover = "false";
      stage.style.setProperty("--tx", "0");
      stage.style.setProperty("--ty", "0");
      stage.style.setProperty("--fx", "42");
      light?.setAttribute("x", "28");
      light?.setAttribute("y", "12");
    };

    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section id="a-propos" className="ab" aria-labelledby="ab-title">
      <div className="ab-inner">
        <div className="ab-heading rv rv-l" style={delay(0.1)}>
          <p className="ab-kicker">
            <span />
            Carte d'étudiant
            <span />
          </p>

          <h2 id="ab-title">Un peu plus sur moi.</h2>
        </div>

        <div className="ab-stage rv rv-r" style={delay(0.25)} ref={stageRef}>
          <article className="ab-card" ref={cardRef}>
            {/* Matière : cuir grainé, sceau en filigrane */}
            <span className="ab-card-grain" aria-hidden="true" />
            <Watermark />

            <div className="ab-card-top">
              <div className="ab-school-mark">
                <span className="ab-holo" aria-hidden="true">
                  <HogwartsStar />
                </span>
                <span className="ab-school-name">
                  École de création
                  <br />
                  &amp; d’imagination
                </span>
              </div>

              <div className="ab-card-number">
                <span>STUDENT FILE</span>
                <strong>№ 001</strong>
              </div>
            </div>

            <div className="ab-card-main">
              <div className="ab-photo-column">
                <div className="ab-photo-frame">
                  {profile.photo ? (
                    <img
                      src={profile.photo}
                      alt={`Portrait de ${profile.name}`}
                    />
                  ) : (
                    <div className="ab-photo-placeholder">
                      <span>{initials}</span>
                    </div>
                  )}
                  <span className="ab-photo-glass" aria-hidden="true" />
                </div>

                <span className="ab-photo-caption">OFFICIAL PORTRAIT</span>

                <div className="ab-student-seal" ref={sealRef}>
                  <WaxSeal lightRef={lightRef} />
                </div>
              </div>

              <div className="ab-information">
                <span className="ab-label">IDENTITÉ DE L'ÉLÈVE</span>

                <h3>{profile.name}</h3>

                <div className="ab-divider">
                  <span />
                  <HogwartsStar />
                  <span />
                </div>

                <p>
                  Hello ! Moi, c’est {firstName}, étudiante en BUT MMI,
                  parcours Création Numérique. Je m’intéresse
                  particulièrement au design graphique, à l’UI/UX design
                  et à l’audiovisuel. J’aime explorer les univers visuels,
                  imaginer des interfaces et donner vie à mes idées à
                  travers des projets créatifs.
                </p>

                <p>
                  En dehors des cours, je réalise des projets personnels
                  en design graphique et montage vidéo pour explorer ma
                  créativité et continuer à apprendre.
                </p>

                <p>
                  Je cherche un stage à partir d’avril 2027 pour progresser
                  au sein d’une équipe, et y apporter ma curiosité et mon
                  sens du détail.
                </p>

                <div className="ab-signature">
                  <span className="ab-signature-label">
                    SIGNATURE DE L’ÉLÈVE
                  </span>
                  <em className="ab-signature-name">{profile.name}</em>
                  <svg
                    className="ab-signature-line"
                    viewBox="0 0 260 20"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      pathLength="1"
                      d="M4 13 C 48 2, 96 21, 146 9 S 226 15, 256 5"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="ab-card-bottom">
              <div className="ab-detail">
                <span>LOCALISATION</span>
                <strong>Lyon</strong>
              </div>

              <div className="ab-detail">
                <span>FORMATION</span>
                <strong>BUT MMI · 2e année</strong>
              </div>

              <div className="ab-detail">
                <span>DISPONIBILITÉ</span>
                <strong>Stage · Avril 2027</strong>
              </div>
            </div>

            {/* Reflets : lumière qui suit le curseur + balayage lent */}
            <span className="ab-card-gloss" aria-hidden="true" />
            <span className="ab-card-sweep" aria-hidden="true" />

            <span className="ab-card-corner ab-card-corner--tl" />
            <span className="ab-card-corner ab-card-corner--tr" />
            <span className="ab-card-corner ab-card-corner--bl" />
            <span className="ab-card-corner ab-card-corner--br" />
          </article>
        </div>

        <div className="ab-footer rv" style={delay(0.4)}>
          <span>MINISTÈRE DE LA MAGIE</span>
          <span>FICHE PERSONNELLE · CONFIDENTIEL</span>
        </div>
      </div>
    </section>
  );
}
