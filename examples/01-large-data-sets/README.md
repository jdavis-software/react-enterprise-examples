# Large Data Sets

This demo renders **50,000** fake devices and still stays responsive.

### Challenges
- Scrolling thousands of rows without jank
- Fast filtering/search without blocking the UI
- Sorting huge lists without freezing the main thread

### Techniques Used
- [`react-window`](https://github.com/bvaughn/react-window) for list virtualization
- Debounced text search and URL‑backed filters
- Memoized sorting on the main thread for small lists and a Web Worker for large lists
- Small simulated live updates to keep the list fresh

### Running locally
```bash
npm ci
npm -w packages/ui run build
npm -w apps/demo-app run dev
```
Then open http://localhost:5173/large-data-sets

Tip: open DevTools → Performance panel and record while scrolling to verify only the visible rows are painted.

[Demo route](/large-data-sets)
