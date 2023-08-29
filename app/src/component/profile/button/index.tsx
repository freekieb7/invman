import Dialog from "@/component/core/dialog";
import Spinner from "@/component/core/spinner";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { LegacyRef, useEffect, useRef, useState } from "react";

const ProfileButton = () => {
    const { data: session } = useSession();
    const [open, setOpen] = useState<boolean>(false);

    const ref = useRef<HTMLLIElement>();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!ref.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
    }, [ref]);

    return (
        <li ref={ref as LegacyRef<HTMLLIElement>} id="profile-btn" className="glass p-4 w-16 h-16 rounded-full" onClick={() => setOpen(!open)}>
            {session?.user?.image == null
                ?
                <div className="w-[32px]">
                    <Spinner />
                </div>
                :
                <Image
                    src={session?.user?.image!}
                    alt=""
                    width={32}
                    height={32}
                    className="text-slate-100 rounded-full object-cover"
                />
            }
            {open &&
                <div id="profile-btn-options" className="absolute top-0 left-0 -z-10 bg-slate-50 glass  rounded-full pt-20">
                    <ul id="profile-btn-options" className="grid grid-cols-1 gap-4 -z-10">
                        <li className="glass p-4 w-16 h-16 rounded-full" onClick={() => signOut()}>
                            <ArrowLeftOnRectangleIcon />
                        </li>
                    </ul>
                </div>
            }
        </li>
    );
}

export default ProfileButton;