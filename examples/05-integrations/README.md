# Integrations

This example demonstrates building **integration-heavy interfaces**.

Key techniques:

- **Adapter pattern** for normalized API responses and actions across
  multiple providers.
- **Feature flags** to hide or show providers or capabilities.
- **Guided setup wizard** for enabling a provider.
- **Conditional rendering** when an integration is disabled or missing
  capabilities.

## Running the demo

```bash
npm ci
npm -w packages/ui run build
npm run dev # open http://localhost:5173/integrations
```

## Tests

```bash
npm test
npm run e2e
```

Visit `/integrations` in the demo app to explore the adapters and UI.
