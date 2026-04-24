import { useState } from "react";
import { Outlet } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AppSidebar } from "@/components/layout/AppSidebar";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ThemeProvider>
      {/* Ocupa exatamente a viewport, sem overflow no root */}
      <div className="h-screen w-screen flex overflow-hidden bg-background">
        {/* Sidebar fixa em altura total */}
        <AppSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((prev) => !prev)}
        />

        {/* Área principal: scroll apenas aqui */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 md:p-6">
              <div className="max-w-7xl mx-auto">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
