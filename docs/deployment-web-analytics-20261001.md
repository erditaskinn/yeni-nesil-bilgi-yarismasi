# Web release: Analytics consent and pending web revisions

Date: 1 October 2026. The complete current static web export was published to Hetzner at `/var/www/yeninesilbilgiyarismasi`. The Android project and APK were not built, synchronized, or changed for this release.

- Production backup: `/var/backups/ynby/analytics-fullweb-20261001-prepublish/site` and `nginx.conf`.
- Staged archive: `/var/backups/ynby/analytics-fullweb-20261001.tar.gz`.
- Archive SHA-256: `9aae313516654ed3fef42aea6dc178c2cba0b354a76ef49508bfcd5890a9eac6`; local and server hashes matched.
- Assets were copied first, followed by pages. No files were deleted. `rsync -rcni` reported zero differences between the staged export and the live web root. Nginx configuration was not modified or reloaded; `nginx -t` passed. Its pre-existing IPv6 warning names another site.
- The user confirmed `knowledge_profile_settings`, `knowledge_rounds`, and `clear_knowledge_profile()` in the production Supabase SQL Editor before deployment. An authenticated account sync was not exercised during release validation.
- Validation: production build, full lint, 80 unit/database tests, consent tests on desktop/mobile/tablet (3/3), and Knowledge Profile browser tests (2/2) passed. Live HTTPS `/`, `/en`, `/gizlilik`, `/en/privacy`, `/hesap`, `/en/account`, `/teknoloji-bilgi-yarismasi`, and `/sitemap.xml` returned 200.
- Live browser test intercepted Google requests: none before consent or after rejection; the configured GA4 tag requested after acceptance. The mobile privacy page showed consent controls without horizontal overflow. This does not verify reporting in the Google Analytics dashboard or replace legal review.
