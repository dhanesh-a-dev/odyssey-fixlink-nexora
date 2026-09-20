import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export function Layout() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="container" style={{ marginTop: '2rem', minHeight: '80vh' }}>
        <Outlet />
      </main>
      <footer style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
        <p>&copy; 2026 FixLink Community Marketplace</p>
      </footer>
    </div>
  );
}
