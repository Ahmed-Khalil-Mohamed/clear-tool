# Privacy and local data

Clear Tool 2.2 has no account service, advertising SDK, analytics collector or automatic crash-report uploader.

## What stays on the PC

The app reads hardware, software registrations, drivers, selected folders, supported game libraries and network status to show its workspaces. Preferences, local shortcuts, cached update results and operation history remain in the Electron user-data directory. The portable build uses `ClearTool-Data` beside the executable. Development mode uses the ignored `work/app-data` folder.

Reports are saved only when requested through the export dialog. They may contain application inventories, device details and paths. Review or redact them before sharing. Screenshots of network panels may expose network names or addresses.

## Online requests

- WinGet communicates with its configured package sources and download hosts.
- Windows Update uses the source and policies configured in Windows.
- The Playnite catalog is requested from `https://api2.playnite.link/api/addons`; selected installation links are handed to Playnite.
- Official download/support links open in the system browser. Those services and third-party tools have their own policies.

Device artwork is bundled locally; hardware identity is not sent to a model-image lookup service. Source IP addresses and ordinary request metadata are still visible to the external services contacted for online features.

The app does not collect VPN passwords. Native Windows VPN authentication remains in Windows. No passwords or tokens should be included in issue reports.

## Public repository

Published source excludes local app data, scan exports, logs, development caches, test-session reports and personal game artwork. Public screenshots show selected application views without account names, private paths, VPN credentials or network addresses.
