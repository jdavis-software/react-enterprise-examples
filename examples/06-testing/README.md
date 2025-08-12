# Testing

Problem: ensuring reliability across complex flows.

When to test what:

- **Unit / Integration**: fast logic and component tests with Vitest + React Testing Library.
- **End-to-End**: user flows with Playwright and deterministic MSW network stubs.
- **Visual Regression**: Storybook snapshots taken with Playwright.
- **Contract**: adapter interfaces checked with Vitest.

Stability tips: deterministic data, MSW for network, fake timers, `data-testid`, avoid arbitrary `sleep`.

How to run each layer:

```bash
npm test
npm run e2e
npm run storybook && npm -w packages/ui run vrt
```

[Demo route](/testing)
