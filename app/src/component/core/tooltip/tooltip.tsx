import { Tooltip, TooltipProps } from "@nextui-org/react";
import { ReactNode } from "react";


interface Props extends TooltipProps {
}

const DefaultTooltip = (props: TooltipProps) => {
    return (
        <Tooltip {...props}
            closeDelay={0}
            offset={15}
            className="text-md"
            disableAnimation
        />
    );
}

export type { Props }
export default DefaultTooltip;