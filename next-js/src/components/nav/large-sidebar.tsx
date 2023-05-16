import { HomeIcon, ServerIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import MenuSidebarButton from "../buttons/menu-sidebar-btn";
import { Dispatch, SetStateAction } from "react";

type Props = {
  isSidebarOpen: boolean;
  toggleSidebar: Dispatch<SetStateAction<boolean>>;
};

export default function LargeSidebar({ isSidebarOpen, toggleSidebar }: Props) {
  if (!isSidebarOpen) return <div></div>;

  return (
    <div
      id="large-sidebar"
      className="fixed lg:hidden z-50 top-0 left-0 right-0 bottom-0 w-full"
    >
      <div
        id="shade"
        className="absolute top-0 right-0 left-0 bottom-0 bg-gray-700 opacity-75"
      ></div>
      <div
        id="bar"
        className="absolute top-0 left-0 bottom-0 bg-slate-900 border-r border-slate-100/20"
      >
        <div className="flex border-b border-slate-100/20 h-full">
          <nav>
            <div className="flex p-4 items-center h-16">
              <MenuSidebarButton
                isSidebarOpen={true}
                toggleSidebar={toggleSidebar}
              />
              <div className="pl-4">
                <div className="neon-text text-base">Nilfheim</div>
              </div>
            </div>

            <Link href="/">
              <div className="flex p-2 space-x-4 items-center border-y border-slate-100/20 text-white neon-hover-animation">
                <div>
                  <HomeIcon height={32} />
                </div>
                <div>Home</div>
              </div>
            </Link>
            <Link href="/items">
              <div className="flex p-2 space-x-4 items-center border-y border-slate-100/20 text-white neon-hover-animation">
                <div>
                  <ServerIcon height={32} />
                </div>
                <div>Services</div>
              </div>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
