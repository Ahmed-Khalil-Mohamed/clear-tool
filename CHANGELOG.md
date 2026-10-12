# Changelog

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
