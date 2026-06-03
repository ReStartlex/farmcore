import { cn } from "@/lib/utils";

type SectionProps = {
  id?: string;
  className?: string;
  children: React.ReactNode;
};

export function Section({ id, className, children }: SectionProps) {
  return (
    <section id={id} className={cn("relative scroll-mt-24 py-20 sm:py-28", className)}>
      <div className="container-x">{children}</div>
    </section>
  );
}

type HeadingProps = {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  center?: boolean;
  className?: string;
};

export function SectionHeading({ eyebrow, title, subtitle, center, className }: HeadingProps) {
  return (
    <div className={cn(center && "mx-auto text-center", "max-w-2xl", className)}>
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h2 className="mt-4 font-display text-3xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{subtitle}</p>
      ) : null}
    </div>
  );
}
