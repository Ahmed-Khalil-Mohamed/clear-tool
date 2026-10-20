# Performance and reliability — included in 2.4.2

The workspace can open from a validated local inventory snapshot, then refresh Windows data in the background. A visible notice distinguishes the saved snapshot from current results, preserves its timestamp, and offers retry when refresh fails. Snapshots older than seven days, with invalid data, or from a different computer/account are discarded. Concurrent refresh requests share one read. Cache contents are never used to authorize cleanup or app updates; those flows still require their own fresh review.

Game discovery runs when the library is requested, rather than delaying startup. The network watcher runs only while its workspace is visible and stops when the page is left or hidden. Traffic totals count observed intervals; they do not include time when monitoring is paused. CPU/RAM sampling also pauses when the application is hidden. Driver-update discovery starts when its updates tab is opened or the user requests a scan, rather than whenever the installed-driver list is viewed. Toolkit, delivery and health views load on demand.

Directory scan progress is throttled to avoid flooding the renderer with empty-folder events. Duplicate candidates are checked against their discovery metadata and checked again after hashing; changed files are excluded. Diagnostic results with missing disk, memory or runtime evidence remain unknown.

Utility results and errors are retained during navigation in the current app session. Results show elapsed execution time, readable tables or command evidence, and explicit empty states. Export captures the selected result before opening the save dialog, preventing a concurrently completed tool from replacing its contents. Health reports broadcast completion when scanning continues across navigation. The latest health report and download history remain persisted across app restarts.

## Local measurements

Measurements were taken on the development Windows laptop, from process launch to the home workspace. They are single observations under varying machine load, not a statistical benchmark or a promise for every PC.

| Run | Time to workspace | Data displayed |
| --- | ---: | --- |
| Previous 2.4.0 source build | 22.5 s | Fresh inventory; waited for game discovery |
| 2.4.1 without a saved snapshot | 20.3 s | Fresh inventory |
| 2.4.1 with a saved snapshot | 4.6 s | Saved inventory, followed by live refresh |

A repeat after adding computer/account validation measured 20.1 s without a snapshot and 3.8 s with a matching snapshot. A different machine/account is covered by a fixture test and forces a fresh read.

## Verification

- 65 automated tests cover file operations, cache expiry and corruption, refresh coalescing, network-monitor lifecycle, utility state, export races, incomplete health evidence, package identity/version checks, downloads, integrations, and existing behavior.
- Native Electron checks exercised all six local utilities against Windows, checksum comparison and export, navigation away during a running utility, all eight health probes, and health-report retention after restart.
- Navigation smoke checks covered 17 workspaces. Home, toolkit, delivery and health layouts were checked in Arabic/dark and English/light at 760, 1024 and 1440 pixels, without observed renderer errors or horizontal document overflow.
- All 12 Windows-settings shortcuts were verified through the actual IPC handlers with external opening intercepted. The four repair actions were checked through cancellation at their confirmation dialog. Network monitoring was verified to remain dormant before use and stop after leaving its page.

Read-only queries ran on this laptop. Actual repair commands, software/driver installation, network restrictions and deletion of user files were not executed during these UI tests. Their guarded paths have automated coverage; this is not universal compatibility certification. These improvements are included in the public 2.4.2 release.

Final delivery: both 2.4.1 executables built successfully, with SHA-256 checksums alongside them. Packaged backend modules and renderer chunks match the tested source. The actual portable executable extracted and launched successfully, opened the six-package catalog and toolkit, and passed English/light and Arabic/dark checks at 820 pixels without observed renderer errors. The installer was built but not installed during validation. `Start Clear Tool.cmd` now points to 2.4.2. The 2.4.2 portable also passed extraction, startup and guided-tool checks.
