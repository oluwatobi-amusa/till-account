import TopBar from './Topbar';

interface LayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: LayoutProps) => {
  return (
    <div>
      <div className="fixed right-0 top-0 z-30 w-full max-w-full">
        <TopBar />
      </div>
      {children}
    </div>
  );
};

export default DashboardLayout;
