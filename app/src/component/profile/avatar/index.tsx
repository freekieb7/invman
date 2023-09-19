"use client";

import ListboxWrapper from "@/component/core/listbox/wrapper";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import { Avatar, Listbox, ListboxItem, Spinner, cn } from "@nextui-org/react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

const ProfileAvatar = () => {
    const { data: session } = useSession();
    const [open, setOpen] = useState<boolean>(false);

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!ref.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
    }, [ref]);

    return (
        <div ref={ref} className="relative h-full">
            {session?.user == null
                ?
                <Spinner
                    className="h-full w-full"
                />
                :
                <Avatar
                    src={session?.user?.image ?? undefined}
                    name={session?.user?.name!}
                    className="h-full w-full cursor-pointer"
                    onClick={() => setOpen(!open)}
                />
            }
            {open &&
                <div className="absolute right-0 mt-2">
                    <ListboxWrapper>
                        <Listbox variant="solid">
                            <ListboxItem
                                key="signoff"
                                startContent={<ArrowLeftOnRectangleIcon className="w-unit-lg" />}
                                onClick={() => signOut()}
                            >
                                Sign off
                            </ListboxItem>
                        </Listbox>
                    </ListboxWrapper>
                </div>
            }
        </div >
    );
}

export default ProfileAvatar;