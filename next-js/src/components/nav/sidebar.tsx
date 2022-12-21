import { Dispatch, Fragment, SetStateAction } from "react";
import { Dialog, Transition } from "@headlessui/react";

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
          <Dialog.Panel className="flex relative flex-col w-72 sidebar-height border-r border-slate-100/20 bg-slate-600/95">
            <div className="flex h-full flex-col py-6 shadow-xl">
              <div className="px-4 sm:px-6">
                <Dialog.Title className="text-lg font-medium text-white">
                  Panel title
                </Dialog.Title>
              </div>
              <div className="relative mt-6 flex-1 px-4 sm:px-6">
                {/* Replace with your content */}
                <div className="absolute inset-0 px-4 sm:px-6">
                  <div
                    className="h-full border-2 border-dashed border-gray-200"
                    aria-hidden="true"
                  />
                </div>
                {/* /End replace */}
              </div>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
}
