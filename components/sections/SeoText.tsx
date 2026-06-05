import { Reveal } from "@/components/ui/Reveal";

export function SeoText() {
  return (
    <section className="border-t border-line bg-surface py-16">
      <div className="container-x">
        <Reveal>
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl font-extrabold text-ink">
              Ферма CS2 / Steam под ключ в 2026 году
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted">
              <p>
                <strong className="text-ink-soft">Ферма CS2</strong> (она же ферма кс2 или ферма
                стим) — это набор аккаунтов Steam, которые каждую неделю получают дроп предметов и
                кейсов CS2. Предметы продаются на торговой площадке, а доход зависит от количества
                аккаунтов, выпавшего дропа и текущих цен на рынке. Чем больше аккаунтов, тем больше
                еженедельных попыток и выше шанс поймать дорогой предмет.
              </p>
              <p>
                Мы делаем{" "}
                <a href="/ferma-cs2" className="font-semibold text-accent underline-offset-2 hover:underline">
                  ферму CS2 под ключ
                </a>
                : помогаем рассчитать стартовый бюджет, подобрать объём аккаунтов под вашу сумму и
                понять ориентировочную окупаемость ещё до покупки.{" "}
                <a href="/steam-ferma" className="font-semibold text-accent underline-offset-2 hover:underline">
                  Steam ферма под ключ
                </a>{" "}
                подходит и новичкам, и тем, кто хочет масштабироваться — старт возможен от 10
                аккаунтов, а цена за аккаунт снижается с объёмом.
              </p>
              <p>
                Если вы хотите{" "}
                <a href="/kupit-fermu-cs2" className="font-semibold text-accent underline-offset-2 hover:underline">
                  купить ферму CS2
                </a>{" "}
                и понять её окупаемость, воспользуйтесь калькулятором выше или напишите в Telegram.
                Подскажем по запуску, объясним механику дропа и поможем выбрать сценарий под бюджет.
                Заработок на дропе CS2 — это не гарантированная прибыль, а ориентировочный расчёт,
                который зависит от рынка и количества аккаунтов, поэтому мы считаем всё честно и без
                обещаний.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
