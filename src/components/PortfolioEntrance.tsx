import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type Ref,
} from "react";
import gsap from "gsap";
import "./PortfolioEntrance.css";

const DESKTOP = "(min-width: 901px)";

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

      <div className="ip-door-shade" />
      <div className="ip-door-side-shadow" />
    </div>
  );
}

type PortfolioEntranceProps = {
  children: ReactNode;
};

type Phase = "closed" | "opening" | "open";

export default function PortfolioEntrance({
  children,
}: PortfolioEntranceProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const leftDoorRef = useRef<HTMLDivElement>(null);
  const rightDoorRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const musicRef = useRef<HTMLIFrameElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const openingRef = useRef(false);

  // Sous 900px : pas d'intro, le portfolio est directement visible
  const [phase, setPhase] = useState<Phase>(() =>
    typeof window !== "undefined" && window.matchMedia(DESKTOP).matches
      ? "closed"
      : "open",
  );
  const [musicPlaying, setMusicPlaying] = useState(false);

  const doorsOpen = phase === "open";

  // ---------- Musique ----------

  const controlMusic = (command: "playVideo" | "pauseVideo") => {
    musicRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: command, args: [] }),
      "*",
    );
  };

  const toggleMusic = () => {
    if (musicPlaying) {
      controlMusic("pauseVideo");
      setMusicPlaying(false);
    } else {
      controlMusic("playVideo");
      setMusicPlaying(true);
    }
  };

  // ---------- Ouverture au clic ----------

  const openDoors = () => {
    const overlay = overlayRef.current;
    const stage = stageRef.current;
    const glow = glowRef.current;
    const leftDoor = leftDoorRef.current;
    const rightDoor = rightDoorRef.current;
    const title = titleRef.current;
    const page = pageRef.current;

    if (openingRef.current) return;
    if (!overlay || !stage || !glow || !leftDoor || !rightDoor || !title) {
      return;
    }

    openingRef.current = true;
    setPhase("opening");

    // Le clic est un geste utilisateur : le navigateur autorise la musique.
    // Second appel au cas où le lecteur n'était pas encore prêt.
    controlMusic("playVideo");
    window.setTimeout(() => controlMusic("playVideo"), 1200);
    setMusicPlaying(true);

    const tl = gsap.timeline({
      onComplete: () => setPhase("open"),
    });
    timelineRef.current = tl;

    // Accessibilité : simple fondu si l'animation est réduite
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      tl.to(overlay, { autoAlpha: 0, duration: 0.5, ease: "none" });
      return;
    }

    const seam = overlay.querySelector<HTMLElement>(".ip-center-seam");
    const rings = overlay.querySelectorAll<HTMLElement>(".ip-handle-ring");
    const shades = overlay.querySelectorAll<HTMLElement>(".ip-door-shade");

    // 1. Le texte s'efface, on pousse : les anneaux se balancent
    tl.to(
      title,
      {
        autoAlpha: 0,
        scale: 0.94,
        y: -20,
        duration: 0.7,
        ease: "power2.in",
      },
      0,
    );

    tl.to(
      rings,
      {
        rotation: 10,
        transformOrigin: "50% 0%",
        duration: 0.14,
        yoyo: true,
        repeat: 5,
        ease: "sine.inOut",
      },
      0,
    );

    // 2. Les battants cèdent légèrement : un filet de lumière apparaît
    tl.to(leftDoor, { rotationY: 1.6, duration: 0.5, ease: "power2.out" }, 0.15);
    tl.to(
      rightDoor,
      { rotationY: -1.6, duration: 0.5, ease: "power2.out" },
      0.15,
    );
    tl.to(
      glow,
      { autoAlpha: 0.55, scaleX: 0.3, duration: 0.5, ease: "power2.out" },
      0.15,
    );
    if (seam) {
      tl.to(seam, { autoAlpha: 0, duration: 0.35, ease: "none" }, 0.55);
    }

    // 3. Courte résistance, puis les portes lourdes s'ouvrent en 3D
    tl.to(
      leftDoor,
      { rotationY: 98, duration: 3.4, ease: "power3.inOut" },
      1.0,
    );
    tl.to(
      rightDoor,
      { rotationY: -98, duration: 3.4, ease: "power3.inOut" },
      1.0,
    );

    // Les faces des battants s'assombrissent en s'éloignant de la lumière
    tl.to(shades, { opacity: 0.75, duration: 3.2, ease: "power2.in" }, 1.2);

    // La lumière inonde la scène
    tl.to(
      glow,
      { autoAlpha: 1, scaleX: 1.6, duration: 1.6, ease: "power2.out" },
      1.2,
    );

    // Travelling avant : la caméra avance dans l'entrée
    tl.to(stage, { scale: 1.12, duration: 3.8, ease: "power2.inOut" }, 1.0);

    // Le portfolio prend sa place derrière
    if (page) {
      tl.to(page, { scale: 1, duration: 3.6, ease: "power2.out" }, 1.2);
    }

    // 4. La lumière retombe, le calque disparaît
    tl.to(glow, { autoAlpha: 0, duration: 1.2, ease: "power2.inOut" }, 3.3);
    tl.to(overlay, { autoAlpha: 0, duration: 0.6, ease: "none" }, 4.2);
  };

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openDoors();
    }
  };

  // ---------- État initial du portfolio (léger zoom, avant l'ouverture) ----------

  useLayoutEffect(() => {
    if (phase === "closed" && pageRef.current) {
      gsap.set(pageRef.current, { scale: 1.06, transformOrigin: "50% 45%" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Une fois ouvert : on retire toute transformation sur le portfolio
  useEffect(() => {
    if (phase === "open" && pageRef.current) {
      gsap.set(pageRef.current, { clearProps: "transform,transformOrigin" });
    }
  }, [phase]);

  // Si la fenêtre devient trop petite, on saute l'intro
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP);
    const onChange = () => {
      if (!mq.matches) setPhase("open");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // ---------- Pas de scroll tant que les portes sont fermées ----------

  useEffect(() => {
    if (phase === "open") return;

    const stop = (e: Event) => e.preventDefault();
    const scrollKeys = new Set([
      " ",
      "PageDown",
      "PageUp",
      "ArrowDown",
      "ArrowUp",
      "Home",
      "End",
    ]);
    const onKey = (e: KeyboardEvent) => {
      if (scrollKeys.has(e.key)) e.preventDefault();
    };
    const keepTop = () => {
      if (window.scrollY !== 0) window.scrollTo(0, 0);
    };

    window.scrollTo(0, 0);
    window.addEventListener("wheel", stop, { passive: false });
    window.addEventListener("touchmove", stop, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", keepTop);

    return () => {
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchmove", stop);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", keepTop);
    };
  }, [phase]);

  useEffect(() => {
    return () => {
      timelineRef.current?.kill();
    };
  }, []);

  return (
    <>
      {/* Lecteur YouTube invisible */}
      <iframe
        ref={musicRef}
        className="ip-music-player"
        src="https://www.youtube.com/embed/UuPb1J_RCJM?autoplay=0&controls=0&loop=1&playlist=UuPb1J_RCJM&enablejsapi=1&playsinline=1"
        title="Musique du portfolio"
        allow="autoplay; encrypted-media"
        referrerPolicy="strict-origin-when-cross-origin"
      />

      {/* Le portfolio, visible dès que les portes s'écartent */}
      <div className="ip-page" ref={pageRef}>
        {children}
      </div>

      {/* Les portes : un clic pour ouvrir */}
      {phase !== "open" && (
        <div
          ref={overlayRef}
          className={`ip${phase === "opening" ? " is-opening" : ""}`}
          role="button"
          tabIndex={0}
          aria-label="Ouvrir les portes pour découvrir le portfolio"
          onClick={openDoors}
          onKeyDown={onKeyDown}
        >
          <div className="ip-stage" ref={stageRef}>
            <div className="ip-hall-light" ref={glowRef} />

            <DoorPanel side="left" doorRef={leftDoorRef} />
            <DoorPanel side="right" doorRef={rightDoorRef} />

            <div className="ip-center-seam" />
          </div>

          <div className="ip-title" ref={titleRef}>
            <h1>
              Une surprise
              <br />
              <em>vous attend…</em>
            </h1>

            <div className="ip-title-divider">
              <span />
              <i>✦</i>
              <span />
            </div>

            <p className="ip-scroll-hint">
              <span>Appuyez sur la porte pour l'ouvrir</span>
              <i>↓</i>
            </p>
          </div>
        </div>
      )}

      {/* Bouton musique après ouverture */}
      {doorsOpen && (
        <button
          type="button"
          className="ip-music-toggle"
          onClick={toggleMusic}
          aria-label={musicPlaying ? "Couper la musique" : "Activer la musique"}
          title={musicPlaying ? "Couper la musique" : "Activer la musique"}
        >
          <span className="ip-music-icon">{musicPlaying ? "♫" : "♪"}</span>
          <span className="ip-music-label">
            {musicPlaying ? "Musique activée" : "Musique désactivée"}
          </span>
        </button>
      )}
    </>
  );
}
