# @react-enterprise-examples/ui

This package contains a small design system used across the examples.

## Visual regression tests

Build Storybook and capture a baseline screenshot:

```bash
npm -w packages/ui run test:vis
```

Screenshots are stored in `.snapshots`. A sample GitHub Action job is commented
out in `.github/workflows/ci.yml` so you can enable it when ready.
