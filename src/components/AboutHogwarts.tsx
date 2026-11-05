import type { CSSProperties } from "react";
import { profile } from "../data";
import "./AboutHogwarts.css";

// Bougies flottantes de la Grande Salle (valeurs fixes : pas de hasard au rendu)
const CANDLES = [
  { x: 4, y: 5, s: 1.0, d: 0, b: 7.5 },
  { x: 17, y: 2, s: 0.8, d: -2.1, b: 8.8 },
  { x: 31, y: 7, s: 1.1, d: -4.0, b: 7.0 },
  { x: 46, y: 1, s: 0.75, d: -1.2, b: 9.4 },
  { x: 60, y: 6, s: 1.0, d: -5.3, b: 8.0 },
  { x: 74, y: 2, s: 0.85, d: -3.1, b: 7.8 },
  { x: 87, y: 8, s: 1.15, d: -6.2, b: 9.0 },
  { x: 95, y: 3, s: 0.8, d: -0.7, b: 8.3 },
];

const delay = (seconds: number) =>
  ({ "--d": `${seconds}s` }) as CSSProperties;

const ink = (seconds: number) =>
  ({ "--ab-d": `${seconds}s` }) as CSSProperties;

function Corner({ className }: { className: string }) {
  return (
    <svg
      className={`ab-corner ${className}`}
      viewBox="0 0 40 40"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M3 37 V15 C3 8 8 3 15 3 H37 M9 37 V17 C9 13 13 9 17 9 H37"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="15" cy="15" r="2.6" fill="currentColor" />
    </svg>
  );
}

export default function AboutHogwarts() {
  const firstName = profile.name.split(" ")[0];
  const initials = profile.name
    .split(" ")
    .map((w) => w[0])
    .join("");

  return (
    <section id="a-propos" className="ab" aria-labelledby="ab-title">
      {/* Filtre qui irrégularise les bords du parchemin */}
      <svg className="ab-defs" width="0" height="0" aria-hidden="true" focusable="false">
        <defs>
          <filter
            id="ab-edge"
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
              seed="11"
              result="t1"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="t1"
              scale="11"
              xChannelSelector="R"
              yChannelSelector="G"
              result="d1"
            />
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.3"
              numOctaves="2"
              seed="5"
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

          <linearGradient id="ab-feather" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#cdb98f" />
            <stop offset=".6" stopColor="#efe3c6" />
            <stop offset="1" stopColor="#fbf4e3" />
          </linearGradient>
          <linearGradient id="ab-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f0d796" />
            <stop offset=".5" stopColor="#a47f43" />
            <stop offset="1" stopColor="#d0ad70" />
          </linearGradient>
        </defs>
      </svg>

      {/* Décor : bougies flottantes */}
      <div className="ab-backdrop" aria-hidden="true">
        {CANDLES.map((c, i) => (
          <span
            key={i}
            className="ab-candle"
            style={
              {
                "--x": `${c.x}%`,
                "--y": `${c.y}%`,
                "--s": c.s,
                "--cd": `${c.d}s`,
                "--b": `${c.b}s`,
              } as CSSProperties
            }
          >
            <i className="ab-flame" />
          </span>
        ))}
      </div>

      <div className="ab-inner">
        {/* ---------- Le parchemin ---------- */}
        <div className="ab-col ab-col--text rv rv-l" style={delay(0.15)}>
          <div className="ab-sheet">
            <div className="ab-paper" aria-hidden="true" />
            <span className="ab-ribbon" aria-hidden="true" />

            <div className="ab-content">
              <p className="ab-kicker ab-ink" style={ink(0.1)}>
                <span />
                Registre des élèves · Qui suis-je ?
                <span />
              </p>

              <h2 id="ab-title" className="ab-title ab-ink" style={ink(0.25)}>
                Un peu plus sur moi.
              </h2>

              <p className="ab-p ab-p--first ab-ink" style={ink(0.5)}>
                Hello ! Moi, c’est {firstName}, étudiante en BUT MMI, parcours
                Création Numérique. Je m’intéresse particulièrement au design
                graphique, à l’UI/UX design et à l’audiovisuel. J’aime explorer
                les univers visuels, imaginer des interfaces et donner vie à
                mes idées à travers des projets créatifs.
              </p>

              <p className="ab-p ab-ink" style={ink(0.7)}>
                En dehors des cours, je réalise des projets personnels en
                design graphique et montage vidéo pour explorer ma créativité
                et continuer à apprendre.
              </p>

              <p className="ab-p ab-ink" style={ink(0.9)}>
                Je cherche un stage à partir d’avril 2027 pour progresser au
                sein d’une équipe, et y apporter ma curiosité et mon sens du
                détail.
              </p>

              <div className="ab-facts ab-ink" style={ink(1.15)}>
                <p className="ab-facts-title">
                  <span />
                  Fiche de l’élève
                  <span />
                </p>

                <dl>
                  <div>
                    <dt>Lieu</dt>
                    <dd>Lyon</dd>
                  </div>
                  <div>
                    <dt>Cursus</dt>
                    <dd>BUT MMI · 2e année</dd>
                  </div>
                  <div>
                    <dt>Stage</dt>
                    <dd>Avril 2027</dd>
                  </div>
                </dl>
              </div>

              {/* Plume posée sur le parchemin */}
              <svg
                className="ab-quill"
                viewBox="0 0 220 70"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M18 62 C 52 46, 110 20, 214 3 C 205 20, 186 36, 160 44 C 128 54, 78 60, 18 62 Z"
                  fill="url(#ab-feather)"
                  stroke="rgba(90,60,25,.55)"
                  strokeWidth=".9"
                />
                <g stroke="rgba(110,80,40,.38)" strokeWidth=".8" fill="none">
                  <path d="M60 52 l6 -12" />
                  <path d="M85 45 l8 -14" />
                  <path d="M110 37 l9 -14" />
                  <path d="M135 29 l10 -13" />
                  <path d="M160 21 l10 -12" />
                  <path d="M185 13 l10 -9" />
                  <path d="M70 56 l12 -6" />
                  <path d="M100 52 l16 -8" />
                  <path d="M130 47 l18 -9" />
                </g>
                <path
                  d="M12 64 C 70 48, 130 22, 214 3"
                  fill="none"
                  stroke="#7a5a2c"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
                <path d="M14 63 l-12 5 7 -9 z" fill="#2b1a10" />
              </svg>
            </div>
          </div>
        </div>

        {/* ---------- Le portrait enchanté ---------- */}
        <div className="ab-col ab-col--portrait rv rv-r" style={delay(0.3)}>
          <div className="ab-hang">
            <svg
              className="ab-cord"
              viewBox="0 0 100 40"
              preserveAspectRatio="none"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M8 40 L50 4 L92 40"
                fill="none"
                stroke="#7a5a2c"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <span className="ab-nail" aria-hidden="true" />

            <div className="ab-tilt" data-tilt="6" data-persp="none">
              <div className="ab-frame">
                <div className="ab-canvas">
                  {profile.photo ? (
                    <img
                      src={profile.photo}
                      alt={`Portrait de ${profile.name}`}
                    />
                  ) : (
                    <div className="ab-ph">
                      <span>{initials}</span>
                      <small>portrait à venir</small>
                    </div>
                  )}
                  <span className="ab-glass" aria-hidden="true" />
                </div>

                <Corner className="ab-corner--tl" />
                <Corner className="ab-corner--tr" />
                <Corner className="ab-corner--bl" />
                <Corner className="ab-corner--br" />
              </div>

              <span className="ab-tag" aria-hidden="true">
                hello !
              </span>

              <div className="ab-plaque">
                <strong>{profile.name}</strong>
                <span>BUT MMI · Création Numérique</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
