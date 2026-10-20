# Using Clear Tool

## Updating to 2.4.2

Quit Clear Tool from its tray menu, then run the 2.4.2 installer for the same installation. For portable use, put the new executable beside the existing `ClearTool-Data` folder. Keep that folder; it contains your settings. A backup before upgrading is recommended. Clear Tool does not download or install its own updates automatically.

Open **Overview → Device catalog & components** for the new atlas. Artwork selection changes the picture only, not detected hardware.


[العربية](USER-GUIDE.ar.md) · [Home](../README.md)

## First launch

Download the installer or portable executable from [Releases](https://github.com/Ahmed-Khalil-Mohamed/clear-tool/releases/latest). The startup screen reads hardware, installed programs and gaming runtimes. Allow it to finish; use Retry if Windows returns an error. Offline inventory works, while online catalogs and update checks need connectivity.

In **App settings**, choose Arabic/English and light/dark. Settings save automatically. Closing the window may keep the app in the system tray when background mode is enabled; use the tray menu to quit completely. Start with Windows and the shortcuts widget are optional settings. The widget is a normal utility window, not an Explorer desktop replacement.

## Guided tools, health and downloads

Open **Tools & add-ons** and choose a task. Search, categories and favorites narrow the library; advanced diagnostics are grouped separately. Native tools open a guide before running. Read the purpose and expected output, run the primary action, then review the result. Original evidence is under **Show technical details**; use **Save result as a file** for JSON export. The latest utility result remains available during the session. [Tool details](CONTROL-CENTER.md).

Open **Device health** for eight read-only checks. Review findings and evidence before selecting a repair action. The latest report survives restart. [Health guide](HEALTH-CENTER.md).

Open **Apps & drivers → Downloads & verification** to review one of six Windows-tool packages before installing/upgrading it. Check the final installed-version verification, not just download completion. The latest 30 operations are retained, with version rechecks and export. [Downloads guide](DOWNLOADS.md).

## Review and clean cache

1. Open **Clean storage → Cache** and scan.
2. Read each category and its size. Select only the categories you want to clear.
3. Review the native confirmation, then confirm cleanup.
4. Check the result: removed bytes, skipped files and failures are recorded.

Only the reviewed files in defined cache roots are considered. The preview expires after 15 minutes. Changed files, links, junctions, locked files and files outside the reviewed root are skipped. Windows temp files must be older than 48 hours; crash reports and NVIDIA download packages have a 24-hour minimum. Developer caches have their own process checks where implemented.

Deletion is permanent, not a move to the Recycle Bin. Caches may be rebuilt or downloaded later. Logical byte totals can differ from physical disk space recovered. Personal documents, photos, games, registry keys, DriverStore and WinSxS are not cleanup targets.

**Storage/duplicates:** choose a folder to inspect. Large folders are scanned with explicit limits; truncated results are partial. Duplicate comparisons use SHA-256 with file/count/byte limits. There is no automatic duplicate deletion or partition resizing.

## Applications and updates

The inventory combines registered Windows applications and Microsoft Store entries. Portable/unregistered apps may need manual linking, and some installers do not record a usable path.

Open **Apps & drivers → Updates**, check WinGet and review each available version. Upgrade one application after confirmation. Clear Tool shows measured download progress, then a separate installation stage. If the underlying command gives no measurement, the indicator remains indeterminate. The Windows taskbar also reflects progress. An estimate appears only when sufficient measured progress exists.

WinGet does not match every installed application. A missing match is not proof that an app is current. Read the command result on failures. Clear Tool does not silently upgrade all apps or reboot Windows. Updating Clear Tool itself is currently a manual download from GitHub Releases.

## Drivers and Windows Update

Open **Apps & drivers → Drivers**. The installed tab is a local signed-driver inventory. The available tab queries the Windows Update source configured on the PC. Results include the last check, update type and package details, with partial/error states when applicable. Cached results are reused for up to 15 minutes; use refresh for a new scan.

**Review and install** opens Windows Update, where you choose the update and handle restart requirements. Clear Tool itself does not install Windows/driver packages. Manufacturer links offer another official support route. No available update is inferred merely from a driver's date; OEM packages outside the configured source may not appear.

## Games, Playnite and emulators

The game library reads supported Steam/Epic manifests and Windows registrations. A listed game with an unavailable path is not claimed to be playable. Add a local EXE/shortcut, link a missing launch path or choose custom artwork. ClearPlay provides fullscreen browsing, keyboard navigation and standard gamepad input.

In **Simulations**, link Playnite if it is not detected. Choose Desktop or Fullscreen. The live add-on tab supports category filters and search; **Install via Playnite** opens the selected official catalog entry in Playnite's handler. Finish download, installation and activation there. Clear Tool does not execute community add-on code itself.

Link PPSSPP, Dolphin, PCSX2, RetroArch or xemu through an existing executable or official download page. Local game files can be added as shortcuts; supported direct launch paths are provided for PPSSPP, Dolphin and PCSX2. Configure cores, controllers and any required BIOS in the emulator. Removing a library shortcut does not delete the game file. No games, ROMs, BIOS or emulators are bundled.

## Network and VPN

Adapter rates describe interface traffic, including LAN traffic; they are not an Internet speed-test result. Per-process TCP counts are connection counts, not bandwidth measurements. Wi-Fi details depend on Windows permissions, locale and the driver.

VPN controls work with existing native Windows VPN profiles. Authentication continues in Windows. Third-party VPN apps can be detected/opened, but their tunnel state is not inferred. Clear Tool does not provide a VPN server or subscription.

Advanced upload limits use Windows QoS for a chosen executable and require supported Windows policy features and administrator approval. They are temporary and do not provide per-app download limits or router priority. A timed focus session can block selected executables through dedicated Windows Firewall rules; it is not automatic traffic prioritization. Keep your game and VPN out of that selection. Only Clear Tool's own rules are targeted for cleanup. Actual QoS/Firewall changes and live VPN authentication were not exercised on a production connection during release verification.

## Tools, repair and history

Tools links installed productivity/customization apps and their official downloads. Windows settings shortcuts open the corresponding Windows screen. SFC/DISM repair uses native elevated Windows tools. Starting a tool does not mean repair succeeded: review its final status and transcript. Exiting Clear Tool stops its monitoring, not an external repair process already running.

The local history tracks operations. A report export may contain installed applications, hardware and paths. Review it before attaching to an issue.

## Verify a download

Download `SHA256SUMS.txt` from the same release and compare the relevant line with:

```powershell
Get-FileHash -Algorithm SHA256 .\Clear-Tool-Setup-2.4.2.exe
```

For the portable file, substitute its filename. A checksum detects a mismatch with the uploaded artifact; it is not a publisher signature.

## Troubleshooting

| Symptom | Try this |
| --- | --- |
| WinGet is unavailable | Install/update Microsoft's App Installer, then reopen Clear Tool. |
| Playnite installation button cannot open | Open Playnite once, confirm its protocol is registered, or relink its executable. |
| Game name appears but will not launch | Check whether its drive is connected and link the correct executable. |
| Cleanup skips files | Close the owning app and rescan; locked/changed files are intentionally skipped. |
| Update scan fails | Check connectivity and the Windows Update service/policies; inspect the error before retrying. |
| Closing the app leaves it running | Quit through the tray menu or disable background mode in settings. |
| Artwork differs from the exact hardware | Most device portraits are family illustrations. Choose another in settings; actual specifications remain unchanged. |

For a reproducible bug, include the app version, Windows version, reproduction steps and a screenshot with personal details removed. Never post VPN credentials, tokens or private files.
