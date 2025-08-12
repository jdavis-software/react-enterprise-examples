# Realtime State

Problem: merging live updates without jitter; stable UX with filters/pagination; optimistic actions.

Techniques: WS/SSE, buffering, Query cache updates, backoff, optimistic UI.

The table uses the shared generic `Table` kit with strongly typed column definitions:
```ts
const columns: ColumnDef<Device>[] = [
  { key: 'id', header: 'ID', sortable: true },
  { key: 'name', header: 'Name', sortable: true },
  { key: 'status', header: 'Status', sortable: true },
  { key: 'lastSeen', header: 'Last Seen', sortable: true }
];
```
Rows can be selected via the `selectable` prop and updates are buffered before rendering.

## Running

- `npm run dev` then visit `/realtime-state`.
- Toggle smoothing and watch state changes in Performance panel.
