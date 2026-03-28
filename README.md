# Multiplayer Tic‑Tac‑Toe (Frontend) — Documentation & Implementation Steps

This document provides a **frontend-focused implementation plan** for a production-ready multiplayer Tic-Tac-Toe game powered by a **Nakama server-authoritative backend**.

It is designed to satisfy the assignment requirements shown in the brief:
- responsive mobile-first UI,
- real-time state updates,
- player/match status visibility,
- support for concurrent sessions,
- timer-based mode,
- leaderboard integration,
- deployment and testing guidance.

---

## 1) Frontend Scope

### Goals
- Build a mobile-optimized real-time game client.
- Integrate with Nakama authentication, matchmaking, match state updates, and RPC endpoints.
- Ensure deterministic rendering from server-authoritative state.
- Support multiple game modes (classic + timed).
- Show post-match summary and leaderboard data.

### Non-Goals (Frontend)
- Implementing authoritative game rules in the client (server owns final truth).
- Persisting match/leaderboard records directly from the frontend without backend validation.

---

## 2) Recommended Frontend Architecture

## Suggested Tech Stack
- **Framework:** React + TypeScript (Vite or Next.js SPA mode)
- **State management:** Zustand or Redux Toolkit
- **Network:** Nakama JavaScript client + WebSocket realtime socket
- **UI:** Tailwind CSS or Material UI (mobile-first)
- **Validation:** Zod for runtime payload validation
- **Testing:** Vitest + React Testing Library + Playwright

## Folder Structure (Example)

```text
src/
  app/
    router.tsx
    providers.tsx
  screens/
    Auth/
    Lobby/
    Matchmaking/
    GameRoom/
    Result/
    Leaderboard/
  components/
    GameBoard.tsx
    TurnIndicator.tsx
    MatchTimer.tsx
    PlayerCard.tsx
    ConnectionBadge.tsx
    LoadingState.tsx
    ErrorState.tsx
  state/
    authStore.ts
    matchmakingStore.ts
    gameStore.ts
    leaderboardStore.ts
  services/
    nakamaClient.ts
    socket.ts
    matchApi.ts
    leaderboardApi.ts
    telemetry.ts
  models/
    game.ts
    player.ts
    leaderboard.ts
    network.ts
  utils/
    reconnection.ts
    timers.ts
    formatters.ts
```

## State Strategy
- Keep a **single source of truth** for match state in `gameStore`.
- Apply updates only from server events (`match_data`, `match_presence`, authoritative snapshots).
- Use optimistic UI sparingly (e.g., button disabling), never optimistic board writes.

---

## 3) UI/UX Requirements Mapping

## Screens to Deliver
1. **Nickname/Auth Screen**
   - Create guest/custom id session.
   - Persist session token securely.
2. **Matchmaking Screen**
   - Classic / Timed mode selector.
   - Queue status + cancel option.
3. **Game Room Screen**
   - 3x3 board.
   - Active turn indicator.
   - Player names/symbols.
   - Connection/reconnect status.
   - Countdown timer (timed mode).
4. **Result Screen**
   - Winner/draw status.
   - Score delta / points change.
   - Rematch / back to lobby.
5. **Leaderboard Screen**
   - Top players list (rank, wins/losses, streak).
   - Current player highlight.

## Mobile-First UX Details
- Minimum touch target: 44x44 px.
- Board keeps square ratio across devices.
- Avoid blocking modals during active turn.
- Use subtle animations for turn changes and winning line.

---

## 4) Frontend-Nakama Integration Contract

## Connection Lifecycle
1. Create `Nakama.Client`.
2. Authenticate user (guest/custom).
3. Open socket connection.
4. Join queue or create/join match.
5. Subscribe to:
   - match state events,
   - presence updates,
   - disconnect/reconnect callbacks.

## Match Data Event Types (Example)
Use operation codes (opCodes) for message routing:
- `100`: full state snapshot
- `101`: move accepted / state patch
- `102`: timer tick / timer sync
- `103`: match end event
- `104`: rematch proposal/response

## Client Validation Rules
- Validate payload shape before reducing into state.
- Ignore stale sequence numbers.
- If desync detected, request full snapshot from server.

---

## 5) Feature-by-Feature Implementation Steps

## Phase A — Foundation
1. Initialize React TypeScript project.
2. Add linting/formatting and strict TS config.
3. Implement base routing + layout shell.
4. Create Nakama client/service wrappers.
5. Add environment config handling (`VITE_NAKAMA_*`).

**Definition of Done**
- App starts on mobile viewport.
- Can authenticate and open socket.

## Phase B — Matchmaking + Room Discovery
1. Build matchmaking UI with mode selector.
2. Add queue/join/cancel actions.
3. Handle waiting state + timeout feedback.
4. Navigate to game room on match assignment.

**Definition of Done**
- Two clients can enter queue and reach same room reliably.

## Phase C — Real-Time Board (Authoritative)
1. Render board from server state only.
2. Send move command with cell index.
3. Disable interactions when:
   - not your turn,
   - match complete,
   - disconnected.
4. Handle reconnect flow:
   - show reconnecting banner,
   - resubscribe and recover snapshot.

**Definition of Done**
- Moves are validated by server and reflected correctly on both clients.

## Phase D — Timer Mode
1. Add game mode metadata in queue payload.
2. Display per-turn countdown.
3. Sync timer using server timestamps (avoid local drift).
4. Handle timeout auto-forfeit UX and result messaging.

**Definition of Done**
- Timeout causes server-declared result and consistent UI on all clients.

## Phase E — Leaderboard
1. Add leaderboard API calls.
2. Build leaderboard table and player highlight.
3. Add post-game score update fetch.
4. Add empty/loading/error states.

**Definition of Done**
- Ended matches are reflected in leaderboard with expected fields.

## Phase F — Hardening + Release
1. Add telemetry/logging hooks for errors and socket events.
2. Add retry/backoff policies.
3. Add analytics for queue duration and match completion.
4. Optimize bundle and lazy-load non-critical screens.
5. Final accessibility and performance pass.

**Definition of Done**
- Production build passes QA checklist and smoke tests.

---

## 6) Concurrent Game Support (Frontend)

Although each player is usually in one active match, frontend must be robust for concurrency at platform level:
- Keep state namespaced by `matchId` where feasible.
- Avoid singleton mutable game objects outside stores.
- Ensure event handlers route by `matchId`.
- Prevent cross-room UI leakage when users quickly re-queue.

Recommended approach:
- Maintain `activeMatchId` + `matchesById` cache.
- Clear stale listeners on match leave.
- Use idempotent reducers keyed by message sequence/version.

---

## 7) Deployment Documentation (Frontend)

## Environment Variables

```bash
VITE_NAKAMA_HOST=
VITE_NAKAMA_PORT=
VITE_NAKAMA_USE_SSL=
VITE_NAKAMA_SERVER_KEY=
VITE_APP_ENV=
```

## Build & Run

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Hosting Options
- Vercel / Netlify for web build.
- Mobile wrapper options: Capacitor or React Native implementation variant.

## Release Checklist
- Production Nakama endpoint configured.
- Source maps and monitoring enabled.
- CORS and websocket security validated.
- Version tag and changelog published.

---

## 8) Testing Plan (How to Test Multiplayer)

## Local Test Matrix
1. **2-player happy path**
   - Two browsers/devices join, complete match.
2. **Out-of-turn move rejection**
   - Attempt illegal move; ensure client displays rejection state.
3. **Reconnect scenario**
   - Drop one client network, reconnect, verify state resync.
4. **Timer timeout**
   - Let timer expire; verify auto-forfeit result.
5. **Queue cancel/rejoin**
   - Cancel queue and re-enter multiple times.
6. **Leaderboard refresh**
   - Finish match and verify ranking update visibility.

## Automated Tests
- Unit: reducers, payload validators, timer formatters.
- Integration: websocket event-to-state transitions.
- E2E: join → play → result → leaderboard.

## Suggested Commands

```bash
npm run lint
npm run test
npm run test:e2e
npm run build
```

---

## 9) Architecture & Design Decisions (for README deliverable)

- **Server-authoritative state** to prevent cheating and ensure consistency.
- **Event-driven client** using opCodes to decouple transport from UI.
- **Mode-aware matchmaking** so timed/classic use shared pipeline with clear metadata.
- **Resync-first reconnection** strategy to recover from packet loss/disconnects.
- **Progressive enhancement**: core gameplay first, then leaderboard/timer polish.

---

## 10) Project Deliverables Checklist

- [ ] Source code repository (GitHub/GitLab)
- [ ] Deployed frontend URL or mobile build artifact
- [ ] Deployed Nakama server endpoint
- [ ] README including:
  - [x] Setup & installation instructions
  - [x] Architecture and design decisions
  - [x] Deployment process documentation
  - [x] API/server configuration details
  - [x] Multiplayer testing guidance

---

## 11) Implementation Timeline (Sample)

- **Week 1:** Foundation, auth, socket bootstrap
- **Week 2:** Matchmaking, room transitions, board sync
- **Week 3:** Timer mode, result flow, leaderboard
- **Week 4:** QA hardening, telemetry, deployment docs, final demo

---

## 12) Risks & Mitigations

- **Socket instability** → exponential backoff + resync endpoint.
- **Client/server schema drift** → versioned payloads + Zod guards.
- **Timer drift on devices** → server timestamp authority.
- **Race conditions on rematch** → explicit state machine transitions.

---

## 13) Done Criteria for Frontend Assignment

The frontend is considered complete when:
1. Two users can reliably play real-time multiplayer Tic-Tac-Toe.
2. UI is responsive on mobile and shows player/match status clearly.
3. Timed mode works with server-enforced timeouts.
4. Leaderboard is visible and updated from backend records.
5. README enables another engineer to setup, run, deploy, and test quickly.

