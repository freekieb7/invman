import { Dispatch, SetStateAction } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { HomeIcon } from "@heroicons/react/24/solid";
import { BeakerIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

type Props = {
  open: boolean;
  toggleOpen: Dispatch<SetStateAction<boolean>>;
};

export default function Sidebar({ open, toggleOpen }: Props) {
  return (
    <Dialog
      open={open}
      onClose={() => toggleOpen(false)}
      className="fixed sidebar-height mt-16 inset-0 z-50 max-w-xs border-t border-r border-slate-100/20 bg-slate-900"
    >
      <div className="p-4">
        <Dialog.Panel>
          <Link href="/" onClick={() => toggleOpen(false)}>
            <div
              className="flex p-2 space-x-4 items-center border-y text-white"
              aria-hidden="true"
            >
              <div>
                <HomeIcon height={32} />
              </div>
              <div>Home</div>
            </div>
          </Link>
          <Link href="/test" onClick={() => toggleOpen(false)}>
            <div
              className="flex p-2 space-x-4 items-center border-y text-white neon-hover-animation"
              aria-hidden="true"
            >
              <div>
                <BeakerIcon height={32} />
              </div>
              <div>Test</div>
            </div>
          </Link>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
