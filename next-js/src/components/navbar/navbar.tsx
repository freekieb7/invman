import LoginButton from "@/components/buttons/login-btn";
import MenuButton from "../buttons/menu-btn";

export default function Navbar() {
  return (
    <div className="p-4 border-b border-slate-100/20">
      <div className="flex h-8 justify-between items-center">
        <div className="flex gap-4">
          <MenuButton />
          <h1 className="neonText">Nilfheim</h1>
        </div>
        <div className="flex right-0 items-center">
          <LoginButton />
        </div>
      </div>
    </div>
  );
}
