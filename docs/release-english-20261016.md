# English web and Android test release

Date: 16 October 2026.

## Web

- Published the current static export to Hetzner at `/var/www/yeninesilbilgiyarismasi` after backing up the site and Nginx configuration to `/var/backups/ynby/web-english-20261016-prepublish`.
- Staged archive: `/tmp/ynby-web-en-release-20261016.tar.gz`; SHA-256: `84726f8a2c48f9b505fda04fdc1a493b60adec33c2a186212c10db8e177caf85` (local and server hashes matched).
- Files were copied without deleting existing files. Nginx configuration was not changed or reloaded; `nginx -t` passed with the existing warning for the separate `kangarogo` site.
- Live HTTPS `/`, `/en`, `/en/hard-trivia-quiz`, and `/sitemap.xml` returned HTTP 200.

## Android

- Test APK: `artifacts/ynby-android-test.apk`, version `0.7.0` (version code 8), package `com.yeninesilbilgiyarismasi.app`, minimum API 24, target API 36; size 16,485,544 bytes.
- SHA-256: `1228816e8ff54b6279ed1eece382ad938346e9178c4b7f5ca174aa2ca0a826b1`.
- APK signature verified (v2). Android `assembleDebug`, `testDebugUnitTest`, and `lintDebug` Gradle tasks completed successfully. Reports are in `artifacts/android-0.7.0-reports`.
- This is a debug test APK, not a Play Store release. Install over the existing app; do not uninstall if you want to preserve its local data.
