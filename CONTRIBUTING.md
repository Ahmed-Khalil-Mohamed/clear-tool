# Contributing to Clear Tool

Thanks for helping make everyday Windows maintenance easier to understand. Small, focused changes with clear reproduction steps are easiest to review.

## Development

Use Windows x64, Node.js 22 LTS (22.12 or later), npm and Git. Clone the repository, run `npm ci`, then `npm test` and `npm run build`. Run `npm start` for native Windows data. For frontend hot reload, start `npm run dev`, then set `$env:CLEAR_DEV_URL='1'` and run `npm start` in another PowerShell terminal.

| Path | Purpose |
| --- | --- |
| `src/` | React views, styles, localization and device presentation |
| `electron/` | Main/preload processes, local inspection and bounded system operations |
| `shared/` | Integration catalog and English translations |
| `tests/` | Node tests for parsing, policy, localization and filesystem behavior |
| `public/`, `assets/` | Bundled visual assets, icons and license notices |
| `docs/` | Guides, release notes and publication media |

## Before opening a pull request

1. Describe the user-visible problem and the resulting behavior.
2. Run `npm test` and `npm run build`.
3. For UI changes, check Arabic/English, light/dark and window widths of 768, 1024 and 1440 pixels. Include screenshots with personal details removed.
4. For Windows operations, test parsing and failure/cancellation paths. Do not run destructive maintenance on an unrelated machine as a test.
5. For native packaging changes, run `npm run package` on Windows and verify the packaged executable.

Keep arbitrary shell commands out of the renderer API. Validate IPC arguments, retain confirmation for irreversible cleanup and privilege-sensitive changes, and report partial/error states honestly. Do not replace measured progress with a simulated percentage.

Do not commit `.env` files, tokens, local settings, exported inventories, network details, logs, game files, BIOS or downloaded vendor installers. The repository ignores `work/`, `dist/`, `release/`, `node_modules/` and local application data.

## Scope and compatibility

Report which Windows version and hardware family you actually tested. Fixtures are useful but do not establish physical compatibility. Network focus/QoS, OEM support pages and emulator integrations need particularly clear capability limits.

Contributions are accepted under the project's MIT license. Third-party code and assets must retain their original notices and terms; vendor photographs and trademarks are not relicensed by the project's MIT license.
