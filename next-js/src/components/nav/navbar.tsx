import LoginButton from "@/components/buttons/login-btn";
import { Dispatch, SetStateAction } from "react";
import MenuSidebarButton from "../buttons/menu-sidebar-btn";

type Props = {
  isSidebarOpen: boolean;
  toggleSidebar: Dispatch<SetStateAction<boolean>>;
};

export default function Navbar({ isSidebarOpen, toggleSidebar }: Props) {
  return (
    <div id="navbar" className="z-50 fixed top-0 w-full h-16">
      <header className="flex items-center px-4 border-b border-slate-100/20 h-full">
        <MenuSidebarButton
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
        <div className="pl-4">
          <div className="neon-text text-base">Invman</div>
        </div>

        <div className="ml-auto flex items-center">
          <LoginButton />
        </div>
      </header>
    </div>
  );
}
