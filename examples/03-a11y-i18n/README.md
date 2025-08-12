# Accessibility & i18n

Problem: building interfaces usable by everyone and localized globally.

Challenges: ARIA attributes, translation workflows.

Techniques: semantic markup, runtime language switches.

[Demo route](/a11y-i18n)

## Checklist

- Roles/states/props: `role="grid"`, `aria-sort`, `aria-modal`, `aria-live`
- Keyboard support: Tab/Shift+Tab, Arrow keys in grid, Esc closes modal
- Color contrast meets WCAG AA via design tokens
- RTL support using `dir` and logical CSS properties
- Respects `prefers-reduced-motion` for transitions

## Testing

- Screen readers: try NVDA, VoiceOver
- Storybook: `npm run storybook` (uses smoke test)
- Unit: `npm test`
- E2E: `npm -w apps/demo-app run e2e`
