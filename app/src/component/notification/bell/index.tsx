"use client";

import { BellIcon } from "@heroicons/react/24/solid";
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";

const NotificationBell = () => {
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
        <div ref={ref} className="relative">
            <BellIcon className="cursor-pointer" onClick={() => setOpen(!open)} />
            {open &&
                <div className="absolute right-0 mt-2 cursor-auto">
                    <Card className="w-80">
                        <CardHeader>
                            <p>Notifications</p>
                        </CardHeader>
                        <Divider />
                        <CardBody>
                            <p className="text-opacity-0">No notification available</p>
                        </CardBody>
                    </Card>
                </div>
            }
        </div >
    );
}

export default NotificationBell;