import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { Button, Spacer } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

type Props = {
    children: ReactNode
    showGoBack: boolean
    title: string
}

const Header = (props: Partial<Props>) => {
    const router = useRouter();

    return (
        <>
            <div className="flex gap-2 items-center max-h-16">
                {!props.showGoBack &&
                    <Button isIconOnly aria-label="Go back" onClick={() => {
                        router.back();
                    }}>
                        <ArrowLeftIcon className="h-6 w-6" />
                    </Button>
                }
                <div className="text-lg">{props.title}</div>
                <div className="ml-10 h-full flex gap-2 items-center">
                    {props.children}
                </div>
            </div>
            <Spacer y={2} />
        </>
    );
};

export default Header;

