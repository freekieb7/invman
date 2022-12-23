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
    <Transition.Root show={open}>
      <Dialog open={open} onClose={toggleOpen}>
        <Transition.Child
          as="div"
          enter="transition-opasity ease-linear duration-200 transform"
          enter-from="-translate-x-full"
          enter-to="translate-x-0"
          leave="transition ease-in-out duration-200 transform"
          leave-from="translate-x-0"
          leave-to="-translate-x-full"
        >
          <Dialog.Panel className="flex relative flex-col w-72 sidebar-height border-r border-slate-100/20 bg-slate-900">
            <div className="flex h-full flex-col py-4 shadow-xl">
              <div className="mt-4 flex-1">
                <div className="px-4 sm:px-6">
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
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
}
