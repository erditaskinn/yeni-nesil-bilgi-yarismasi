# Temporary maintenance mode - 1 October 2026

The production domain is temporarily serving `deploy/maintenance.html` with HTTP 503, `Retry-After: 3600`, and `Cache-Control: no-store` while the privacy policy and KVKK process are reviewed. The maintenance page contains no JavaScript or analytics. Website files, Supabase records, and Android APK were not changed. Only this site's active Nginx configuration was replaced and reloaded; the other virtual hosts were not edited.

- Original production Nginx configuration backup: `/var/backups/ynby/maintenance-20261001/nginx.conf` (SHA-256 `506cdb2c748570ec15d6fe11592bec565922b48138006119243de641aa6e31a7`).
- Temporary Nginx configuration: `/var/backups/ynby/maintenance-20261001/nginx-maintenance.conf`.
- Maintenance HTML: `/var/www/yeninesilbilgiyarismasi/maintenance.html`.
- To reopen after review: restore the backed-up Nginx configuration to `/etc/nginx/sites-available/yeninesilbilgiyarismasi`, run `nginx -t`, then reload Nginx. The `maintenance.html` file can remain unused; no deletion is required. Confirm HTTPS `/`, `/en`, `/gizlilik`, and `/hesap` return 200 afterward.
- Validation: `/`, `/hesap`, `/gizlilik`, `/en`, and `/_next/static/` returned 503; the logo returned 200. HTTP and `www` still redirect to canonical HTTPS. Browser checks at 390px and 1440px showed the maintenance heading, loaded logo, no horizontal overflow, and no scripts.
