# Google Play Release Checklist

This checklist separates repository work from actions that require the developer's Play Console account or physical-device testing. A passing checklist does not guarantee Google Play approval.

## Repository status

- Android application ID: `com.yeninesilbilgiyarismasi.app`. Do not change it after the Play listing is created.
- Current development version: `versionCode 7`, `versionName 0.6.0`. Increase the code for every uploaded release.
- `targetSdkVersion` and `compileSdkVersion` are 36, meeting the current API target for new app submissions.
- The main quiz content is bundled locally; the Android app does not load the production website in a remote WebView.
- Android source manifest requests `INTERNET` only. The final merged manifest still needs inspection after the release build.
- No advertising or Google Analytics SDK is intentionally included in Android. Website Analytics consent does not apply to the app.
- Account creation is optional. Account deletion exists in-app; the public deletion page is `/hesap-silme`.
- Android backup is disabled. Quiz history and preferences are local; optional account records and multiplayer data use Supabase.
- Multiplayer is app-only, uses Supabase anonymous identities for guests, and is not end-to-end encrypted. Room membership policies restrict game data access.
- The debug APK is for testing only. Never upload it to Play Console.

## Required before upload

- Complete the combined physical-device checklist in `docs/multiplayer-lobby-prototype.md`, plus solo quiz, offline, account, lifecycle, and accessibility checks.
- Build a release Android App Bundle (`.aab`) after testing and inspect the merged manifest, dependency/security warnings, and Play pre-launch report.
- Configure Play App Signing and make a secure, separately backed-up copy of the upload key. Never put signing secrets in source control or chat.
- Prepare the store icon, feature graphic, real app screenshots, Turkish short/full description, support contact, category, and accurate feature claims. Do not advertise unfinished features.
- Complete App content, privacy policy, Data safety, data deletion, content rating, target audience, ads, and app-access declarations using the exact production SDK/configuration and data flows. The developer must review and submit these declarations.
- Confirm the privacy policy and account-deletion URLs are public, load without login, name the app/operator, and accurately describe current Android data handling.
- If this is a personal developer account created after 13 November 2023, confirm the current closed-testing eligibility rule in Play Console; Google's current rule requires at least 12 opted-in testers continuously for 14 days before applying for production access.
- Use an internal/closed testing track first. Verify the uploaded bundle and listing on real devices before requesting production access.

## Not completed in this repository

- No release signing key, signed bundle, Play Console listing, store graphics, or production release has been created.
- No account-owner information, tester roster, or Play Console declarations have been supplied or submitted.
- No legal opinion is provided. The operator must confirm privacy disclosures, data transfers, retention, and applicable Turkish/EU obligations with qualified counsel where needed.
