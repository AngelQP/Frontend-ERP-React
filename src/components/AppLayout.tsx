import { type ReactNode, useState } from "react";
import AppSidebar from "./AppSidebar";
import TopBar from "./TopBar";

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const AppLayout = ({ children, title, subtitle }: AppLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex w-full bg-background">
    {/* // <div className="h-screen flex w-full bg-background"> */}
      <AppSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title={title} subtitle={subtitle} />
        <main className="flex-1 p-4 lg:p-6 overflow-auto flex flex-col">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
