import LoginButton from "@/components/buttons/login-btn";
import { Dispatch, SetStateAction } from "react";
import MenuButton from "../buttons/menu-btn";

type Props = {
  isOpen: boolean;
  toggleSidebar: Dispatch<SetStateAction<boolean>>;
};

export default function Navbar({ isOpen, toggleSidebar }: Props) {
  return (
    <div className="sticky p-4 z-30 border-b border-slate-100/20">
      <div className="flex h-8 justify-between items-center">
        <div className="flex gap-4">
          <MenuButton isOpen={isOpen} toggleSidebar={toggleSidebar} />
          <div className="neon-text text-base">Nilfheim</div>
        </div>
        <div className="flex right-0 items-center">
          <LoginButton />
        </div>
      </div>
    </div>
  );
}
