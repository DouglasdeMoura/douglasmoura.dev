---
title: "chroncal Two Months In: CalDAV Accounts, Sync Hardening, and What Is Next"
slug: chroncal-two-months-in
locale: en-US
created: 2026-08-21 17:39:53.000Z
updated: 2026-08-21 17:50:39.000Z
cover: ./cover.png
tags:
  - CLI
  - Calendar
  - SQLite
---
When I [introduced chroncal](https://douglasmoura.dev/introducing-chroncal) in mid-June, it was at v0.3.x. A little over two months later it is at v0.7.12 — twenty-four releases in between, the biggest feature release so far, one enormous hardening pass, and the first bug reports from people other than me. Four of those five community issues are already fixed and shipped. This post is a recap of what changed and where the project is going.

## CalDAV accounts

The headline of v0.7.0: accounts are now a first-class concept. Until then, every remote calendar carried its own URL and its own copy of a credential — connecting ten Nextcloud calendars meant ten logins. An *account* stores one credential, discovers every collection the server exposes, and owns the calendars that come from it:

```bash
CHRONCAL_PASSWORD="…" chroncal account add "Work server" \
    --server https://cal.example.com --username alice

chroncal account calendars list "Work server"   # full inventory, refreshed
chroncal account calendars add "Work server" --all
```

`account add` imports every collection that supports `VEVENT`, `VTODO`, or `VJOURNAL` and completes an initial sync before returning. `account remove` deletes the credential and remote links but keeps downloaded calendars as local copies. Secrets are read from `CHRONCAL_PASSWORD`, `CHRONCAL_BEARER_TOKEN`, or `GOOGLE_CLIENT_SECRET`, or prompted for interactively — never accepted as a CLI flag.

Google Calendar got the better end of this: discovery now reads the Google CalendarList, so delegated, family, holiday, and subscription calendars are found — not just the primary one — behind a single sign-in. And credentials are now scoped per database in the OS keyring, so two chroncal databases on one machine no longer collide.

Upgrading needs no action: migrations `040`–`042` are additive, per-calendar `--remote-url` links still work, and no user-facing command was removed or renamed.

## A unified calendar manager in the TUI

Press `C` (or find it in the command palette) and you get the new calendar manager: an account-grouped hierarchy on the left, an inspector on the right, and metadata editing inline. A bottom **+ Add** menu offers **New Calendar…**, **Add Account…** (full browser OAuth without leaving the app), and **Import Calendar File…**. **Manage Calendars…** shows the discovered collections as a checklist — unchecking one removes its local copy after confirmation, never the remote.

The sidebar reorganized around accounts too: quiet, collapsible sections with a separate **Local** group, filled `●` and outline `○` circles to toggle visibility, and `Shift+↑`/`Shift+↓` to reorder whole account sections. Local calendars gained **Move to Account…** to transfer their contents into a remote collection. And collections a server exposes read-only are now usable: local browsing and pull-only sync, with edits rejected instead of silently lost.

## Hardening the core

v0.6.0 was a single release with more than 200 bug fixes, and it shows where the real work of a calendar tool is:

- **Sync correctness**: weak ETags handled as weak, conditional tombstone deletes, atomic conflict resolution, no more duplicate objects after prompt-mode conflicts
- **Alarms**: snooze and refire claims so overlapping checkers never double-fire, per-occurrence `DUE` anchoring for recurring todo alarms
- **iCal fidelity**: floating times exported as UTC wall clock, `VTIMEZONE` spans widened to the recurring-series horizon, `TZID` emitted on `EXDATE`/`RDATE`
- **Recurrence**: RDATE-only events, zone-skewed `EXDATE`s, multi-day instances straddling a window boundary
- **The TUI**: display-width-aware truncation everywhere, so CJK and emoji titles stop breaking the grid

v0.7.1 followed up by surfacing import warnings instead of discarding them — they now land in the status line and a log file, with the owning record named. On the performance side, distinct accounts sync concurrently while calendars within an account stay serial, and recurring override fetches are batched per master.

## Smaller additions

- `chroncal --event <id|uid>` opens the TUI focused on a given event (v0.7.7)
- `chroncal event rsvp 42 --status ACCEPTED` sets your RSVP status from the CLI, with `yes`/`no`/`maybe` aliases (v0.7.5)
- Delete **this occurrence** or **this and following occurrences** of a series (v0.7.4)
- `p` copies event details from the event view (v0.7.8)
- `W` toggles the first day of the week between Sunday and Monday, persisted like the view choice and configurable via `ui.week_start` (v0.7.11)
- `account credentials` and `account reauth` rotate basic/bearer secrets and repeat the Google OAuth flow; calendars can be hidden and shown, and sync can run for a single account (v0.7.8)

## From the community

The part I was most curious about: what would the first issues from strangers look like? Five issues, four people, and the answer turned out to be Google Calendar's CalDAV quirks.

[**#575**](https://github.com/DouglasdeMoura/chroncal/issues/575) — @dmitrydoni found that Google serves `VALARM` with `ACTION:NONE`, which chroncal's schema (`CHECK action IN ('AUDIO','DISPLAY','EMAIL')`) rejected, rolling back the whole resource transaction so initial sync could never converge. v0.7.8 now preserves foreign alarms whole, counts them in warnings, and `--clear-foreign-alarms` removes them.

[**#576**](https://github.com/DouglasdeMoura/chroncal/issues/576) — the same reporter hit Google returning stale resource hrefs that `404` on multiget; every miss counted as incomplete and the sync token was withheld forever. v0.7.9 converges despite the stale 404s. The issue was closed and the fix released about fifteen minutes later.

[**#629**](https://github.com/DouglasdeMoura/chroncal/issues/629) — @Six-VI, who very kindly called chroncal "by far the best terminal calendar I have come across", asked for a way to start the week on Monday. Shipped in v0.7.11 as the `W` toggle, again closed-to-released within the quarter hour.

[**#628**](https://github.com/DouglasdeMoura/chroncal/issues/628) — @maxandersen reported that Google `403`s the non-standard `calendar-color` PROPFIND, which aborted initial sync after the account was already created. v0.7.12 (released the next day) keeps event sync going when the color fetch fails and pushes colors through the CalendarList API instead.

[**#627**](https://github.com/DouglasdeMoura/chroncal/issues/627) — @teto asked for a Nix [home-manager](https://github.com/nix-community/home-manager) module, exposed from the flake the way khal does it. Still open, and a fair request given the project already ships a flake — Fastmail imports working out of the box was a nice bonus to read.

The repository also crossed 60 stars somewhere along the way. For a tool that promises RFC 5545 compliance, strangers stress-testing it against real-world CalDAV servers is exactly the feedback loop I hoped for.

## What is next

The list I gave in June still stands, and progress on it is honest if not fast:

- **Todos and journals in the TUI** ([#30](https://github.com/DouglasdeMoura/chroncal/issues/30)) — the biggest remaining gap and the next major focus. The CLI side is complete; the TUI still treats `VTODO` and `VJOURNAL` as second-class.
- **`.deb` and `.rpm` packages** via GoReleaser nFPM, once the primary package-manager channels stay stable.
- **The home-manager module** from #627.
- **Sync edge cases from my own list**: opportunistic push currently hard-codes server-wins and can discard a concurrent local edit ([#610](https://github.com/DouglasdeMoura/chroncal/issues/610)), plus Google sync-token and calendar-color follow-ups ([#625](https://github.com/DouglasdeMoura/chroncal/issues/625), [#634](https://github.com/DouglasdeMoura/chroncal/issues/634)).
- **A database-backed test harness for the TUI** so the edit-save chain gets regression coverage ([#601](https://github.com/DouglasdeMoura/chroncal/issues/601)).

If you tried chroncal in June, update and reconnect through `chroncal account add` — one sign-in for the whole server beats pasting URLs per calendar. If you haven't, the repository is at [github.com/DouglasdeMoura/chroncal](https://github.com/DouglasdeMoura/chroncal), and issues and contributions remain welcome.
