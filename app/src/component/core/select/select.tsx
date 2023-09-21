import { Select as NextSelect, SelectProps } from "@nextui-org/react";
import React, { ChangeEventHandler, FocusEvent, FocusEventHandler, ForwardedRef, ReactNode } from "react";

interface Props<T = object> extends SelectProps<T> {
    placeHolder?: string;
    onSearchChange?: (text: string) => void;
    onChange?: ChangeEventHandler<HTMLSelectElement>;
    onBlur?: FocusEventHandler<HTMLSelectElement> & ((e: FocusEvent<Element, Element>) => void);
    name?: string;
    min?: string | number;
    max?: string | number;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    required?: boolean;
    disabled?: boolean;
    errorMessage?: string;
    className?: string;
    label?: string;
    defaultValue?: string;
}

// type SelectProps = {
//     onChange?: ChangeEventHandler<HTMLSelectElement>;
//     onBlur?: FocusEventHandler<HTMLSelectElement> & ((e: FocusEvent<Element, Element>) => void);
//     name?: string;
//     min?: string | number;
//     max?: string | number;
//     maxLength?: number;
//     minLength?: number;
//     pattern?: string;
//     required?: boolean;
//     disabled?: boolean;
//     errorMessage?: string;
//     className?: string;
//     label?: string;
//     defaultValue?: string;
//     children?: ReactNode;
// }

const Select = React.forwardRef(<T extends object>(props: Props<T>, ref: ForwardedRef<HTMLSelectElement>) => {
    return (
        <NextSelect
            {...props}
            label={props.label}
            placeholder={props.placeHolder}
            ref={ref}
            isRequired={props.required}
            classNames={{
                popover: "w-auto"
            }}
        >
            {props.children as any}
        </NextSelect>
    )
});

export type { Props as SelectProps }
export default Select;