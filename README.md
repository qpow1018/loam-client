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

## PWA

LoaM is installable as a Progressive Web App from supported browsers.
Build and run the production app with:

```bash
npm run build
npm run start
```

The app exposes a web manifest at:

```text
/manifest.webmanifest
```

and registers a service worker from:

```text
/sw.js
```

Data backup and restore remain available from the settings page as manual JSON
export/import actions.
