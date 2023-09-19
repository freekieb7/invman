import { Input } from "@nextui-org/react"
import React, { ChangeEventHandler, FocusEvent, FocusEventHandler, ForwardedRef } from "react";

export type TextInputProps = {
    onChange?: ChangeEventHandler<HTMLInputElement>;
    onBlur?: FocusEventHandler<HTMLInputElement> & ((e: FocusEvent<Element, Element>) => void);
    name?: string;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    required?: boolean;
    disabled?: boolean;
    errorMessage?: string;
    className?: string;
    placeholder?: string;
    label?: string;
}

const TextInput = React.forwardRef((props: TextInputProps, ref: ForwardedRef<HTMLInputElement>) => {
    return (
        <Input
            {...props}
            isRequired={props.required}
            type="text"
            ref={ref}
        />
    )
});

export default TextInput;