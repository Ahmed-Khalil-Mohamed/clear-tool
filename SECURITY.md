# Security policy

The current 2.2.x line is the active release line. There is no independent security audit or guaranteed response-time commitment.

Please do not publish credentials, personal exports or working exploit details in a public issue. Use the repository's **Security → Report a vulnerability** option when available. If private reporting is unavailable, open an issue asking for a private reporting channel without disclosing the vulnerability details.

Include the affected version, Windows version, impact and a minimal reproducible case. Screenshots and reports should omit private paths, account identifiers, network addresses and tokens.

Clear Tool performs privileged Windows actions only through the intended confirmation/elevation flows. Code review should pay special attention to IPC validation, file-root boundaries, symlink/junction handling, command argument construction, external URL allowlists and native update output.
