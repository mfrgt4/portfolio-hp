
import { useEffect, useRef, type ReactNode, type Ref } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./PortfolioEntrance.css";

gsap.registerPlugin(ScrollTrigger);

function DoorOrnaments({ side }: { side: "left" | "right" }) {
  return (
    <>
      <div className="ip-door-frame">
        <div className="ip-frame-inner" />
      </div>

      <div className="ip-wood-panel ip-wood-panel--top">
        <div className="ip-panel-border">
          <span className="ip-carving ip-carving--top">✦</span>
          <span className="ip-carving ip-carving--left">❧</span>
          <span className="ip-carving ip-carving--right">❧</span>
        </div>
      </div>

      <div className="ip-wood-panel ip-wood-panel--middle">
        <div className="ip-panel-border">
          <div className="ip-panel-medallion">
            <span className="ip-medallion-star">✦</span>
            <span className="ip-medallion-line" />
            <span className="ip-medallion-text">
              {side === "left" ? "M" : "F"}
            </span>
            <span className="ip-medallion-line" />
            <span className="ip-medallion-star">✦</span>
          </div>
        </div>
      </div>

      <div className="ip-wood-panel ip-wood-panel--bottom">
        <div className="ip-panel-border">
          <span className="ip-bottom-ornament">❧ ✧ ❧</span>
        </div>
      </div>

      <div className="ip-door-rivets ip-door-rivets--top">
        <i />
        <i />
      </div>

      <div className="ip-door-rivets ip-door-rivets--bottom">
        <i />
        <i />
      </div>

      <div className="ip-door-handle">
        <span className="ip-handle-backplate" />
        <span className="ip-handle-ring" />
        <span className="ip-handle-drop" />
      </div>

      <div className="ip-door-hinges">
        <i />
        <i />
        <i />
      </div>
    </>
  );
}

function DoorPanel({
  side,
  doorRef,
}: {
  side: "left" | "right";
  doorRef: Ref<HTMLDivElement>;
}) {
  return (
    <div ref={doorRef} className={`ip-door ip-door--${side}`}>
      <div className="ip-door-planks" />
      <DoorOrnaments side={side} />
      <div className="ip-door-edge" />
    </div>
  );
}

type PortfolioEntranceProps = {
  children: ReactNode;
};

export default function PortfolioEntrance({
  children,
}: PortfolioEntranceProps) {
  const rootRef = useRef<HTMLElement>(null);
  const leftDoorRef = useRef<HTMLDivElement>(null);
  const rightDoorRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const leftDoor = leftDoorRef.current;
    const rightDoor = rightDoorRef.current;
    const title = titleRef.current;

    if (!root || !leftDoor || !rightDoor || !title) return;

    const media = gsap.matchMedia();

    media.add("(min-width: 901px)", () => {
      gsap.set([leftDoor, rightDoor], {
        x: 0,
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
          trigger: root,
          start: "top top",
          end: "+=1200",
          scrub: 0.4,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Le titre disparaît progressivement
      intro.to(
        title,
        {
          autoAlpha: 0,
          scale: 0.96,
          duration: 0.5,
          ease: "power1.out",
        },
        0,
      );

      // La porte gauche s'ouvre vers la gauche
      intro.to(
        leftDoor,
        {
          xPercent: -100,
          duration: 1,
          ease: "power2.inOut",
        },
        0.15,
      );

      // La porte droite s'ouvre vers la droite
      intro.to(
        rightDoor,
        {
          xPercent: 100,
          duration: 1,
          ease: "power2.inOut",
        },
        0.15,
      );

      const refreshId = window.requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });

      return () => {
        window.cancelAnimationFrame(refreshId);
      };
    });

    return () => {
      media.revert();
    };
  }, []);

  return (
    <section
      className="ip"
      ref={rootRef}
      aria-label="Introduction du portfolio"
    >
      <div className="ip-wall" />

      <div className="ip-content">{children}</div>

      <div className="ip-stage">
        <DoorPanel side="left" doorRef={leftDoorRef} />
        <DoorPanel side="right" doorRef={rightDoorRef} />
      </div>

      <div className="ip-title" ref={titleRef}>
        <div className="ip-title-eyebrow">
          <span />
          COURRIER DE POUDLARD
          <span />
        </div>

        <div className="ip-title-seal">
          <span>✦</span>
          <span className="ip-seal-letter">H</span>
          <span>✦</span>
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
  );
}
