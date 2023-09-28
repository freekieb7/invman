"use client";

import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, Spinner, Switch, User } from "@nextui-org/react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

interface Props {
    isDarkTheme: boolean;
    setIsDarkTheme: Dispatch<SetStateAction<boolean>>;
}

const ProfileAvatar = (props: Props) => {
    const router = useRouter();
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close the popover when clicking outside of element
    useEffect(() => {
        document.addEventListener("mousedown", (event: MouseEvent) => {
            const popupContentDimensions = dropdownRef.current?.getBoundingClientRect();

            if (popupContentDimensions === undefined) return;

            if (
                event.clientX < popupContentDimensions.left ||
                event.clientX > popupContentDimensions.right ||
                event.clientY < popupContentDimensions.top ||
                event.clientY > popupContentDimensions.bottom
            ) {
                setIsOpen(false);
            }
        });
    }, [dropdownRef]);

    return (
        <>
            {session?.user == null
                ? (
                    <Spinner />
                ) : (
                    <Dropdown isOpen={isOpen} onOpenChange={(newIsOpen) => setIsOpen(newIsOpen)}>
                        <DropdownTrigger>
                            <Avatar
                                as="button"
                                src={session?.user?.image ?? undefined}
                                name={session?.user?.name!}
                            />
                        </DropdownTrigger>
                        <DropdownMenu aria-label="avatar-menu" ref={dropdownRef}>
                            <DropdownSection showDivider={true}>
                                <DropdownItem
                                    textValue="user"
                                    isReadOnly
                                    key="profile"
                                    className="h-14 gap-2 cursor-default hover:bg-default"
                                >
                                    <User
                                        name={session.user.name}
                                        avatarProps={{
                                            src: session?.user?.image ?? undefined,
                                        }}
                                    />
                                </DropdownItem>
                            </DropdownSection>
                            <DropdownSection showDivider={true}>
                                <DropdownItem onClick={() => router.push("/settings")}>
                                    Settings
                                </DropdownItem>
                                <DropdownItem
                                    isReadOnly
                                    key="theme"
                                    className="cursor-default"
                                    endContent={
                                        <Switch
                                            defaultSelected={props.isDarkTheme}
                                            color='default'
                                            thumbIcon={({ isSelected, className }) =>
                                                isSelected ? (
                                                    <MoonIcon className={className} />
                                                ) : (
                                                    <SunIcon className={className} />
                                                )
                                            }
                                            onValueChange={props.setIsDarkTheme}
                                        />
                                    }
                                >
                                    Theme
                                </DropdownItem>
                            </DropdownSection>
                            <DropdownItem key="logout" onClick={() => signOut()}>Log Out</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                )
            }
        </>
    );
}

export default ProfileAvatar;