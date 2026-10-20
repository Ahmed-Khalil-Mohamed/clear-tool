# Downloads and verification

Open **Apps & drivers → Downloads & verification**. Six Windows tools are mapped to fixed IDs in the WinGet community repository: PowerToys, Lively Wallpaper, Rainmeter, Windhawk, Flow Launcher and Twinkle Tray. Official-site links remain available and are labeled as website actions, not completed downloads.

Review reads live WinGet metadata and produces a short-lived preview. Installation pins the reviewed version and exact package ID. The installer still requires confirmation and may request Windows elevation or additional agreements. No hash, compatibility, or security checks are bypassed. Unsupported/localized metadata that cannot be parsed is rejected instead of guessed. The source website is the fallback.

App upgrades use the same engine. Update scans expire after 15 minutes. A completed command is followed by an exact-ID installed-version query. Only matching versions are marked verified; missing or different versions are shown as needing verification. A restart or delayed registration can prevent immediate verification even if the installer finished. There is no automatic retry, batch update, or reboot.

The download history shows review, running, verifying, verified, unverified, failed, interrupted and cancelled outcomes. The latest 30 operations are retained locally, with up to 64 KiB of log text per operation. Interrupted operations are recovered as interrupted, never automatically retried. Verify again only reads the installed version; it does not rerun an installer. Results can be filtered and exported. A preview identifies an already-installed matching version and blocks redundant installation; an older detected version uses an upgrade.

Download progress and speed use reported byte counts; remaining time is omitted when it cannot be estimated. Reset transfers reset their estimates. Installer success text alone does not produce verified status.

Windows Update continues to discover compatible system/driver packages. Cached results are identified, partial results remain partial, and installation stays in Windows Update where users review optional drivers. This is not a universal vendor-driver updater.

Validation: 54 automated tests passed. Real read-only WinGet queries resolved all six IDs and their versions. Native Electron tests covered package search, a real PowerToys preview, cancellation before installer execution, navigation, English/light and Arabic/dark at 820 pixels. A separate restart test verified interrupted-operation recovery, read-only version rechecks, log export, history filtering and retention of both download history and an actual eight-check health report. Successful/failed installation and verification outcomes were tested with injected runners; no actual programs or drivers were installed during these tests.

Local release verification: the 2.4.0 installer and portable builds completed successfully. Packaged backend and renderer files match the tested sources. The actual portable executable extracted and opened successfully, with all six catalog entries, clean-profile history, English/light and Arabic/dark at 820 pixels, and no observed renderer errors. SHA-256 checksums are included beside the local executables. The installer was built but not installed during validation.

References: [Microsoft WinGet install](https://learn.microsoft.com/en-us/windows/package-manager/winget/install), [Microsoft WinGet list](https://learn.microsoft.com/en-ca/windows/package-manager/winget/list).
