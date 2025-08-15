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
- **Generic typed table columns** via the shared Table kit. Columns are declared with `ColumnDef<Device>` and the virtualized rows are styled to match the kit. The header uses `<TableHeader>` while rows are rendered with `react-window`.
- `dataBehavior='batch'` tells the table data changes are infrequent and derived via user-driven sorting/filtering. `renderBehavior='virtualized'` mounts only visible rows for performance.

### Running locally
```bash
npm ci
npm -w packages/ui run build
npm -w apps/demo-app run dev
```
Then open http://localhost:5173/large-data-sets

Tip: open DevTools → Performance panel and record while scrolling to verify only the visible rows are painted.

**Note:** only the table header is rendered with the `<Table>` components; the body rows are virtualized `div`s that reuse the table classes.

[Demo route](/large-data-sets)
