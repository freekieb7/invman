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
    <Bars3Icon
      className="h-6 w-6 hover:bg-slate-200 rounded text-white"
      onClick={() => toggleSidebar(!isSidebarOpen)}
    />
  );
}
