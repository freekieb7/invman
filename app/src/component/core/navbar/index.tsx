import { HomeIcon, StopIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
    const pathname = usePathname();

    return (
        <ul className="w-full bg-default-100 rounded-lg grid gap-6 grid-cols-1 p-2">
            <Link href={"/"}>
                <li className="h-12 w-12 p-2">
                    <HomeIcon
                        className={pathname == "/" ? 'border-b border-white' : ""}
                    />
                </li>
            </Link>
            <Link href={"/items"}>
                <li className="h-12 w-12 p-2">
                    <StopIcon
                        className={pathname == "/items" ? 'border-b border-white' : ""}
                    />
                </li>
            </Link>
        </ul>
    );
}

export default Navbar;