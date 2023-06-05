import { HomeIcon, ServerIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import SidebarToggleBtn from "./sidebarToggleBtn";
import { Routes } from "./routes";

interface Props {
  isSidebarOpen: boolean;
  toggleSidebar: Dispatch<SetStateAction<boolean>>;
}

export default function SidebarSmallScreen({
  isSidebarOpen,
  toggleSidebar,
}: Props) {
  if (!isSidebarOpen) return <div></div>;

  return (
    <div
      id="small-screen-sidebar"
      className="fixed lg:hidden z-50 top-0 left-0 right-0 bottom-0 w-full"
    >
      <div
        id="shade"
        className="absolute top-0 right-0 left-0 bottom-0 bg-gray-700 opacity-75"
        onClick={() => toggleSidebar(false)}
      ></div>
      <div
        id="bar"
        className="absolute w-60 top-0 left-0 bottom-0 bg-slate-900 border-r border-slate-100/20"
      >
        <div className="flex border-b border-slate-100/20 h-full">
          <nav className="w-full">
            <div className="flex p-4 items-center h-16">
              <SidebarToggleBtn
                isSidebarOpen={true}
                toggleSidebar={toggleSidebar}
              />
              <div className="pl-4">
                <div className="neon-text text-base">Invman</div>
              </div>
            </div>

            {Routes.map((route, index) => {
              return (
                <Link key={index} href={route.href}>
                  <div className="flex p-2 space-x-4 items-center border-y border-slate-100/20 text-white neon-hover-animation">
                    <div>{<route.icon className="h-8 w-8" />}</div>
                    <div>{route.name}</div>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
