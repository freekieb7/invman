import { Input } from "@nextui-org/react"
import React, { ChangeEventHandler, FocusEvent, FocusEventHandler, ForwardedRef } from "react";

export type NumberInputProps = {
    onChange?: ChangeEventHandler<HTMLInputElement>;
    onBlur?: FocusEventHandler<HTMLInputElement> & ((e: FocusEvent<Element, Element>) => void);
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
    placeholder?: string;
    label?: string;
}

const NumberInput = React.forwardRef((props: NumberInputProps, ref: ForwardedRef<HTMLInputElement>) => {
    return (
        <Input
            {...props}
            type="text"
            ref={ref}
            isRequired={props.required}
            onKeyDown={(event) => {
                const key = event.key;
                if (key == "Enter") return;
                if (key == "Backspace") return;
                if (key == "Delete") return;
                if (key == "ArrowLeft") return;
                if (key == "ArrowRight") return;

                if (!Number.isInteger(Number(event.key))) event.preventDefault();
            }}
        />
    )
});

export default NumberInput;