import { HomeIcon, ServerIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import { Routes } from "./routes";

type Props = {
  isSidebarOpen: boolean;
  toggleSidebar: Dispatch<SetStateAction<boolean>>;
};

export default function SidebarLargeScreen({ isSidebarOpen }: Props) {
  return (
    <div
      id="large-screen-sidebar"
      className={`z-40 h-full fixed left-0 top-16 bottom-0 ${
        isSidebarOpen ? "w-60 overflow-auto" : ""
      }`}
    >
      <div className="flex flex-col h-full bg-slate-900 border-r border-slate-100/20">
        <nav>
          {Routes.map((route) => {
            return (
              <Link href={route.href}>
                <div className="flex p-2 space-x-4 items-center border-y border-slate-100/20 text-white neon-hover-animation">
                  <div>{<route.icon className="h-8 w-8" />}</div>
                  {isSidebarOpen ? <div>{route.name}</div> : null}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
