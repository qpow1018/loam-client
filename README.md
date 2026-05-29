## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Desktop App

LoaM can also run as a Tauri desktop shell around the web app.

```bash
npm run tauri:dev
npm run tauri:build
```

Release installers are built with:

```bash
npm run tauri:build:mac
npm run tauri:build:windows
```

Universal macOS builds also need the Intel Rust target:

```bash
rustup target add x86_64-apple-darwin
```

Tauri requires Rust and Cargo. Install them with rustup before running the Tauri commands:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

The production Tauri window loads the deployed web app at `https://loam-client.vercel.app/loado`.

Desktop installers are linked from:

```text
https://loam-client.vercel.app/download/mac
https://loam-client.vercel.app/download/windows
```

Those routes currently redirect to the latest GitHub Release assets.

Expected release asset names:

```text
LoaM-mac.dmg
LoaM-windows.exe
```
