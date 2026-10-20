# Device health center

Open **Device health** in the sidebar, then **Run full scan**. Eight read-only checks inspect volume free space and reported health, memory pressure, Windows protection/restart state, PnP errors, startup entries, legacy DirectX libraries, connected adapters and recent System log errors. Each probe has a 45-second timeout; failed probes are unavailable, never passed. Progress counts completed probes rather than estimating an arbitrary percentage of time remaining.

Results are a snapshot, not a hardware certification or malware scan. Details include evidence, elapsed probe duration and a route to related tools. A disabled device, missing legacy library or historical event may be expected. Review the context before taking action. No scan changes settings or deletes files.

The repair workbench connects the existing confirmed DISM ScanHealth, DISM RestoreHealth, SFC and DNS cache commands. Elevated Windows repairs still require Windows approval. Completion is based on the existing process result; rerun the scan to check the resulting state. Do not assume an exit code of zero guarantees every underlying issue is resolved.

The latest completed report is retained locally across app restarts and shows its original scan time. Export saves that report as JSON to a chosen location. It may include device names, network adapter names and event providers; review before sharing. Full reports are not uploaded automatically. The local activity log stores check IDs and statuses.

## Validation

Automated checks cover low space, unhealthy volumes, missing protection evidence, device errors and continued scanning after probe failures. Native Electron testing ran all eight probes on Windows and checked English/light, Arabic/dark, and an 800-pixel window without renderer errors or horizontal overflow. Repair commands were not executed during UI tests.
