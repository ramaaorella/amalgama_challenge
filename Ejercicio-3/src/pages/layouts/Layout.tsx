import Nav from "@/components/Nav";
import { Toaster } from "@/components/ui/toaster";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="relative h-screen flex flex-col">
      <main id="content" className={`relative h-full`}>
        <Nav />
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}
