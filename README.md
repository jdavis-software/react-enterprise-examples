# React Enterprise Examples

A collection of production-grade React patterns for large-scale enterprise apps. The repository uses a monorepo-lite structure with npm workspaces.

## Getting Started

```bash
npm install
npm run dev       # start demo app
npm run storybook # UI package docs
npm test          # run unit tests
npm run e2e       # run Playwright tests
```

## Vercel Deployment

Deploy the demo app to Vercel with the following settings:

- **Root Directory:** `apps/demo-app`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm ci`

`vercel.json` handles SPA rewrites and immutable caching for built assets.

## Contributing

1. Fork the repo and create a new branch.
2. Run `npm run lint` and `npm test` before submitting PRs.
3. Ensure your changes include relevant tests and documentation.

## Packages and Apps

- `apps/demo-app` – Vite + React demo showcasing patterns.
- `packages/ui` – Design primitives and tokens with Storybook docs.
- `packages/adapters` – TypeScript interfaces for external services.
- `packages/testing` – Shared test utilities and MSW setup.
- `examples/*` – Guides for specific enterprise scenarios.

## License

MIT
