import { HomeIcon, ServerIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

type Props = {
  isSidebarOpen: boolean;
  toggleSidebar: Dispatch<SetStateAction<boolean>>;
};

export default function SmallSidebar({ isSidebarOpen, toggleSidebar }: Props) {
  return (
    <div id="small-sidebar" className="z-40 fixed left-0 top-16 bottom-0">
      <div className="flex flex-col bg-slate-900 border-r border-slate-100/20">
        <nav>
          <Link href="/">
            <div className="flex p-2 space-x-4 items-center border-y border-slate-100/20 text-white neon-hover-animation">
              <div>
                <HomeIcon height={32} />
              </div>
              {isSidebarOpen ? <div>Home</div> : null}
            </div>
          </Link>
          <Link href="/items">
            <div className="flex p-2 space-x-4 items-center border-y border-slate-100/20 text-white neon-hover-animation">
              <div>
                <ServerIcon height={32} />
              </div>
              {isSidebarOpen ? <div>Services</div> : null}
            </div>
          </Link>
        </nav>
      </div>
    </div>
  );
}
