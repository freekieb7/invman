
import Diary from "@/component/diary";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import { ChangeEvent } from "react";

const Page = () => {
    return (
        <div className="w-full h-full flex justify-center items-center">
            <Diary />
        </div>
    );
}

export default Page;