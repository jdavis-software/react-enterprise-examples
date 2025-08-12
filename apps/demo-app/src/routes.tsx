import { createBrowserRouter, Link, Outlet } from 'react-router-dom';
import { useEffect, useState, lazy, Suspense } from 'react';
import { Button, Badge } from '@react-enterprise-examples/ui';
import { checkHealth } from './mocks/api';
import { Page as DesignSystemPage } from './routes/design-system/Page';

const LargeDataPage = lazy(async () => {
  const mod = await import('../../../examples/01-large-data-sets/Page');
  return { default: mod.Page };
});

const featureFlags = JSON.parse(import.meta.env.VITE_FEATURE_FLAGS || '{}');

function RootLayout() {
  const [status, setStatus] = useState<'loading' | 'ok' | 'fail'>('loading');

  useEffect(() => {
    checkHealth()
      .then(() => setStatus('ok'))
      .catch(() => setStatus('fail'));
  }, []);

  return (
    <div>
      <header style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <nav style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to="/">Home</Link>
          <Link to="/large-data-sets">Large Data Sets</Link>
          <Link to="/design-system">Design System</Link>
          <Link to="/a11y-i18n">A11y & I18n</Link>
          <Link to="/realtime-state">Realtime State</Link>
          <Link to="/integrations">Integrations</Link>
          <Link to="/testing">Testing</Link>
          <Link to="/aws-workflows">AWS Workflows</Link>
        </nav>
        <div>
          {status === 'loading' ? (
            <Badge variant="subtle">...</Badge>
          ) : (
            <Badge variant={status === 'ok' ? 'primary' : 'danger'}>{status.toUpperCase()}</Badge>
          )}
        </div>
        <pre style={{ marginLeft: 'auto' }}>{JSON.stringify(featureFlags)}</pre>
      </header>
      <main style={{ padding: '1rem' }}>
        <Outlet />
      </main>
    </div>
  );
}

function Placeholder({ name, folder }: { name: string; folder: string }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>
        See the corresponding example README.
      </p>
      <Button variant="primary" size="md">
        <a href={`/examples/${folder}/README.md`}>View README</a>
      </Button>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <p>Welcome to the demo app.</p> },
      {
        path: 'large-data-sets',
        element: (
          <Suspense fallback={<Placeholder name="Large Data Sets" folder="01-large-data-sets" />}>
            <LargeDataPage />
          </Suspense>
        )
      },
      {
        path: 'design-system',
        element: <DesignSystemPage />
      },
      {
        path: 'a11y-i18n',
        element: <Placeholder name="A11y & I18n" folder="03-a11y-i18n" />
      },
      {
        path: 'realtime-state',
        element: <Placeholder name="Realtime State" folder="04-realtime-state" />
      },
      {
        path: 'integrations',
        element: <Placeholder name="Integrations" folder="05-integrations" />
      },
      {
        path: 'testing',
        element: <Placeholder name="Testing" folder="06-testing" />
      },
      {
        path: 'aws-workflows',
        element: <Placeholder name="AWS Workflows" folder="07-aws-workflows" />
      }
    ]
  }
]);
