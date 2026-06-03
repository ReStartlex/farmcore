import { Reveal } from "@/components/ui/Reveal";

const items = [
  { value: "2014", label: "в Steam-направлении с" },
  { value: "от 10", label: "аккаунтов на старт" },
  { value: "1500 ₽", label: "цена за аккаунт от" },
  { value: "до заявки", label: "расчёт окупаемости" },
  { value: "Telegram", label: "связь напрямую" },
];

export function TrustBar() {
  return (
    <div className="border-y border-line bg-surface">
      <div className="container-x">
        <Reveal>
          <ul className="grid grid-cols-2 divide-line py-8 sm:grid-cols-3 lg:grid-cols-5 lg:divide-x">
            {items.map((item, i) => (
              <li
                key={item.label}
                className={`flex flex-col items-center px-4 py-3 text-center ${i === 4 ? "col-span-2 sm:col-span-1" : ""}`}
              >
                <span className="font-display text-xl font-extrabold text-ink sm:text-2xl">
                  {item.value}
                </span>
                <span className="mt-1 text-xs text-muted sm:text-sm">{item.label}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </div>
  );
}
