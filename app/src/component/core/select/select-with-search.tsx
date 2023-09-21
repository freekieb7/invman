import { Listbox } from "@nextui-org/listbox";
import { FreeSoloPopover } from "@nextui-org/popover";
import { ChevronDownIcon } from "@nextui-org/shared-icons";
import { Spinner } from "@nextui-org/spinner";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import React, { cloneElement, ForwardedRef, ReactElement, ReactNode, useEffect, useMemo, useState } from "react";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { AnimatePresence } from "framer-motion";
import { useSelect } from "@nextui-org/select";
import { UseSelectProps } from "@nextui-org/select/dist/use-select";
import { ListboxItem } from "@nextui-org/react";
import { HiddenSelect } from "./hidden-select";
import TextInput from "../input/text";

interface Props<T> extends Omit<UseSelectProps<T>, "isLabelPlaceholder"> {
    searchDelay?: number;
    onSearchChange?: (text: string) => void;
}

const SelectWithSearch = React.forwardRef(<T extends object>(props: Props<T>, ref: ForwardedRef<HTMLSelectElement>) => {
    const {
        state,
        label,
        hasHelper,
        isLoading,
        triggerRef,
        selectorIcon = <ChevronDownIcon />,
        description,
        errorMessage,
        startContent,
        endContent,
        placeholder,
        renderValue,
        disableAnimation,
        getBaseProps,
        getLabelProps,
        getTriggerProps,
        getValueProps,
        getListboxProps,
        getPopoverProps,
        getSpinnerProps,
        getMainWrapperProps,
        shouldLabelBeOutside,
        getInnerWrapperProps,
        getHiddenSelectProps,
        getHelperWrapperProps,
        getListboxWrapperProps,
        getDescriptionProps,
        getErrorMessageProps,
        getSelectorIconProps,
    } = useSelect<T>({ ...props, ref });

    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (props.onSearchChange) props.onSearchChange(searchTerm);
        }, props.searchDelay ?? 500)

        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm])

    const labelContent = label ? <label {...getLabelProps()}>{label}</label> : null;

    const clonedIcon = cloneElement(selectorIcon as ReactElement, getSelectorIconProps());

    const helperWrapper = useMemo(() => {
        if (!hasHelper) return null;

        return (
            <div {...getHelperWrapperProps()}>
                {errorMessage ? (
                    <div {...getErrorMessageProps()}>{errorMessage}</div>
                ) : description ? (
                    <div {...getDescriptionProps()}>{description}</div>
                ) : null}
            </div>
        );
    }, [
        hasHelper,
        errorMessage,
        description,
        getHelperWrapperProps,
        getErrorMessageProps,
        getDescriptionProps,
    ]);

    const renderSelectedItem = useMemo(() => {
        if (!state.selectedItems) return placeholder;

        if (renderValue && typeof renderValue === "function") {
            const mappedItems = [...state.selectedItems].map((item) => ({
                key: item.key,
                data: item.value,
                type: item.type,
                props: item.props,
                textValue: item.textValue,
                rendered: item.rendered,
                "aria-label": item["aria-label"],
            }));

            return renderValue(mappedItems);
        }

        return state.selectedItems.map((item: { textValue: any; }) => item.textValue).join(", ");
    }, [state.selectedItems, renderValue]);

    const renderIndicator = useMemo(() => {
        if (isLoading) {
            return <Spinner {...getSpinnerProps()} />;
        }

        return clonedIcon;
    }, [isLoading, clonedIcon, getSpinnerProps]);

    const popoverContent = useMemo(
        () => {
            return (
                state.isOpen ? (
                    <FreeSoloPopover {...getPopoverProps()} state={state} triggerRef={triggerRef}>
                        <ScrollShadow {...getListboxWrapperProps()}>
                            <TextInput
                                className="sticky top-0 z-10"
                                placeholder="Search"
                                onChange={(event) => setSearchTerm(event.target.value)}
                            />
                            <Listbox {...getListboxProps()}>
                                <ListboxItem key="new">New file</ListboxItem>
                            </Listbox>
                        </ScrollShadow>
                    </FreeSoloPopover>
                ) : null
            )
        },
        [state.isOpen, getPopoverProps, state, triggerRef, getListboxWrapperProps, getListboxProps],
    );

    return (
        <div {...getBaseProps()}>
            <HiddenSelect {...getHiddenSelectProps()} />
            {shouldLabelBeOutside ? labelContent : null}
            <div {...getMainWrapperProps()}>
                <div {...getTriggerProps()}>
                    {!shouldLabelBeOutside ? labelContent : null}
                    <div {...getInnerWrapperProps()}>
                        {startContent}
                        <span {...getValueProps()}>
                            {renderSelectedItem}
                            {state.selectedItems && <VisuallyHidden>,</VisuallyHidden>}
                        </span>
                        {endContent}
                    </div>
                    {renderIndicator}
                </div>
                {helperWrapper}
            </div>
            {disableAnimation ? popoverContent : <AnimatePresence>{popoverContent}</AnimatePresence>}
        </div>
    );
});

export default SelectWithSearch;