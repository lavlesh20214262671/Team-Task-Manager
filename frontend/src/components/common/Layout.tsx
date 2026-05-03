import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = ({ children }: { children: ReactNode }) => (
  <div className="app-shell">
    <Sidebar />
    <div className="main-content">
      <Topbar />
      <main className="page">{children}</main>
    </div>
  </div>
);

export default Layout;
