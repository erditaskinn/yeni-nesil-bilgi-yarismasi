import { Capacitor } from "@capacitor/core";
import { SITE_URL } from "./config";
import { categoryInfo, translate, type Locale } from "./locale";
import type { KnowledgeProfile } from "./knowledge-profile";

export type CardFormat = "story" | "square";
export function cardDimensions(format: CardFormat) { return format === "story" ? { width: 1080, height: 1920 } : { width: 1080, height: 1080 }; }

export function profileComment(profile: KnowledgeProfile, locale: Locale) {
  const strong = profile.strongest;
  const explore = profile.readyToExplore;
  if (!profile.ready || !strong) return translate(locale, "profileCommentGrowing");
  if (explore && explore.category !== strong.category && explore.percentage < strong.percentage)
    return translate(locale, "profileCommentBoth", { strong: categoryInfo(locale, strong.category).label, explore: categoryInfo(locale, explore.category).label });
  return translate(locale, "profileCommentStrong", { category: categoryInfo(locale, strong.category).label });
}

export function cardContent(profile: KnowledgeProfile, locale: Locale, nickname?: string) {
  if (!profile.ready || profile.radar.length < 3) throw new Error("Insufficient profile data");
  return { title: translate(locale, "profileDna"), rows: profile.radar.slice(0, 4).map(item => ({ label: categoryInfo(locale, item.category).label, percentage: item.percentage })), comment: profileComment(profile, locale), nickname: nickname?.trim().slice(0, 30) || undefined, site: "yeninesilbilgiyarismasi.com" };
}

export async function renderKnowledgeCard(profile: KnowledgeProfile, locale: Locale, format: CardFormat, nickname?: string): Promise<Blob> {
  const content = cardContent(profile, locale, nickname);
  const { width, height } = cardDimensions(format);
  const canvas = document.createElement("canvas");
  canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.fillStyle = "#17133f"; ctx.fillRect(0, 0, width, height);
  const start = format === "story" ? 290 : 115;
  const footer = format === "story" ? height - 270 : height - 105;
  const colors = ["#24c9c3", "#7559f2", "#ffc83d", "#ff5e5b"];
  const logo = new Image();
  logo.src = "/icon.svg";
  await new Promise<void>((resolve, reject) => { logo.onload = () => resolve(); logo.onerror = () => reject(new Error("Logo unavailable")); });
  ctx.drawImage(logo, 74, start - 80, 84, 84);
  ctx.fillStyle = "#ffffff"; ctx.font = "600 33px Arial, sans-serif";
  ctx.fillText(locale === "tr" ? "Yeni Nesil Bilgi Yarışması" : "Next Gen Trivia Quiz", 180, start - 25);
  ctx.font = "bold 74px Arial, sans-serif"; ctx.fillText(content.title, 74, start + 110);
  if (content.nickname) { ctx.font = "34px Arial, sans-serif"; ctx.fillStyle = "#c8c4e5"; ctx.fillText(content.nickname, 76, start + 170); }
  let y = start + (format === "story" ? content.nickname ? 290 : 255 : content.nickname ? 255 : 225);
  content.rows.forEach((row, index) => {
    ctx.fillStyle = colors[index]!; ctx.fillRect(76, y - 39, 10, 54);
    ctx.fillStyle = "#ffffff"; ctx.font = "500 42px Arial, sans-serif"; ctx.fillText(row.label, 110, y);
    ctx.textAlign = "right"; ctx.font = "bold 55px Arial, sans-serif"; ctx.fillText(`${row.percentage}%`, 1000, y + 2); ctx.textAlign = "left";
    ctx.fillStyle = "#504b74"; ctx.fillRect(110, y + 27, 890, 8);
    ctx.fillStyle = colors[index]!; ctx.fillRect(110, y + 27, 890 * row.percentage / 100, 8);
    y += format === "story" ? 170 : 110;
  });
  if (format === "story") {
    const cx = 540, cy = 1285, radius = 125;
    const vertex = (index: number, scale: number) => {
      const angle = -Math.PI / 2 + index * Math.PI * 2 / content.rows.length;
      return [cx + Math.cos(angle) * radius * scale, cy + Math.sin(angle) * radius * scale] as const;
    };
    const polygon = (scale: number, stroke: string, fill?: string) => {
      ctx.beginPath();
      content.rows.forEach((_, index) => { const [x, yy] = vertex(index, scale); if (index) ctx.lineTo(x, yy); else ctx.moveTo(x, yy); });
      ctx.closePath();
      if (fill) { ctx.fillStyle = fill; ctx.fill(); }
      ctx.strokeStyle = stroke; ctx.lineWidth = 3; ctx.stroke();
    };
    [.33, .66, 1].forEach(scale => polygon(scale, "#514c78"));
    ctx.beginPath();
    content.rows.forEach((row, index) => { const [x, yy] = vertex(index, row.percentage / 100); if (index) ctx.lineTo(x, yy); else ctx.moveTo(x, yy); });
    ctx.closePath(); ctx.fillStyle = "#24c9c366"; ctx.fill(); ctx.strokeStyle = "#24c9c3"; ctx.lineWidth = 5; ctx.stroke();
    content.rows.forEach((row, index) => { const [x, yy] = vertex(index, row.percentage / 100); ctx.beginPath(); ctx.arc(x, yy, 9, 0, Math.PI * 2); ctx.fillStyle = colors[index]!; ctx.fill(); });
  }
  ctx.fillStyle = "#c8c4e5"; ctx.font = "36px Arial, sans-serif";
  const words = content.comment.split(" "); let line = ""; let commentY = Math.max(y + 20, footer - 155);
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width > 910 && line) { ctx.fillText(line, 76, commentY); commentY += 48; line = word; } else line = candidate;
  }
  if (line) ctx.fillText(line, 76, commentY);
  ctx.fillStyle = "#24c9c3"; ctx.font = "600 35px Arial, sans-serif"; ctx.fillText(content.site, 76, footer);
  return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("PNG encoding failed")), "image/png"));
}

export async function shareKnowledgeCard(blob: Blob, format: CardFormat, locale: Locale): Promise<"shared" | "downloaded" | "cancelled"> {
  const name = `bilgi-dna-${format}.png`;
  const text = locale === "tr" ? "Benim Bilgi DNA'm böyle çıktı! Sen hangi kategoride daha güçlüsün?" : "Here's my Knowledge DNA! Which topic is your strongest?";
  if (Capacitor.isNativePlatform()) {
    const { Filesystem, Directory } = await import("@capacitor/filesystem");
    const { Share } = await import("@capacitor/share");
    const path = `knowledge-dna-${crypto.randomUUID()}.png`;
    const base64 = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result).split(",")[1] ?? ""); reader.onerror = () => reject(reader.error); reader.readAsDataURL(blob); });
    await Filesystem.writeFile({ path, data: base64, directory: Directory.Cache });
    try {
      const { uri } = await Filesystem.getUri({ path, directory: Directory.Cache });
      try { await Share.share({ title: name, text, url: SITE_URL, files: [uri] }); }
      catch (error) { if (error instanceof Error && /cancel|abort/i.test(`${error.name} ${error.message}`)) return "cancelled"; throw error; }
      return "shared";
    } finally { await Filesystem.deleteFile({ path, directory: Directory.Cache }).catch(() => {}); }
  }
  const file = new File([blob], name, { type: "image/png" });
  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ title: name, text: `${text} ${SITE_URL}`, files: [file] }); return "shared"; }
    catch (error) { if (error instanceof Error && error.name === "AbortError") return "cancelled"; }
  }
  downloadKnowledgeCard(blob, name);
  return "downloaded";
}

export function downloadKnowledgeCard(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a"); anchor.href = url; anchor.download = name; document.body.append(anchor); anchor.click(); anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60000);
}
