import { CubeIcon as CubeIconSolid, HomeIcon as HomeIconSolid } from "@heroicons/react/24/solid";
import { CubeIcon as CubeIconOutline, HomeIcon as HomeIconOutline } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
    const pathname = usePathname();

    return (
        <div className="flex flex-col items-center justify-center gap-6 p-4">
            <Link href={"/"}>
                <div className="hover:bg-default-100 rounded-lg flex flex-col items-center justify-center p-2">
                    {pathname === "/"
                        ? <HomeIconSolid className="h-9/12 w-9/12 " />
                        : <HomeIconOutline className="h-9/12 w-9/12 " />
                    }
                    <span className="text-sm">Home</span>
                </div>
            </Link>
            <Link href={"/items"}>
                <div className="hover:bg-default-100 rounded-lg flex flex-col items-center justify-center p-2">
                    {pathname.startsWith("/items")
                        ? <CubeIconSolid className="h-9/12 w-9/12 " />
                        : <CubeIconOutline className="h-9/12 w-9/12 " />
                    }
                    <span className="text-sm">Items</span>
                </div>
            </Link>
        </div>
    );
}

export default Navbar;