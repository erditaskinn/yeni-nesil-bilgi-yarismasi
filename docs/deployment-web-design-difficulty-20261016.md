# Web release: refreshed Turkish design and three difficulty levels

Date: 16 October 2026. Published the static web export to Hetzner. The Android project and APK were not changed.

- Backup: `/var/backups/ynby/web-design-difficulty-20261016-prepublish/site` and `nginx.conf`.
- Staged archive: `/tmp/ynby-web-release-20261016.tar.gz`.
- Archive SHA-256: `40cce5e8d76ffff977de20f1d871013207437289cb82c5fb238ec5da9dc7a138`; local and server hashes matched before publishing.
- The staged export contained 281 files (16,109,373 bytes). Files were copied without deleting existing files; `rsync -rcni --checksum` reported no differences for staged files. Nginx configuration was not changed or reloaded.
- Turkish web now uses the updated visual design, category search and three visible difficulties. The existing Expert question pool is included in Turkish Hard. English pages retain their four levels and previous design. The Turkish legacy `/cok-zor-bilgi-yarismasi` route remains available with `noindex` and a canonical URL to `/zor-bilgi-yarismasi`.
- Validation: typecheck, lint, 109 unit tests, production build, and targeted Playwright flows passed. Live HTTPS `/`, `/en`, `/sitemap.xml`, `/zor-bilgi-yarismasi`, and `/cok-zor-bilgi-yarismasi` returned 200. The legacy canonical/noindex and sitemap checks passed. `nginx -t` passed; it reported the pre-existing IPv6 protocol warning for the separate `kangarogo` site.

## Follow-up: selection card layout

The Turkish web stylesheet's three-column level and round rules conflicted with the later compact-list layout, leaving card text in narrow columns. Removed those conflicting rules and published a new static export without changing the APK or Nginx configuration.

- Backup: `/var/backups/ynby/web-layout-fix-20261016-prepublish/site` and `nginx.conf`.
- Archive: `/tmp/ynby-web-layout-fix-20261016.tar.gz` (SHA-256 `8cacd6bd52d782d55e9f0257ac907e3b36e7472a34767140cf3a41146668e96b`). Local and server hashes matched.
- The 281 staged files were copied without deleting existing files; `rsync -rcni --checksum` reported no differences.
- Production build and targeted lint passed. A Playwright geometry test passed in desktop, mobile, and tablet projects at 320 px and 900 px; screenshots were visually checked. The live homepage, English page, sitemap, and current CSS asset returned HTTP 200.
