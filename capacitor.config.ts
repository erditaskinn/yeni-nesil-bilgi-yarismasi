import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.yeninesilbilgiyarismasi.app",
  appName: "Yeni Nesil Bilgi Yarışması",
  webDir: "mobile-out",
  android: { backgroundColor: "#17133F", allowMixedContent: false },
  plugins: {
    SystemBars: { insetsHandling: "native", style: "DARK" },
  },
};
export default config;
