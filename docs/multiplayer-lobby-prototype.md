# Android multiplayer: current state and combined test checklist

## Current implementation

- Multiplayer is exposed only in the Turkish Android app. The website has no multiplayer entry point.
- A signed-in account creates a room; participants can join with a six-character code and nickname using anonymous Supabase auth when needed.
- Rooms support up to eight participants and expire after two hours. The host alone starts a waiting room.
- The started match uses ten shared medium/mixed Turkish questions, a shared seeded order, a synchronized 20-second timer, private answer submissions, and a result screen.
- Any current room participant can advance after everyone has answered or the timer expires. Any current participant can start a rematch from the results screen. The room code and roster are retained.
- Players can explicitly leave from the waiting room, game, or results. Their current-round score is removed; if the host leaves, host control transfers to the earliest-joined remaining participant. The room is deleted when its last participant leaves.
- The app remembers the last room ID together with the current Supabase identity in local device storage. Reopening the multiplayer screen attempts to restore that room; explicit leave clears the saved pointer. Room membership and permissions are always rechecked with Supabase before restoring. This stores no room code, nickname, or answer data in the pointer.
- When the same room screen reconnects with a valid auth session, a player can recover their own saved correctness, points, and (for choice/map questions only) selected option. Other participants cannot read that answer; long free-text and complex answer payloads are not persisted for recovery.
- One transition wins if participants tap advance/rematch together; other clients refresh their room state.
- Supabase Realtime plus polling refreshes the room and roster. Returning to the app refreshes the synchronized timer/state.
- Closing the app does not remove the player from the room; the round can proceed when its timer expires. Signed-in users can restore a valid remembered room after reopening the multiplayer screen. Anonymous guest authentication remains session-scoped, so restoration after Android kills the app process is not guaranteed for guests.

## Supabase setup

Apply these migrations in order, only once per intended Supabase project:

1. `supabase/migrations/202610150001_multiplayer_lobby.sql`
2. `supabase/migrations/202610150002_multiplayer_game.sql`
3. `supabase/migrations/202610150003_multiplayer_rematch.sql`
4. `supabase/migrations/202610150004_multiplayer_participant_controls.sql`
5. `supabase/migrations/202610150005_multiplayer_leave_room.sql`
6. `supabase/migrations/202610160006_multiplayer_answer_recovery.sql`

The fourth migration updates existing RPC authorization in place: advancing and rematching require room membership, not host identity. The fifth migration adds explicit room departure, host handoff, and last-player room cleanup. The sixth migration adds a selected-option field and private own-answer recovery RPCs; it does not persist long free-text or complex answer payloads. These changes do not delete profile or account data. Starting a rematch clears the previous round's answer rows, as the existing rematch behavior already does.

## Combined APK test session

Build/install a single APK after the current development batch and run these checks together, avoiding repeated uninstall/reinstall cycles:

1. Two devices: create/join, start, answer correctly and incorrectly, verify identical question order/timer and that no correct answer is exposed during countdown.
2. Three devices: verify all see the same question; answer count reaches 3/3; a non-host can advance only after all answers or timeout.
3. Timeout: leave one player unanswered; after 20 seconds any participant can advance, and the unanswered player gets no points.
4. Host loss: host explicitly leaves during waiting and verify the next participant can start; have host leave after game start and verify another participant can continue and start a rematch from results.
5. Background/resume: background or lock a device during a question, wait 10–15 seconds, return and confirm server question/timer state is restored.
6. Temporary network loss: disconnect one device briefly, reconnect, and confirm it catches up without duplicating an answer or score; retrying an already-saved answer should restore its feedback.
7. Rematch: same room code and roster remain, question index and scores reset, a new shared round loads, answer progress is fresh, and the countdown hides the correct answer.
8. Simultaneous advance/rematch taps: one transition occurs and every client converges to the same room state.
9. Leave: a non-host leaves during a game and disappears from the roster/result count; the host leaves and host badge/control transfers; last participant leaves and the room is removed.
10. Security: a user outside the room cannot advance, submit, read results, rematch, or remove another player.
11. Lobby rules: wrong code, full eight-player room, duplicate nickname, and expiry behavior remain understandable.

## Known limitations before public release

- No automated guest-abuse throttling beyond current room/code rules; anonymous-user cleanup and retention policy need operational review.
- Test host disconnect, background/resume, network recovery, and three-player behavior on physical devices before public release.
- The app does not automatically open the multiplayer screen after a cold start; the player returns to the remembered room by opening Friends mode. Automatic startup routing is intentionally avoided so a stale room does not block normal solo play.
- Guest auth is deliberately session-scoped. Durable guest recovery would need an explicit privacy/security decision and should not be added silently.
- The last match's answer rows are replaced on rematch; persistent match history is not provided.
