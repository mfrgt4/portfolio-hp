import { useEffect, useLayoutEffect, useRef, type ReactNode, type Ref } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./PortfolioEntrance.css";

gsap.registerPlugin(ScrollTrigger);

function DoorPanel({
  side,
  doorRef,
}: {
  side: "left" | "right";
  doorRef: Ref<HTMLDivElement>;
}) {
  return (
    <div ref={doorRef} className={`ip-door ip-door--${side}`}>
      <div className="ip-door-wood" />
      <div className="ip-door-grain" />

      <div className="ip-door-structure">
        <div className="ip-door-rail ip-door-rail--top" />
        <div className="ip-door-rail ip-door-rail--middle" />
        <div className="ip-door-rail ip-door-rail--bottom" />

        <div className="ip-door-panel ip-door-panel--top">
          <div className="ip-panel-inset" />
          <div className="ip-panel-highlight" />
        </div>

        <div className="ip-door-panel ip-door-panel--middle">
          <div className="ip-panel-inset" />
          <div className="ip-panel-highlight" />
        </div>

        <div className="ip-door-panel ip-door-panel--bottom">
          <div className="ip-panel-inset" />
          <div className="ip-panel-highlight" />
        </div>

        <div className="ip-door-stile ip-door-stile--left" />
        <div className="ip-door-stile ip-door-stile--right" />
      </div>

      <div className="ip-door-metal ip-door-metal--top">
        <span />
        <i />
      </div>

      <div className="ip-door-metal ip-door-metal--bottom">
        <span />
        <i />
      </div>

      <div className="ip-door-handle">
        <span className="ip-handle-plate" />
        <span className="ip-handle-neck" />
        <span className="ip-handle-ring" />
      </div>

      <div className="ip-door-hinges">
        <i />
        <i />
        <i />
      </div>

      <div className="ip-door-side-shadow" />
    </div>
  );
}

type PortfolioEntranceProps = {
  children: ReactNode;
};

export default function PortfolioEntrance({
  children,
}: PortfolioEntranceProps) {
  const bleedRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLElement>(null);
  const leftDoorRef = useRef<HTMLDivElement>(null);
  const rightDoorRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  // Plein écran réel : quel que soit le parent (centré, décalé, max-width...)
  useLayoutEffect(() => {
    const el = bleedRef.current;
    if (!el) return;

    const fit = () => {
      el.style.marginLeft = "0px";
      el.style.width = "";
      if (window.innerWidth <= 900) return;
      const left = el.getBoundingClientRect().left;
      el.style.marginLeft = `${-left}px`;
      el.style.width = `${document.documentElement.clientWidth}px`;
    };

    fit();
    window.addEventListener("resize", fit);
    const ro = new ResizeObserver(() => {
      fit();
      ScrollTrigger.refresh();
    });
    if (el.parentElement) ro.observe(el.parentElement);

    return () => {
      window.removeEventListener("resize", fit);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const leftDoor = leftDoorRef.current;
    const rightDoor = rightDoorRef.current;
    const title = titleRef.current;
    const seam = root?.querySelector<HTMLElement>(".ip-center-seam");

    if (!root || !track || !leftDoor || !rightDoor || !title) return;

    const media = gsap.matchMedia();

    media.add("(min-width: 901px)", () => {
      gsap.set([leftDoor, rightDoor], {
        xPercent: 0,
        rotationY: 0,
        force3D: true,
      });

      gsap.set(title, {
        autoAlpha: 1,
        scale: 1,
      });

      const intro = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });

      intro.to(
        title,
        {
          autoAlpha: 0,
          scale: 0.92,
          y: -25,
          duration: 0.35,
          ease: "power2.out",
        },
        0,
      );

      // La barre centrale disparaît dès que les portes s'ouvrent
      if (seam) {
        intro.to(
          seam,
          { autoAlpha: 0, duration: 0.1, ease: "none" },
          0.15,
        );
      }

      // La porte gauche coulisse vers la gauche
      intro.to(
        leftDoor,
        {
          xPercent: -105,
          duration: 1,
          ease: "power2.inOut",
        },
        0.15,
      );

      // La porte droite coulisse vers la droite
      intro.to(
        rightDoor,
        {
          xPercent: 105,
          duration: 1,
          ease: "power2.inOut",
        },
        0.15,
      );

      const refreshId = window.requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });

      return () => window.cancelAnimationFrame(refreshId);
    });

    return () => media.revert();
  }, []);

  return (
    <div className="ip-bleed" ref={bleedRef}>
      <div className="ip-track" ref={trackRef}>
    <section className="ip" ref={rootRef} aria-label="Entrée du portfolio">
      <div className="ip-wall" />

      <div className="ip-content">{children}</div>

      <div className="ip-stage">
        <div className="ip-hall-light" />

        <DoorPanel side="left" doorRef={leftDoorRef} />
        <DoorPanel side="right" doorRef={rightDoorRef} />

        <div className="ip-center-seam" />
      </div>

      <div className="ip-title" ref={titleRef}>
        <div className="ip-title-eyebrow">
          <span />
          COURRIER DE POUDLARD
          <span />
        </div>

        <div className="ip-title-seal">
          <span className="ip-seal-letter">H</span>
        </div>

        <p className="ip-title-intro">Une surprise vous attend...</p>

        <h1>
          Votre lettre
          <br />
          <em>est arrivée…</em>
        </h1>

        <div className="ip-title-divider">
          <span />
          <i>✦</i>
          <span />
        </div>

        <p className="ip-scroll-hint">
          <span>Faites défiler pour ouvrir les portes</span>
          <i>↓</i>
        </p>
      </div>
    </section>
      </div>
    </div>
  );
}
