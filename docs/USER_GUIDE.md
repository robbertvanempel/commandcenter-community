# Command Center User Guide

Command Center is a local-first dashboard for The Future Community. It brings public industry signals, exact brand mentions, newsletter intelligence, audience totals, reminders, tasks, and an optional private Daily Brief into one interface.

The application runs on your own computer. A fresh installation contains no names, accounts, API keys, or demo records.

## 1. Requirements

- Node.js 24.19 or newer
- npm
- Git, unless you download the repository as a ZIP file
- A modern desktop browser

AI, Gmail, and private connector integrations are optional. The core dashboard works without them.

## 2. Install and launch

Open a terminal and run:

```bash
git clone https://github.com/robbertvanempel/commandcenter-community.git
cd commandcenter-community
npm run launch
```

The launcher installs the locked dependencies when necessary, builds the application, starts a loopback-only server, waits for its health check, and opens `http://127.0.0.1:3000`.

Keep the terminal open while you use Command Center. Press `Ctrl+C` in that terminal to stop it.

Useful alternatives:

```bash
npm run launch -- --no-open
npm run launch -- --port=3001
```

## 3. Configure the dashboard

Open **Settings** from the top-right corner. Configure only the areas you want to use, then save your changes.

### General

Change the workspace name shown in the header. The default is **Command Center**.

### Industry

Add public homepages or RSS/Atom feeds that matter to your work. Optional topic phrases widen discovery, while exclusions reduce noise. Each source is checked independently.

The first sitemap scan creates a quiet baseline. Later scans can surface newly discovered pages. A blocked homepage does not prevent feed or sitemap discovery when another public route is available.

### Mentions

Add complete names, brand phrases, unique handles, and official websites. Use identity anchors such as roles, products, locations, or collaborators to distinguish common names. Add recurring false-positive contexts to the negative list.

Keep strict mode enabled when precision matters. Search results are treated as discovery only; Command Center verifies identity evidence on the canonical page before presenting a result as a confirmed mention.

### Audience

Add the exact public profile URL or handle for each account you want to track. Supported platforms are YouTube, X, Instagram, Facebook, LinkedIn, Threads, and TikTok.

Public totals are best effort because platforms can change or block signed-out access. An unavailable check is never displayed as zero. Growth appears only after a comparable verified reading from 24–36 hours earlier exists.

### AI curation

Choose a cloud provider—OpenAI, Anthropic, Gemini, or Grok—or connect a running local model through LM Studio or Ollama. You may save a provider key in Settings or define it in `.env.local`.

```bash
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GEMINI_API_KEY=
XAI_API_KEY=
```

Selecting a provider is a separate action from storing its key. Command Center does not call an unselected provider. Cloud usage can incur provider charges.

For a local model, start LM Studio or Ollama first, load a supported text model, then use **Reload models** in Command Center. Only numeric loopback endpoints are accepted. Command Center does not install, download, or load models for you.

### Newsletters

Newsletter intelligence requires both a read-only Gmail connection and a configured AI model.

1. Create or select a project in Google Cloud Console.
2. Enable the Gmail API and configure the OAuth consent screen.
3. Create a **Web application** OAuth client.
4. Copy the exact redirect URI shown in **Settings → Newsletters** into that client.
5. Paste the client ID and secret into Command Center.
6. Save and choose the Gmail account.

Command Center requests `gmail.readonly`. It does not send, label, delete, mark as read, or archive email. Dashboard archive state is local. Email addresses and subscriber-specific tracking URLs are masked before newsletter text is sent to the selected AI provider.

### Daily brief

Choose how many Industry, Mention, and Newsletter stories appear on **Today**. Each section can show 1–10 stories or be disabled. Opening Today uses saved collector snapshots and does not start additional AI, web, or Gmail calls.

### Integrations

The optional connector bridge accepts minimized summaries from a user-approved Codex automation or another local script. Adding a source label does not connect or authorize an app.

For the complete JSON contract and ingest command, see [Connector Bridge](CONNECTOR_BRIDGE.md).

## 4. Daily workflow

1. Start Command Center with `npm run launch`.
2. Open **Today** for the saved daily snapshot and setup health.
3. Use **Refresh** when you want collectors to check for new public information.
4. Review full queues under **Industry**, **Mentions**, and **Newsletters**.
5. Archive items you have handled. Archived items remain out of the active queue.
6. Turn useful mentions into reminders and manage work under **Tasks**.
7. Review **Audience** after enough verified history exists for a real comparison.

Collectors also run shortly after startup and every 15 minutes while the application remains open.

## 5. Local data and privacy

Command Center binds to `127.0.0.1` and rejects foreign Host and Origin headers. It has no account login. Do not expose it to a LAN or the public internet without authentication and a separate security review.

Default data locations:

| Platform | Directory |
| --- | --- |
| macOS | `~/Library/Application Support/Command Center` |
| Windows | `%LOCALAPPDATA%\Command Center` |
| Linux | `${XDG_DATA_HOME:-~/.local/share}/command-center` |

To use another absolute directory, create `.env.local` in the project root:

```bash
COMMAND_CENTER_DATA_DIR=/absolute/path/to/private/data
```

The data directory can contain settings, OAuth tokens, provider keys, snapshots, tasks, reminders, and `command-center.sqlite`. Secrets remain local but are not encrypted at rest. Protect your operating-system account and backups.

## 6. Back up and recover

Create a consistent private backup:

```bash
npm run backup
```

The default destination is `~/Documents/Command Center Backups/<timestamp>`.

Choose a different destination with:

```bash
npm run backup -- --to=/absolute/path/to/backup-folder
```

Backups can include OAuth tokens and provider keys. Store them as private material.

If Command Center refuses to open because local data cannot be read safely, run:

```bash
npm run doctor
```

The application fails closed and does not overwrite settings, tasks, or reminders after a failed initial read.

## 7. Update

For a Git installation:

```bash
git pull --ff-only
npm run launch
```

The launcher detects lockfile and source changes, reinstalls dependencies when needed, and rebuilds the application. Your normal data directory lives outside the checkout.

## 8. Troubleshooting

### The browser does not open

Open `http://127.0.0.1:3000` manually. If you chose another port, use that port instead.

### Port 3000 is in use

```bash
npm run launch -- --port=3001
```

### Setup or local data fails

```bash
npm run doctor
```

Read the first reported error and correct that condition before restarting.

### A public metric is unavailable

Confirm that the configured profile belongs to the intended account. Public collection is provider-controlled and best effort; Command Center keeps a verified last-known value instead of inventing a zero.

### Newsletter processing is paused

Confirm that Gmail is connected and that the selected cloud or local AI provider is ready. Newsletter intelligence deliberately does not fall back to an inbox or link dump.

### A local model is missing

Start its runtime, load a supported text-generation model, confirm the loopback port, and choose **Reload models** in Settings.

## 9. Development checks

Contributors can run:

```bash
npm run setup
npm run dev
npm run check
npm run smoke
```

`npm run check` runs lint, the regression suite, and a production build. `npm run smoke` tests the one-command launcher with isolated temporary data and verifies the local request boundary.
