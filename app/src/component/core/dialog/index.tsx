import { XMarkIcon } from "@heroicons/react/24/solid";

type Props = {
    onClose: () => void;
}

const Dialog = ({ onClose, children }: Props & { children: React.ReactNode }) => {
    return (
        <div className="absolute top-0 left-0 right-0 bottom-0 h-full flex items-center  ">
            <dialog open className="glass p-2 text-slate-100">
                <div className="flex">
                    <div className="ml-auto">
                        <form method="dialog">
                            <button>
                                <XMarkIcon />
                            </button>
                        </form>
                    </div>
                </div>
                {children}
            </dialog>
        </div>
    );
}

export default Dialog;