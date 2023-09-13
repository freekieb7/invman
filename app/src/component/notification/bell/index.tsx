"use client";

import ListboxWrapper from "@/component/core/listbox/wrapper";
import { ArrowLeftOnRectangleIcon, BellIcon } from "@heroicons/react/24/solid";
import { Card, CardBody, CardHeader, Divider, Listbox, ListboxItem } from "@nextui-org/react";
import { signOut } from "next-auth/react";
import { LegacyRef, useEffect, useRef, useState } from "react";

const NotificationBell = () => {
    const [open, setOpen] = useState<boolean>(false);
    const ref = useRef<HTMLLIElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!ref.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
    }, [ref]);

    return (
        <li ref={ref} className="relative">
            <BellIcon className="cursor-pointer" onClick={() => setOpen(!open)} />
            {open &&
                <div className="absolute right-0 mt-2 cursor-auto">
                    <Card className="w-80 bg-default-100">
                        <CardHeader>
                            <p>Notifications</p>
                        </CardHeader>
                        <Divider />
                        <CardBody>
                            <p className="text-default-500">No notification available</p>
                        </CardBody>
                    </Card>
                </div>
            }
        </li >
    );
}

export default NotificationBell;