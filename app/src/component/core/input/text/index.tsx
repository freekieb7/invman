import { Input, InputProps } from "@nextui-org/react"
import React, { ChangeEventHandler, FocusEvent, FocusEventHandler, ForwardedRef } from "react";

interface TextInputProps extends InputProps {
    onChange?: ChangeEventHandler<HTMLInputElement>;
    onBlur?: FocusEventHandler<HTMLInputElement> & ((e: FocusEvent<Element, Element>) => void);
    name?: string;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    placeholder?: string;
    label?: string;
    autoFocus?: boolean;
    defaultValue?: string | (readonly string[] & string) | undefined;
}

const TextInput = React.forwardRef((props: TextInputProps, ref: ForwardedRef<HTMLInputElement>) => {
    return (
        <Input
            {...props}
            classNames={{
                inputWrapper: "h-full"
            }}
            isRequired={props.required}
            type="text"
            ref={ref}
        />
    )
});

export type { TextInputProps }
export default TextInput;