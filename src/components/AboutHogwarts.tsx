import type { CSSProperties } from "react";
import { profile } from "../data";
import "./AboutHogwarts.css";

const delay = (seconds: number) =>
  ({ "--d": `${seconds}s` }) as CSSProperties;

function HogwartsStar() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <path
        d="M20 2 L24 16 L38 20 L24 24 L20 38 L16 24 L2 20 L16 16 Z"
        fill="currentColor"
      />
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
      <div className="ab-inner">
        <div className="ab-heading rv rv-l" style={delay(0.1)}>
          <p className="ab-kicker">
            <span />
            Archives de Poudlard
            <span />
          </p>

          <h2 id="ab-title">Un peu plus sur moi.</h2>

          <p className="ab-intro">
            Derrière chaque projet, une personnalité, des idées et une
            bonne dose de créativité.
          </p>
        </div>

        <article className="ab-card rv rv-r" style={delay(0.25)}>
          <div className="ab-card-top">
            <div className="ab-school-mark">
              <HogwartsStar />
              <span>HOGWARTS</span>
              <small>SCHOOL OF WITCHCRAFT</small>
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
              </div>

              <span className="ab-photo-caption">
                OFFICIAL PORTRAIT
              </span>

              <div className="ab-student-seal">
                <HogwartsStar />
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

          <span className="ab-card-corner ab-card-corner--tl" />
          <span className="ab-card-corner ab-card-corner--tr" />
          <span className="ab-card-corner ab-card-corner--bl" />
          <span className="ab-card-corner ab-card-corner--br" />
        </article>

        <div className="ab-footer rv" style={delay(0.4)}>
          <span>MINISTÈRE DE LA MAGIE</span>
          <span>FICHE PERSONNELLE · CONFIDENTIEL</span>
        </div>
      </div>
    </section>
  );
}
