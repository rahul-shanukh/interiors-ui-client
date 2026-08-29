import { useEffect, useState, useMemo, type CSSProperties } from "react";
import { Users, FileText, Factory, Truck, Handshake } from "lucide-react";

const steps = [
  {
    title: "Talk to Our Designer",
    desc: "Discuss your space and receive estimate",
    icon: Users,
  },
  {
    title: "Detailed Drawings",
    desc: "Layouts, measurements & approval",
    icon: FileText,
  },
  { title: "Production", desc: "Manufactured in our factories", icon: Factory },
  {
    title: "Material Delivery",
    desc: "Logistics & installation begins",
    icon: Truck,
  },
  {
    title: "Project Handover",
    desc: "On-time completion guaranteed",
    icon: Handshake,
  },
];

const seededRand = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

interface BirdStyle extends CSSProperties {
  "--tint": string;
  "--dur": string;
  "--delay": string;
  "--tiltX": string;
  "--tiltY": string;
  "--spin": string;
  "--driftX": string;
  "--driftY": string;
  "--op-min": number;
  "--op-max": number;
  "--blur": string;
}

const generateParticles = () => {
  const rand = seededRand(42);

  return Array.from({ length: 22 }, (_, i) => {
    const isJC = rand() > 0.35;
    const label = isJC ? "JC" : rand() > 0.5 ? "J" : "C";

    const size = 14 + Math.floor(rand() * 72);
    const x = rand() * 100;
    const y = rand() * 100;

    const dur = 14 + rand() * 26;
    const delay = -(rand() * 30);

    const tiltX = (rand() - 0.5) * 40;
    const tiltY = (rand() - 0.5) * 50;

    const driftX = (rand() - 0.5) * 120;
    const driftY = -40 - rand() * 100;

    /* 🔧 VISIBILITY FIX */
    const opMin = 0.12 + rand() * 0.08;
    const opMax = opMin + 0.15 + rand() * 0.18;

    const tint =
      rand() > 0.55
        ? `rgba(197,160,89,${opMax})`
        : `rgba(19,80,59,${opMax + 0.06})`;

    return {
      id: i,
      label,
      size,
      x,
      y,
      dur,
      delay,
      tiltX,
      tiltY,
      driftX,
      driftY,
      opMin,
      opMax,
      tint,
    };
  });
};

export const ProjectJourneySection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const particles = useMemo(() => generateParticles(), []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev === steps.length - 1 ? 0 : prev + 1));
    }, 2800);

    return () => clearInterval(timer);
  }, []);

  const pct = (activeStep / (steps.length - 1)) * 100;

  return (
    <>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,900&display=swap');

@keyframes birdFloat {
  0% {
    transform: translate(0px,0px) rotateY(var(--tiltY)) rotateX(var(--tiltX)) rotate(var(--spin));
    opacity: var(--op-min);
  }
  20% { opacity: var(--op-max); }
  80% { opacity: var(--op-max); }
  100% {
    transform: translate(var(--driftX), var(--driftY))
               rotateY(calc(var(--tiltY) * -1))
               rotateX(calc(var(--tiltX) * -1))
               rotate(calc(var(--spin) + 8deg));
    opacity: var(--op-min);
  }
}

@keyframes pulseRing {
  0% { transform: scale(1); opacity: 0.7; }
  100% { transform: scale(1.65); opacity: 0; }
}

@keyframes fadeUp {
  from { opacity:0; transform:translateY(36px); }
  to { opacity:1; transform:translateY(0); }
}

@keyframes shimmerText {
  0% { background-position:-200% center; }
  100% { background-position:200% center; }
}

.bird-letter{
  position:absolute;
  font-family:'Playfair Display', Georgia, serif;
  font-weight:900;
  font-style:italic;
  letter-spacing:-0.04em;
  user-select:none;
  pointer-events:none;
  transform-style:preserve-3d;
  will-change:transform, opacity;

  background:linear-gradient(
    125deg,
    rgba(255,235,160,0.55) 0%,
    var(--tint) 40%,
    rgba(19,80,59,0.6) 70%,
    rgba(197,160,89,0.45) 100%
  );

  background-size:200% auto;
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
  background-clip:text;

  animation:
    birdFloat var(--dur) ease-in-out var(--delay) infinite alternate,
    shimmerText calc(var(--dur) * 0.6) linear var(--delay) infinite;

  /* 🔧 STRONGER GLOW */
  filter:
    drop-shadow(0 0 18px var(--tint))
    drop-shadow(0 0 28px var(--tint))
    blur(var(--blur));
}

.pulse-ring{animation:pulseRing 1.6s ease-out infinite;}
.fade-up{opacity:0;animation:fadeUp .9s ease forwards;}
.step-circle{transition:transform .5s ease,box-shadow .5s ease,background .5s ease;}
.progress-h{transition:width .8s cubic-bezier(.4,0,.2,1);}
.progress-v{transition:height .8s cubic-bezier(.4,0,.2,1);}
      `}</style>

      <section
        className="relative py-20 md:py-32 overflow-hidden bg-[#0b0f1a]"
        style={{ perspective: "1200px" }}
      >
        {/* Floating JC Letters */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{ zIndex: 0 }}
        >
          {particles.map((p) => (
            <span
              key={p.id}
              className="bird-letter"
              style={
                {
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  fontSize: `${p.size}px`,
                  "--tint": p.tint,
                  "--dur": `${p.dur}s`,
                  "--delay": `${p.delay}s`,
                  "--tiltX": `${p.tiltX}deg`,
                  "--tiltY": `${p.tiltY}deg`,
                  "--spin": `${(p.tiltX + p.tiltY) * 0.15}deg`,
                  "--driftX": `${p.driftX}px`,
                  "--driftY": `${p.driftY}px`,
                  "--op-min": p.opMin,
                  "--op-max": p.opMax,
                  /* 🔧 REDUCED BLUR */
                  "--blur": p.size < 28 ? "0.25px" : "0px",
                } as BirdStyle
              }
            >
              {p.label}
            </span>
          ))}
        </div>

        {/* Color Orbs */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 1 }}
        >
          <div className="absolute w-[600px] h-[600px] bg-[#13503B] blur-[140px] opacity-30 rounded-full top-[-200px] left-[-150px]" />
          <div className="absolute w-[500px] h-[500px] bg-[#C5A059] blur-[120px] opacity-30 rounded-full bottom-[-200px] right-[-100px]" />
          <div className="absolute w-[350px] h-[350px] bg-[#0d3528] blur-[100px] opacity-20 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6" style={{ zIndex: 2 }}>
          <h2 className="text-center text-3xl md:text-5xl font-semibold text-white mb-16 md:mb-24 fade-up">
            From Idea → Execution
          </h2>

          <div className="relative flex flex-col md:flex-row md:justify-between items-center md:items-start gap-12 md:gap-0">
            <div className="hidden md:block absolute left-0 right-0 top-10 h-[2px] bg-white/10" />
            <div className="md:hidden absolute top-0 bottom-0 left-8 w-[2px] bg-white/10" />

            <div
              className="hidden md:block absolute top-10 h-[3px] bg-gradient-to-r from-[#C5A059] to-[#13503B] progress-h"
              style={{ width: `${pct}%` }}
            />
            <div
              className="md:hidden absolute left-8 w-[3px] bg-gradient-to-b from-[#C5A059] to-[#13503B] progress-v"
              style={{ height: `${pct}%` }}
            />

            {steps.map((step, index) => {
              const Icon = step.icon;
              const active = index <= activeStep;

              return (
                <div
                  key={index}
                  className="flex flex-row md:flex-col items-center text-left md:text-center w-full md:w-[180px] relative gap-6 md:gap-0 fade-up"
                >
                  <div
                    className={`step-circle relative shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center z-10
                    ${
                      active
                        ? "bg-[#13503B] border border-[#C5A059] shadow-[0_0_30px_rgba(197,160,89,0.8)]"
                        : "bg-white/5 border border-white/10"
                    }`}
                    style={{ transform: active ? "scale(1.08)" : "scale(1)" }}
                  >
                    <Icon
                      size={24}
                      className={active ? "text-[#C5A059]" : "text-white/40"}
                    />
                    {active && (
                      <span className="pulse-ring absolute inset-0 rounded-full border border-[#C5A059]" />
                    )}
                  </div>

                  <div className="md:mt-6 flex-1 md:flex-none">
                    <h3 className="text-white font-semibold text-base md:text-lg">
                      {step.title}
                    </h3>
                    <p className="text-white/60 text-xs md:text-sm mt-1 max-w-[200px]">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};
