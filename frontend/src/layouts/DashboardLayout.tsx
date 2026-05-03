import { ReactNode } from 'react';
import Layout from '../components/common/Layout';

type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return <Layout>{children}</Layout>;
};

export default DashboardLayout;
