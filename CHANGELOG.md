# Changelog

## 2.4.2 — Guided tools, device health and reliable downloads — 2026-10-20

- Task-focused tool home with a PC-check starting point, three quick tasks, compact tool rows, search, categories and favorites.
- Six native tools now open a dedicated guide before running: purpose, expected output, three simple steps and one primary action.
- Plain-language battery, drive and service summaries; file comparison has explicit match, mismatch and invalid-input states. Original evidence stays available in collapsed details.
- Progress, elapsed time, last result, export and error details remain available without crowding the interface. Advanced diagnostics are grouped separately.
- Arabic/English and light/dark layouts verified at 760, 1024 and 1440 pixels; keyboard focus returns to the selected tool. This public release includes the previously local 2.4.0 and 2.4.1 improvements below.

## 2.4.1 — Performance and tool reliability (included in 2.4.2)

- Faster reopening through a validated inventory snapshot with visible background refresh, timestamp and failure recovery; game discovery no longer blocks startup.
- Network monitoring and hidden-window sampling pause when unused; driver-update scans and specialist workspaces load on demand.
- Refined sidebar, readable tool cards, structured results, compact activity tracking and keyboard focus states in Arabic/English and light/dark.
- Utility results survive navigation; exports capture the displayed result even when another tool completes. Health reports update across navigation.
- Throttled file-scan progress, checks for changing duplicate candidates, and unknown status for incomplete diagnostics.
- 65 automated tests, six native utilities and a 17-workspace smoke test. See [performance and verification notes](docs/PERFORMANCE.md) for measured startup times and testing scope.

## 2.4.0 — Device health (included in 2.4.2)

- Retain the last 30 download operations and latest health report across restarts; interrupted work requires review rather than automatic retry.
- Read-only version rechecks, per-operation exports, history filters, installed-version previews and redundant-install prevention. 54 automated tests pass.

- Downloads & verification workspace: six exact-ID tool packages, live metadata review, pinned versions, shared install/upgrade lock and installed-version verification.
- Installation success, unverified completion, failure and cancellation are separate results; update scans and previews expire.
- Fixed decimal-comma progress, restarted transfer estimates, numeric firewall status, invalid memory readings and cached Windows Update labeling.
- Refined update, driver and integration layouts; website actions no longer imply completed downloads. See [downloads guide](docs/DOWNLOADS.md).

- Rebuilt the home control center and application shell, with live metrics, device artwork, health access, recommended actions and storage map.
- Added a searchable toolkit with categories, favorites and six new local utilities: SHA-256 comparison, battery report, sleep diagnostics, physical drive status, service review and battery snapshot.
- Tool results support JSON export; native tool and responsive interface checks passed. See [control center guide](docs/CONTROL-CENTER.md).

- Dedicated sidebar workspace for eight staged, read-only Windows health checks, evidence, attention filters and JSON export.
- Integrated confirmed SFC, DISM and DNS maintenance commands with result inspection and rescanning.
- Responsive English/Arabic, light/dark interface with actual completed-check progress and elapsed time.
- Failed or inaccessible probes remain unavailable. Firewall numeric enum values are handled correctly.
- Native restart tests verified report retention, interrupted-download recovery, version rechecks, exports and history filtering. See [health center guide](docs/HEALTH-CENTER.md) for scope and validation.

## 2.3.0 — Device Atlas

### Added

- Offline device atlas: 42 manufacturer entries, 110 family matching rules and 25 bundled illustrations (14 new).
- Search by brand/family, form-factor filters, manual artwork selection and automatic reset from the Overview page.
- Twelve component categories, with actual Windows inventory for available CPU, GPU, memory, motherboard, storage, display, network, audio and battery data. Cases, cooling and power supplies are explicitly marked unavailable when the inventory cannot identify their models.
- A complete [coverage inventory](docs/DEVICE-ATLAS.md), image-generation provenance and reference-brand lists.

### Improved

- Device detection uses enclosure type, SystemFamily and product version, including Lenovo machines with opaque model codes.
- Distinct illustrations for additional gaming/business laptops, all-in-ones, detachables, rugged laptops and workstations.
- Artwork selection preserves detected hardware identity; the exact ASUS FA607NUG photograph remains a separate verified view.
- Bilingual, light/dark catalog with keyboard dismissal and responsive layouts.

### Verification and scope

37 automated tests passed. Windows 11 x64 packaged checks covered atlas filtering, all 25 bundled images, manual selection, component inventory, language/theme changes and automatic reset without renderer errors. Family coverage uses fixtures; these are not 110 physically tested models. No claim of universal model coverage or exact teardown imagery.


## 2.2.0 — First public release

### Added

- Live Playnite add-on catalog with search, category filters and installation handoff.
- Compatible Windows Update discovery, including driver packages, with check timestamps and cache/error states.
- Measured WinGet download progress through ConPTY and Windows taskbar progress.
- Exact-model ASUS FA607NUG exterior photo with a separate illustrative exploded view.

### Improved

- Driver and update workspaces, application version comparison and operation presentation.
- Sidebar organization, Arabic/English, light/dark and responsive layouts.
- Playnite fullscreen integration, emulator linking, local game shortcuts and Windows customization tools.
- Background/tray behavior, startup settings and shortcuts widget preferences.

### Included from earlier local builds

- Hardware/software/runtime inventory, reviewed cache cleanup and storage analysis.
- Game-library discovery, covers, favorites and ClearPlay fullscreen mode.
- Network monitoring, native Windows VPN management and advanced Windows network controls.
- Windows repair launchers, security status, startup entries and operation history.

### Verification and limits

32 automated tests passed during release preparation, plus native Windows 11 x64 packaged startup/restart checks. Actual Windows Update discovery and a download-only WinGet transfer were checked. A controlled progress fixture verified the 50% UI/taskbar state; this was not a real app upgrade. Other hardware families have fixture coverage, not universal physical testing. No production VPN connection or live QoS/Firewall policy test is claimed.
