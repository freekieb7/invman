import { ChevronDownIcon } from "@nextui-org/shared-icons";
import React, { ChangeEventHandler, Children, FormEvent, ForwardedRef, Key, ReactElement, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Button, Listbox, ListboxProps, Popover, PopoverContent, PopoverTrigger, SelectedItems, Selection, Spacer, Spinner, useListbox } from "@nextui-org/react";
import TextInput from "../input/text";
import { motion } from "framer-motion"
import { HiddenSelect } from "./hidden-select";

interface Props<T> extends ListboxProps<T> {
    required?: boolean;
    isLoading?: boolean;
    renderLabel?: (items: Key[]) => ReactNode;
    searchDelay?: number;
    onSearchChange?: (text: string) => void;
    onLoadMore?: () => void;
}

const DefaultSelect = <T extends object>(props: Props<T>) => {
    const [isOpen, setIsOpen] = useState<boolean>();
    const [selectedItems, setSelectedItems] = useState<Key[]>();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (props.onSearchChange) props.onSearchChange(searchTerm);
        }, props.searchDelay ?? 500)

        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm]);

    const renderSelectedItem = useMemo(() => {
        if (!selectedItems || selectedItems.length <= 0) return props.placeholder;

        if (props.renderLabel && typeof props.renderLabel === "function") {
            return props.renderLabel(selectedItems);
        }

        return selectedItems.join(", ");
    }, [selectedItems, props.renderLabel]);

    const renderIndicator = useMemo(() => {
        if (props.isLoading) {
            return <Spinner color="default" size="sm" />;
        }

        return (
            <motion.div
                animate={isOpen ? "open" : "closed"}
                variants={{
                    open: { rotate: 180 },
                    closed: { rotate: 0 }
                }}
                transition={{ duration: 0.2 }}
            >
                <ChevronDownIcon />
            </motion.div>
        );
    }, [props.isLoading, isOpen]);

    const handleScroll = (event: React.UIEvent<HTMLUListElement>) => {
        const bottom = event.currentTarget.scrollHeight - event.currentTarget.scrollTop === event.currentTarget.clientHeight;
        if (bottom) {
            if (props.onLoadMore) props.onLoadMore();
        }
    }

    const onSelectionChange = (keys: Selection) => {
        if (props.onSelectionChange) props.onSelectionChange(keys);
        setSelectedItems(Array.from(keys).map(key => key));
    }

    return (
        <div className="flex w-full">
            <Popover onOpenChange={setIsOpen} placement={"bottom-start"} motionProps={{
                transition: {
                    type: "spring",
                    damping: 5,
                    stiffness: 50
                }
            }}>
                <PopoverTrigger>

                    <Button className="bg-default-100 w-full h-14 flex" endContent={renderIndicator}>
                        <div className="grow flex flex-col text-left">
                            {props.label &&
                                <div className="text-foreground-500 font-medium text-tiny flex">
                                    {props.label}{props.required && <div className="text-danger">*</div>}
                                </div>
                            }
                            {renderSelectedItem}
                        </div>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[240px]">
                    {(titleProps) => (
                        <div {...titleProps}>
                            {props.onSearchChange &&
                                <>
                                    <TextInput onChange={(event) => setSearchTerm(event.target.value)} />
                                    <Spacer y={2} />
                                </>
                            }
                            <Listbox {...props} selectionMode="single" selectedKeys={selectedItems} onSelectionChange={onSelectionChange} className="max-h-[400px] overflow-y-auto" onScroll={handleScroll} />
                        </div>
                    )}
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default DefaultSelect as <T = object>(props: Props<T>) => ReactElement;