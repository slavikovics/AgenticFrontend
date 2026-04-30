import "./info.css";

import { useReveal } from "./useReveal";
import { SectionLabel } from "./SectionLabel";
import { FeatureCard } from "./FeatureCard";
import { CapabilityCard } from "./CapabilityCard";
import { StepProcess } from "./StepProcess";
import { FEATURES, STEPS, CAPABILITIES } from "./constants";

export const InfoSection = () => {
  const headerRef = useReveal(0.08);
  const featLabelRef = useReveal(0.08);
  const featGridRef = useReveal(0.06);
  const stepsRef = useReveal(0.08);
  const capsLabelRef = useReveal(0.08);
  const capsGridRef = useReveal(0.06);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <div ref={headerRef} className="reveal mb-10">
          <h1 className="text-2xl font-bold text-foreground mb-1">Справка</h1>
          <p className="text-sm text-muted-foreground">
            Задавайте вопросы, получайте точные ответы с источниками и
            наблюдайте за процессом обработки в реальном времени
          </p>
        </div>

        <div className="mb-10">
          <div ref={featLabelRef} className="reveal mb-4">
            <SectionLabel>Возможности</SectionLabel>
          </div>
          <div
            ref={featGridRef}
            className="stagger-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
          >
            {FEATURES.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>

        <div className="mb-10">
          <div ref={stepsRef} className="reveal">
            <SectionLabel>Процесс обработки запросов</SectionLabel>
            <StepProcess steps={STEPS} />
          </div>
        </div>

        <div>
          <div ref={capsLabelRef} className="reveal mb-4">
            <SectionLabel>Детальные возможности</SectionLabel>
          </div>
          <div
            ref={capsGridRef}
            className="stagger-grid grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            {CAPABILITIES.map((cap) => (
              <CapabilityCard key={cap.title} {...cap} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
