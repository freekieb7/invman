import { Input, InputProps } from "@nextui-org/react"
import React, { ChangeEventHandler, FocusEvent, FocusEventHandler, ForwardedRef, ReactElement, ReactNode, Ref } from "react";

interface Props {
    label?: ReactNode;
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
    errorMessage?: ReactNode;
    afterLabel?: ReactNode;
    defaultValue?: string;
}

const TextInput = (props: Props, ref: ForwardedRef<HTMLInputElement>) => {
    return (
        <div className="text-small">
            <div className="flex flex-row">
                {props.label}
                {props.required &&
                    <span className="text-danger">*</span>
                }
                {props.afterLabel &&
                    <div className="pl-1">{props.afterLabel}</div>
                }
            </div>
            <Input
                {...props}
                label={undefined}
                isRequired={props.required}
                type="text"
                ref={ref}
                defaultValue={props.defaultValue as any}
            />
        </div>
    )
};


export type TextInputProps = Props & { ref?: Ref<HTMLElement> };
export default React.forwardRef(TextInput) as (props: TextInputProps) => ReactElement;