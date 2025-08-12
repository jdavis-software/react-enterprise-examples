import '@react-enterprise-examples/ui/tokens.scss';
import { useState, useEffect } from 'react';

function FlakyCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setCount(c => c + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return <div data-testid="flaky-count">{count}</div>;
}

export function Page() {
  const nodeVersion = process.versions.node;
  return (
    <div className="stack" style={{ gap: '1rem' }}>
      <h1>Test Lab</h1>
      <section>
        <h2>Test Pyramid</h2>
        <ul>
          <li>Unit/Integration: Vitest + React Testing Library</li>
          <li>E2E: Playwright + MSW</li>
          <li>Visual: Storybook + Playwright</li>
          <li>Contract: Adapters interfaces</li>
        </ul>
      </section>
      <section>
        <h2>Flaky counter demo</h2>
        <FlakyCounter />
        <p>See tests for how fake timers stabilize this counter.</p>
      </section>
      <section>
        <h2>Environment</h2>
        <pre>Node {nodeVersion}</pre>
        <ul>
          <li>npm test</li>
          <li>npm run e2e</li>
          <li>npm run test:vis</li>
        </ul>
      </section>
    </div>
  );
}
