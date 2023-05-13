import LoginButton from "@/components/buttons/login-btn";
import { Dispatch, SetStateAction } from "react";
import MenuSidebarButton from "../buttons/menu-sidebar-btn";

type Props = {
  isSidebarOpen: boolean;
  toggleSidebar: Dispatch<SetStateAction<boolean>>;
};

export default function Navbar({ isSidebarOpen, toggleSidebar }: Props) {
  return (
    <div className="top-0 sticky">
      <header className="flex items-center h-14 px-4 border-b border-slate-100/20">
        <MenuSidebarButton
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
        <div className="pl-4">
          <div className="neon-text text-base">Nilfheim</div>
        </div>

        <div className="ml-auto flex items-center">
          <LoginButton />
        </div>
      </header>
    </div>
  );
}
