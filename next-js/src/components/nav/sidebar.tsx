import { HomeIcon } from "@heroicons/react/24/solid";

export default function Sidebar() {
  return (
    <div className="hidden lg:block fixed min-h-full w-64 overflow-y-auto border-r border-slate-100/20">
      <nav>
        <div className="flex p-2 space-x-4 items-center border-y text-white neon-hover-animation">
          <div>
            <HomeIcon height={32} />
          </div>
          <div>
            Homesssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss
          </div>
        </div>
      </nav>
    </div>
  );
}
