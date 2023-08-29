import { BookOpenIcon, HomeIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
    const pathname = usePathname();

    return (
        <ul className="grid gap-4 grid-cols-1">
            <Link href={"/"}>
                <li className="glass p-4 w-16 h-16 rounded-full">
                    <HomeIcon
                        className={pathname == "/" ? 'border-b border-white' : ""}
                    />
                </li>
            </Link>
            <Link href={"/diary"}>
                <li className="glass p-4 w-16 h-16 rounded-full">
                    <BookOpenIcon
                        className={pathname == "/diary" ? 'border-b border-white' : ""}
                    />
                </li>
            </Link>
        </ul>
    );
}

export default Navbar;