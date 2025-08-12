# Design System

This example shows how to build a small but real design system and document it.

## Contribution guidelines

- Favor composition over prop bloat. Keep components small and layered.
- Use variants for style changes instead of boolean props.
- Every component change requires Storybook docs and unit tests.
- Run `npm -w packages/ui run test:vis` to update visual baselines when styles change.

View the gallery at [/design-system](/design-system) in the demo app.
Storybook can be started with:

```bash
npm run storybook
```
