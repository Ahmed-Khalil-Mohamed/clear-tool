# Control center and toolkit

The 2.4 release reorganizes the home screen around current CPU/memory readings, system-drive free space, detected hardware, a health entry point, suggested next actions and a volume map. Device artwork and its exact-model/family distinctions are preserved.

The 2.4.2 tool home starts with a PC-check entry point and quick tasks for temporary files, battery reports and app updates. Search, category selection and local favorites narrow the 14 tools/workspaces. Advanced diagnostics are collapsed until needed, while Windows personalization remains available from its own entry point.

Each of the six native utilities opens a guide before running: when to use it, what to expect, three steps and one primary action. Results use plain-language summaries; original output is available under technical details. The recent-result shortcut restores the last completed utility during the session. Progress, errors, elapsed time and JSON export remain connected to the native operations.

Six executable utilities are included:

- SHA-256: stream a selected file, report byte progress, and compare a publisher's checksum. Matching a checksum does not establish trust in its publisher. Files changed during reading are rejected.
- Battery report: generate the standard Windows HTML report locally and reveal its folder. This report can include personal device history; review before sharing.
- Sleep diagnostics: display `powercfg /a` results without changing power settings.
- Physical drive health: read status reported by Windows storage providers; this is not a surface scan or a guarantee of hardware health.
- Service review: list automatic services currently stopped. Trigger-start or intentionally stopped services may be normal; this tool never starts or disables services.
- Battery snapshot: read detected battery status and charge levels. Empty data means Windows did not report a battery.

Utilities run from a fixed allowlist. No arbitrary commands are accepted from the renderer. Results can be exported as JSON. Reports remain local unless the user shares them.

Implementation references: [Microsoft powercfg commands](https://learn.microsoft.com/en-us/windows-hardware/design/device-experiences/powercfg-command-line-options), [Microsoft Get-PhysicalDisk](https://learn.microsoft.com/en-us/powershell/module/storage/get-physicaldisk).

Validation for the guided interface: 65 automated tests pass. Native Electron checks cover all six utilities, guide-before-run behavior, checksum match/mismatch/invalid input, canceled file selection, JSON export, search/category/favorites, advanced tools, keyboard focus and links to PC check and personalization. Arabic and English are checked in both themes at 760, 1024 and 1440 pixels. These checks exercise the local Windows device; they do not establish compatibility with every possible hardware configuration. Maintenance commands that change Windows are not executed by these tests.
