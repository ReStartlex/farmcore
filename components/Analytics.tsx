"use client";

import Script from "next/script";
import { useEffect } from "react";
import { YM_ID, ymGoal } from "@/lib/analytics";

/**
 * Яндекс.Метрика + автоматическое отслеживание целей.
 * Счётчик подключается только если задан NEXT_PUBLIC_YM_ID.
 * Клики по ссылкам Telegram ловятся глобально (цель `tg_click`),
 * поэтому не нужно вешать обработчики на каждую кнопку.
 */
export function Analytics() {
  useEffect(() => {
    if (!YM_ID) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest?.("a");
      if (link && /(?:t\.me|telegram\.me)\//i.test(link.getAttribute("href") ?? "")) {
        ymGoal("tg_click");
      }
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  if (!YM_ID) return null;

  return (
    <>
      <Script id="yandex-metrika" strategy="afterInteractive">
        {`
          (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
          (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
          ym(${Number(YM_ID)}, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true });
        `}
      </Script>
      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${YM_ID}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}
