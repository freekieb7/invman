import { Bars3Icon } from "@heroicons/react/24/solid";
import { Dispatch, SetStateAction } from "react";

interface Props {
  isSidebarOpen: boolean;
  toggleSidebar: Dispatch<SetStateAction<boolean>>;
}

export default function SidebarToggleBtn({
  isSidebarOpen,
  toggleSidebar,
}: Props) {
  return (
    <div
      className="hover:bg-slate-800 rounded p-2"
      onClick={() => toggleSidebar(!isSidebarOpen)}
    >
      <Bars3Icon className="h-6 w-6 text-white" />
    </div>
  );
}
