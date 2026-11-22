import { ImageResponse } from "next/og";
export const dynamic = "force-static";
export function GET() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f0ecff", color: "#17133F", fontFamily: "sans-serif" }}>
    <div style={{ display: "flex", background: "#FFC83D", padding: "12px 24px", borderRadius: 8, fontSize: 22, marginBottom: 30 }}>CHOOSE YOUR ROUND · 4 LEVELS · NEW DISCOVERIES</div>
    <div style={{ fontSize: 66, fontWeight: 700 }}>Next Gen</div><div style={{ fontSize: 76, fontWeight: 700, color: "#008F83" }}>Trivia Quiz</div>
    <div style={{ fontSize: 30, marginTop: 20 }}>Show what you know. Have fun learning!</div><div style={{ fontSize: 21, marginTop: 48, color: "#66647a" }}>yeninesilbilgiyarismasi.com/en</div>
  </div>, { width: 1200, height: 630 });
}
