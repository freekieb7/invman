import { ChevronDownIcon } from "@nextui-org/shared-icons";
import React, { Key, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Button, Listbox, ListboxProps, Popover, PopoverContent, PopoverTrigger, Selection, Spacer, Spinner } from "@nextui-org/react";
import TextInput from "../input/text";
import { motion } from "framer-motion"

interface Props<T> extends ListboxProps<T> {
    required?: boolean;
    isLoading?: boolean;
    isDisabled?: boolean;
    errorMessage?: string | null;
    renderLabel?: (items: Key[]) => ReactNode;
    searchDelay?: number;
    onSearchChange?: (text: string) => void;
    onLoadMore?: () => void;
    onSelectedChange?: (keys: Key[]) => void;
    onOpenChange?: (isOpen: boolean) => void;
}

const Select = <T extends object>(props: Props<T>) => {
    const popupContentRef = useRef<HTMLDivElement>(null);

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>();
    const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);

    // Close the popover when clicking outside of element
    useEffect(() => {
        document.addEventListener("mousedown", (event: MouseEvent) => {
            const popupContentDimensions = popupContentRef.current?.getBoundingClientRect();

            if (popupContentDimensions === undefined) return;

            if (
                event.clientX < popupContentDimensions.left ||
                event.clientX > popupContentDimensions.right ||
                event.clientY < popupContentDimensions.top ||
                event.clientY > popupContentDimensions.bottom
            ) {
                setIsOpen(false);
            }
        });
    }, [popupContentRef]);

    // Apply delay to searchTerm change event
    useEffect(() => {
        if (searchTerm === undefined) return; // Prevents calling seach change event on first time rendering

        const delayDebounceFn = setTimeout(() => {
            if (props.onSearchChange) props.onSearchChange(searchTerm);
        }, props.searchDelay ?? 500)

        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm]);


    // Render label of select button
    const renderSelectedItem = useMemo(() => {
        if (!selectedKeys || selectedKeys.length <= 0) return props.placeholder;

        if (props.renderLabel && typeof props.renderLabel === "function") {
            return props.renderLabel(selectedKeys);
        }

        return selectedKeys.join(", ");
    }, [selectedKeys, props.renderLabel]);

    // Render icon of select button
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

    // Load more items when listbox scroll reached bottom
    const handleScroll = (event: React.UIEvent<HTMLUListElement>) => {
        const bottom = event.currentTarget.scrollHeight - event.currentTarget.scrollTop === event.currentTarget.clientHeight;
        if (bottom) {
            if (props.onLoadMore) props.onLoadMore();
        }
    }

    // Handle changed selection of items
    const onSelectionChange = (keys: Selection) => {
        const newSelectedKeys = Array.from(keys).map(key => key);

        setSelectedKeys(newSelectedKeys);

        if (props.selectionMode === "single") {
            setIsOpen(false);
        }

        // MUST BE CALLED LAST, influences state
        if (props.onSelectedChange) props.onSelectedChange(newSelectedKeys);
    }

    return (
        <div className="flex flex-col w-full">
            <Popover isOpen={isOpen} onOpenChange={(newIsOpen) => {
                setIsOpen(newIsOpen);
                if (props.onOpenChange) props.onOpenChange(newIsOpen);
            }} placement={"bottom-start"} motionProps={{
                transition: {
                    type: "spring",
                    damping: 5,
                    stiffness: 50
                }
            }}>
                <PopoverTrigger>
                    <Button className="bg-default-100 w-full h-14 flex" endContent={renderIndicator} disabled={props.isDisabled}>
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
                        <div {...titleProps} ref={popupContentRef}>
                            {props.onSearchChange &&
                                <>
                                    <TextInput defaultValue={searchTerm ?? ""} onChange={(event) => setSearchTerm(event.target.value)} />
                                    <Spacer y={2} />
                                </>
                            }
                            <Listbox {...props} selectionMode={props.selectionMode} selectedKeys={selectedKeys} onSelectionChange={onSelectionChange} className="max-h-64 overflow-y-auto" onScroll={handleScroll} />
                        </div>
                    )}
                </PopoverContent>
            </Popover>
            <div className="flex relative flex-col gap-1.5 pt-1 px-1">
                <div className="text-tiny text-danger">
                    {props.errorMessage}
                </div>
            </div>
        </div>
    );
};

export type { Props };
export default Select;