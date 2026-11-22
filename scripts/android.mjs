import { spawnSync } from "node:child_process";
import { copyFileSync, cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import os from "node:os";

const root = fileURLToPath(new URL("../", import.meta.url));
const mode = process.argv[2] ?? "sync";
if (!["sync", "apk"].includes(mode)) throw new Error("Use sync or apk.");
function run(command, args, env = process.env, cwd = root) {
  const result = spawnSync(command, args, { cwd, env, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} failed (${result.status}).`);
}
run(process.execPath, ["node_modules/next/dist/bin/next", "build"], {
  ...process.env, NEXT_PUBLIC_ANDROID_BUILD: "1",
});
if (!existsSync(path.join(root, "mobile-out/index.html"))) throw new Error("Missing Android export.");
if (!existsSync(path.join(root, "android"))) {
  run(process.execPath, ["node_modules/@capacitor/cli/bin/capacitor", "add", "android"]);
}
run(process.execPath, ["node_modules/@capacitor/cli/bin/capacitor", "sync", "android"]);
if (mode === "apk") {
  const portable = path.join(root, ".android-tools/jdk21");
  const javaHome = process.env.JAVA_HOME ?? (existsSync(portable)
    ? path.join(portable, readdirSync(portable).find(name => existsSync(path.join(portable, name, "bin/java.exe"))) ?? "")
    : "C:/Program Files/Android/Android Studio/jbr");
  const sdk = process.env.ANDROID_HOME ?? process.env.ANDROID_SDK_ROOT ?? path.join(process.env.LOCALAPPDATA ?? "", "Android/Sdk");
  if (!existsSync(path.join(javaHome, "bin", process.platform === "win32" ? "java.exe" : "java"))) {
    throw new Error("Java 21 required. Set JAVA_HOME to Android Studio's jbr folder or a JDK 21 installation.");
  }
  if (!existsSync(sdk)) throw new Error("Android SDK required. Set ANDROID_HOME.");
  const env = { ...process.env, JAVA_HOME: javaHome, ANDROID_HOME: sdk, ANDROID_SDK_ROOT: sdk };
  let buildRoot = root;
  if (process.platform === "win32" && /[^\x00-\x7f]/.test(root)) {
    // AGP rejects non-ASCII project paths on Windows; stage only native inputs.
    buildRoot = mkdtempSync(path.join(os.tmpdir(), "ynby-android-"));
    const filter = source => !source.split(path.sep).some(part => ["build", ".gradle", ".idea"].includes(part));
    cpSync(path.join(root, "android"), path.join(buildRoot, "android"), { recursive: true, filter });
    for (const name of ["android/capacitor", "app/android", "share/android", "browser/android", "filesystem/android"]) {
      cpSync(path.join(root, "node_modules/@capacitor", name), path.join(buildRoot, "node_modules/@capacitor", name), { recursive: true, filter });
    }
    console.log(`Native build staging: ${buildRoot}`);
  }
  const tasks = [":app:assembleDebug", ":app:testDebugUnitTest", ":app:lintDebug", "--no-daemon", "--max-workers=2"];
  if (process.platform === "win32") run("cmd.exe", ["/d", "/c", "gradlew.bat", ...tasks], env, path.join(buildRoot, "android"));
  else run("./gradlew", tasks, env, path.join(buildRoot, "android"));
  mkdirSync(path.join(root, "artifacts"), { recursive: true });
  copyFileSync(path.join(buildRoot, "android/app/build/outputs/apk/debug/app-debug.apk"), path.join(root, "artifacts/ynby-android-test.apk"));
  cpSync(path.join(buildRoot, "android/app/build/reports"), path.join(root, "artifacts/android-reports"), { recursive: true });
  console.log("Test APK: artifacts/ynby-android-test.apk (not a Play Store release).");
}
