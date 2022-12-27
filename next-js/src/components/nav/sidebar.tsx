import { Dispatch, SetStateAction } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { HomeIcon } from "@heroicons/react/24/solid";
import { BeakerIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

type Props = {
  isOpen: boolean;
  toggleOpen: Dispatch<SetStateAction<boolean>>;
};

export default function Sidebar({ isOpen, toggleOpen }: Props) {
  return (
    <Dialog
      open={isOpen}
      onClose={() => toggleOpen(false)}
      className="fixed inset-0 z-20"
    >
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed mt-16 max-w-xs w-full max-h-max h-full border-r bg-slate-900">
        {/* The actual dialog panel  */}
        <Dialog.Panel>
          <Link href="/" onClick={() => toggleOpen(false)}>
            <div
              className="flex p-2 space-x-4 items-center border-y text-white neon-hover-animation"
              aria-hidden="true"
            >
              <div>
                <HomeIcon height={32} />
              </div>
              <div>Home</div>
            </div>
          </Link>
          <Link href="/items" onClick={() => toggleOpen(false)}>
            <div
              className="flex p-2 space-x-4 items-center border-b text-white neon-hover-animation"
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
