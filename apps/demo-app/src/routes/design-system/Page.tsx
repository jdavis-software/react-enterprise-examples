import { useEffect, useState } from 'react';
import { Badge, Button, Card, Input, Switch } from '@react-enterprise-examples/ui';

export function Page() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <Button variant="ghost" onClick={toggleTheme}>
          Toggle {theme === 'light' ? 'Dark' : 'Light'} Theme
        </Button>
      </div>

      <section>
        <h2>Buttons</h2>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="subtle">Subtle</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </section>

      <section>
        <h2>Badges</h2>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Badge variant="info">Info</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="neutral">Neutral</Badge>
          <Badge variant="info" tone="soft">
            Info Soft
          </Badge>
        </div>
      </section>

      <section>
        <h2>Input & Switch</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px' }}>
          <Input label="Email" placeholder="you@example.com" />
          <Switch />
        </div>
      </section>

      <section>
        <h2>Card</h2>
        <Card header="Card title" footer={<Button variant="primary">Action</Button>}>
          This is a simple card body.
        </Card>
      </section>

      <section>
        <h2>Design Tokens</h2>
        <TokenSwatches />
      </section>
    </div>
  );
}

function TokenSwatches() {
  const vars = [
    'accent',
    'danger',
    'info',
    'success',
    'warning',
    'neutral',
    'surface',
    'surface-muted',
    'text-primary',
    'text-muted'
  ];
  const style = getComputedStyle(document.documentElement);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
      {vars.map(name => (
        <div key={name} style={{ textAlign: 'center' }}>
          <div
            style={{ width: '3rem', height: '3rem', background: style.getPropertyValue(`--${name}`) }}
          />
          <code>{name}</code>
        </div>
      ))}
    </div>
  );
}
