import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLanding, landings } from "@/data/landings";
import { site } from "@/data/site";
import { Header } from "@/components/sections/Header";
import { LandingHero } from "@/components/sections/LandingHero";
import { TrustBar } from "@/components/sections/TrustBar";
import { Calculator } from "@/components/sections/Calculator";
import { WhyVolume } from "@/components/sections/WhyVolume";
import { Scenarios } from "@/components/sections/Scenarios";
import { Process } from "@/components/sections/Process";
import { Trust } from "@/components/sections/Trust";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";
import { StickyCta } from "@/components/sections/StickyCta";
import { Reveal } from "@/components/ui/Reveal";

export const dynamicParams = false;

export function generateStaticParams() {
  return landings.map((l) => ({ slug: l.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const landing = getLanding(params.slug);
  if (!landing) return {};
  return {
    title: landing.title,
    description: landing.description,
    alternates: { canonical: `/${landing.slug}` },
    openGraph: {
      type: "website",
      locale: "ru_RU",
      url: `${site.domain}/${landing.slug}`,
      siteName: site.brand,
      title: landing.title,
      description: landing.description,
    },
  };
}

export default function LandingPage({ params }: { params: { slug: string } }) {
  const landing = getLanding(params.slug);
  if (!landing) notFound();

  const others = landings.filter((l) => l.slug !== landing.slug);

  return (
    <>
      <Header />
      <main>
        <LandingHero landing={landing} />
        <TrustBar />
        <Calculator />
        <WhyVolume />
        <Scenarios />
        <Process />
        <Trust />
        <Faq items={landing.faq} />
        <FinalCta />

        <section className="border-t border-line bg-surface py-16">
          <div className="container-x">
            <Reveal>
              <div className="mx-auto max-w-3xl">
                <h2 className="font-display text-2xl font-extrabold text-ink">
                  {landing.seoTitle}
                </h2>
                <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted">
                  {landing.seoParagraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>

                {/* Внутренняя перелинковка между лендингами + на главную (помогает SEO). */}
                <nav className="mt-8 border-t border-line pt-6" aria-label="Смотрите также">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">
                    Смотрите также
                  </h3>
                  <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                    {others.map((l) => (
                      <li key={l.slug}>
                        <a
                          href={`/${l.slug}`}
                          className="text-sm font-medium text-accent underline-offset-2 hover:underline"
                        >
                          {l.eyebrow}
                        </a>
                      </li>
                    ))}
                    <li>
                      <a
                        href="/"
                        className="text-sm font-medium text-accent underline-offset-2 hover:underline"
                      >
                        Калькулятор фермы
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}
