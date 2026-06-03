import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "FARMCORE — CS2 / Steam фермы под ключ";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background:
            "linear-gradient(135deg, #F6F7FB 0%, #ECECFB 55%, #E4F6F2 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "linear-gradient(135deg, #5B5BD6 0%, #7A6CF0 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 40,
              fontWeight: 800,
            }}
          >
            F
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#0E1116", letterSpacing: -1 }}>
            FARMCORE
          </div>
          <div
            style={{
              marginLeft: 12,
              padding: "8px 16px",
              borderRadius: 999,
              background: "#E6F7F3",
              color: "#0B8472",
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            опыт с 2014
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 68,
              fontWeight: 800,
              color: "#0E1116",
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 1000,
            }}
          >
            CS2-ферма под ключ
          </div>
          <div style={{ fontSize: 36, fontWeight: 600, color: "#3D3DAE", maxWidth: 980 }}>
            Расчёт, аккаунты и запуск под ваш бюджет
          </div>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          {["От 10 аккаунтов", "Цена от 1500 ₽/акк", "Расчёт окупаемости"].map((t) => (
            <div
              key={t}
              style={{
                padding: "14px 24px",
                borderRadius: 16,
                background: "white",
                border: "1px solid #E7E9F0",
                color: "#2A2F3A",
                fontSize: 26,
                fontWeight: 600,
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
