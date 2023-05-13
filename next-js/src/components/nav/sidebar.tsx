import { HomeIcon } from "@heroicons/react/24/solid";

type Props = {
  isOpen: boolean;
};

export default function Sidebar({ isOpen }: Props) {
  return (
    <div className={isOpen ? "" : "hidden"}>
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
      <div className="lg:hidden z-50 fixed min-h-full w-64 bg-slate-900 overflow-y-auto border-r border-slate-100/20 ">
        <nav>
          <div className="flex p-2 space-x-4 items-center border-y text-white neon-hover-animation">
            <div>
              <HomeIcon height={32} />
            </div>
            <div>Test</div>
          </div>
        </nav>
      </div>
    </div>
  );
}
