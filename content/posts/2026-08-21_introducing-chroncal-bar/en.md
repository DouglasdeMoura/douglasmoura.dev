---
title: "Introducing Chroncal Bar: Your Calendar in the Omarchy Menu Bar"
slug: introducing-chroncal-bar
locale: en-US
created: 2026-08-21 18:01:01.000Z
updated: 2026-08-21 18:16:30.000Z
cover: ./cover.png
tags:
  - CLI
  - Calendar
  - Omarchy
---
Two months after [releasing chroncal](https://douglasmoura.dev/introducing-chroncal), my terminal-first calendar manager, one gap kept bothering me: the answer to "what is my next meeting?" required opening a terminal. If you run [Omarchy](https://omarchy.org/), the menu bar is always on screen — so that is where the calendar should live. Today I am releasing [Chroncal Bar](https://github.com/DouglasdeMoura/chroncal-bar), an Omarchy Quattro bar widget powered by chroncal. It shows the current or next event at a glance, and opens into a full agenda panel that can create, edit, delete, and RSVP events without leaving the bar.

It is written in QML, running inside Omarchy's Quickshell host, and it treats chroncal as the single source of truth: all data flows through the chroncal CLI, never around it.

## The bar

The widget itself is intentionally quiet:

- Shows every overlapping current event, or the next upcoming one
- Relative labels near an event (`in 5m`, `12m left`) and explicit weekday labels for later ones (`Mon 09:00`)
- Your chroncal calendar colors on the label, agenda, and progress indicator
- Hides itself entirely when no visible event remains in the configured window
- Left click opens the agenda, middle click opens the next event's URL, right click refreshes

All-day, overlapping, in-progress, and upcoming events are all handled. When nothing is within the lookahead window, the bar takes zero pixels — no idle icon, no noise.

## The agenda panel

Left click and the panel opens: events grouped under Today, Tomorrow, and later dates, with search across titles, descriptions, locations, calendar names, and participants. Selecting an event shows date, location, notes, conferencing links, attendees with RSVP state and the organizer, and URLs in notes become clickable links. Google Meet links open as the calendar owner account (`authuser`), and locations get a one-click maps link.

The panel is not read-only. It creates, edits, and deletes events through chroncal — omitted fields are preserved on edit, unchanged times are never reinterpreted, and deletes ask first. Recurring events get real treatment: the panel loads the whole series for generated occurrences, edits stored overrides as that override only, and deleting offers this event, this and following, or all events. If the calendar owner is an invited attendee, a Going control answers Yes, Maybe, or No — backed by `chroncal event rsvp`.

The keyboard language mirrors the chroncal TUI:

| Key | Context | Action |
| --- | --- | --- |
| `↑`/`↓`, `j`/`k` | Agenda | Move selection |
| `←`/`→`, `h`/`l` | Agenda | Previous or next day |
| `t` | Agenda | Jump to today's first event |
| `/` | Agenda | Search |
| `c` / `e` / `x` | Agenda or details | Create / edit / delete |
| `v` | Event details | Join or open event URL |
| `p` | Event details | Copy event details |
| `g` | Event details | Open this event in the chroncal TUI |
| `y` / `n` / `m` | Event details | RSVP yes, no, maybe |
| `C` or `,` | Agenda | Open settings |
| `Esc` or `q` | Any view | Back or close |

## Calendars and accounts without leaving the bar

The Settings panel includes a full calendars manager: accounts grouped with their nested calendars, create and hide calendars, set the default, owner email, per-calendar sync, and discovery of remote collections. You can add CalDAV accounts — password, bearer token, or Google OAuth — and import iCal files from inside the bar. An account with sync trouble offers a reset of one calendar's sync state, and conflicts resolve with Keep local or Keep server.

One distinction worth knowing: *included calendars* filter what the bar shows, while *hide* is a chroncal flag — hidden calendars keep their events but leave the agenda, and Settings still lists them so they can come back.

## Secrets stay secrets

Account passwords, bearer tokens, and OAuth client secrets are never stored in the widget's settings file (`~/.config/omarchy/shell.json`) and never appear in `argv`, logs, or process listings — they are passed as process environment to the single chroncal command that needs them. This is the same discipline chroncal itself follows, carried through to the bar.

## Installation

Requirements: Omarchy Quattro, chroncal 0.7.4 or newer on `PATH`, and the usual Wayland toolbox (`bash`, `jq`, GNU `date`, GNU `timeout`, `wl-copy`, `notify-send`, `xdg-open`). The newest chroncal release covers everything the bar uses, including RSVP and account setup:

```sh
mise use -g github:DouglasdeMoura/chroncal
```

Then install the plugin:

```sh
omarchy plugin add https://github.com/DouglasdeMoura/chroncal-bar.git --enable
omarchy bar move douglasdemoura.chroncal-bar --section right --after omarchy.tray
```

The second command is optional — it places the widget beside the tray in the right-aligned bar group.

## Configuration

Open the agenda and press `C`, or click the settings cog. You get days ahead (1–30), refresh interval, maximum bar-title length, the relative-countdown window, included calendars, all-day and no-participant filters, and events without a location or meeting link. Settings persist on the widget entry in `~/.config/omarchy/shell.json` and can also be set from the command line:

```sh
omarchy bar set douglasdemoura.chroncal-bar interval 60
omarchy bar set douglasdemoura.chroncal-bar lookaheadDays 7
```

## How it runs

The plugin runs inside Omarchy's long-running Quickshell process with your user permissions. A QML timer starts a one-shot agenda helper at the configured interval; the helper emits one normalized JSON document and exits. The plugin does not spawn another Quickshell process, install packages, request elevated privileges, or run remote installers. Chroncal remains the source of truth — the bar calls its CLI to read data and to perform explicitly requested actions, and chroncal's optional background service stays entirely separate.

This is deliberately menu-bar parity, not a replacement for the TUI. Timezone-sensitive time changes, alarms, free/busy, and the sync service remain in chroncal — and `g` in the panel jumps straight from any event to the full TUI.

The repository is at [github.com/DouglasdeMoura/chroncal-bar](https://github.com/DouglasdeMoura/chroncal-bar), MIT-licensed, with issue templates and tests (QML model tests plus shell-level agenda tests). If you run Omarchy and chroncal, two commands get you the next meeting on your bar. Issues and contributions are welcome.
