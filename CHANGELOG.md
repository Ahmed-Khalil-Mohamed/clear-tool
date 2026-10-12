# Changelog

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
