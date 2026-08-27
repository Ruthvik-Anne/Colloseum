import { Outlet } from "react-router-dom";
import { TopNav } from "../components/TopNav";

export function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background">
      <TopNav />
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
    </div>
  );
}
