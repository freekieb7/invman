import { Select as StyledSelect, SelectItem } from "@nextui-org/react"
import React, { ChangeEventHandler, FocusEvent, FocusEventHandler, ForwardedRef, JSXElementConstructor, ReactElement, ReactNode } from "react";

export type SelectProps = {
    onChange: ChangeEventHandler<HTMLSelectElement>;
    onBlur: FocusEventHandler<HTMLSelectElement> & ((e: FocusEvent<Element, Element>) => void);
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
    placeHolder?: string;
    defaultValue?: string;
    children?: ReactNode;
    // children?: CollectionChildren<object> & (ReactNode | ((item: object) => ReactElement<any, string | JSXElementConstructor<any>>));
}

const Select = React.forwardRef((props: SelectProps, ref: ForwardedRef<HTMLSelectElement>) => {
    return (
        <StyledSelect
            label={props.label}
            placeholder={props.placeHolder}
            className={props.className}
            onChange={props.onChange}
            onBlur={props.onBlur}
            ref={ref}
            name={props.name}
            required={props.required}
            isRequired={props.required}
            disabled={props.disabled}
            errorMessage={props.errorMessage}
            defaultSelectedKeys={props.defaultValue ? [props.defaultValue] : []}
            classNames={{
                popover: "w-auto"
            }}
        >
            {props.children as any}
        </StyledSelect>
    )
});

export default Select;