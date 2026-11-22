# Private preview during maintenance - 2 October 2026

The apex domain remains on the temporary 503 maintenance page. Because no `onizleme` DNS record exists, the already certified `www.yeninesilbilgiyarismasi.com` host temporarily serves a password-protected preview instead of redirecting to the apex. HTTP `www` redirects to HTTPS `www`.

- Preview root: `/var/www/ynby-preview`, separate from the production site root.
- Preview archive: `/var/backups/ynby/preview-20261002/ynby-preview-20261002.tar.gz`, SHA-256 `64ac89e2798e68adeebd0d5f573d1edc56a0e2c292990940bcd95b310ca197f1`.
- Preview build disables GA4, Google sign-in, and Supabase configuration. No APK was built or modified.
- Nginx Basic Auth credentials are stored only as a salted hash in `/etc/nginx/.htpasswd-ynby-preview`, readable by root and the `www-data` group. The password is deliberately not recorded here.
- Previous maintenance-only Nginx configuration: `/var/backups/ynby/preview-20261002/nginx-maintenance.conf`. The temporary combined configuration is `/var/backups/ynby/preview-20261002/nginx-maintenance-preview.conf`.
- To remove preview but keep maintenance: restore the previous maintenance-only configuration to `/etc/nginx/sites-available/yeninesilbilgiyarismasi`, run `nginx -t`, and reload Nginx. To reopen the full public site, follow `docs/maintenance-20261001.md` after the privacy review.
- Checks: unauthenticated preview returned 401, authenticated preview returned 200 with `X-Robots-Tag: noindex, nofollow, noarchive`, apex remained 503. Browser checks at 390px and 1440px showed no horizontal overflow, no Analytics consent banner, and no requests to Google Analytics or Supabase.
