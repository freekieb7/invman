import LoginButton from "@/components/buttons/login-btn";
import { Dispatch, SetStateAction } from "react";
import MenuButton from "../buttons/menu-btn";

type Props = {
  open: boolean;
  toggleSidebar: Dispatch<SetStateAction<boolean>>;
};

export default function Navbar({ open, toggleSidebar }: Props) {
  return (
    <div className="p-4 border-b border-slate-100/20">
      <div className="flex h-8 justify-between items-center">
        <div className="flex gap-4">
          <MenuButton open={open} toggleSidebar={toggleSidebar} />
          <div className="neon-text text-base">Nilfheim</div>
        </div>
        <div className="flex right-0 items-center">
          <LoginButton />
        </div>
      </div>
    </div>
  );
}
