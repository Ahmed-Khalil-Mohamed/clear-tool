# Clear Tool 2.1 integration sources

Verified official references for catalog and launch behavior:

- Playnite command line: https://api.playnite.link/docs/manual/advanced/cmdlineArguments.html — `--startfullscreen` and `--startdesktop`.
- Playnite themes and extensions: https://playnite.link/addons.html — installation and configuration remain in Playnite.
- PPSSPP: https://www.ppsspp.org/download/ and https://www.ppsspp.org/docs/reference/command-line/
- Dolphin: https://dolphin-emu.org/download/ and https://raw.githubusercontent.com/dolphin-emu/dolphin/master/Source/Core/UICommon/CommandLineParse.cpp — `--exec` accepts the game path.
- PCSX2: https://pcsx2.net/downloads/ and https://raw.githubusercontent.com/PCSX2/pcsx2/master/pcsx2-qt/QtHost.cpp — `--` separates the filename.
- RetroArch: https://www.retroarch.com/?page=platforms
- xemu: https://xemu.app/ — original Xbox.
- PowerToys: https://learn.microsoft.com/windows/powertoys/
- Lively: https://www.rocksdanister.com/lively/
- Rainmeter: https://www.rainmeter.net/
- Windhawk: https://windhawk.net/
- Flow Launcher: https://www.flowlauncher.com/
- Twinkle Tray: https://twinkletray.com/
- Windows application IDs: https://learn.microsoft.com/en-us/windows/configuration/store/find-aumid

No remote plugin code runs inside Clear Tool. Catalog actions open allowlisted official URLs, native Windows settings, or a detected/user-selected local executable. Store app launch IDs come from Windows inventory. Launch arguments use `shell:false`. ROM imports reference files in place. Playnite addon discovery reads bounded manifests and does not install them.

Version 2.2 catalog and updates:

- The official web catalog's JavaScript (`https://playnite.link/js/addons.js`) identifies `https://api2.playnite.link/api/addons` as its data endpoint. Clear Tool reads this bounded JSON response and renders names/descriptions as text.
- Installation URI documentation: https://github.com/JosefNemec/PlayniteAddonDatabase/blob/master/README.md — selected known IDs become `playnite://playnite/installaddon/<encoded ID>`. Playnite handles installation.
- Windows Update search: https://learn.microsoft.com/en-us/windows/win32/api/wuapi/nf-wuapi-iupdatesearcher-search — `IsInstalled=0 and IsHidden=0`, using the configured update source.
- Driver metadata: https://learn.microsoft.com/en-us/windows/win32/api/wuapi/nn-wuapi-iwindowsdriverupdate
- WinGet native terminal transport: https://github.com/microsoft/node-pty — ConPTY prevents WinGet's redirected-output behavior from suppressing download progress. No shell command string is assembled; executable arguments are separate.
- Download-only test: https://learn.microsoft.com/windows/package-manager/winget/download — a 7-Zip installer was downloaded into the project's `work/` folder to verify actual progress. It was not installed.
