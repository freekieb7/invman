import { ChevronDownIcon } from "@nextui-org/shared-icons";
import React, { Key, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Button, Listbox, ListboxProps, Popover, PopoverContent, PopoverTrigger, Selection, Spacer, Spinner } from "@nextui-org/react";
import TextInput from "../input/text";
import { AnimatePresence, motion } from "framer-motion"

interface Props<T = object> extends Omit<ListboxProps<T>, "onSelectionChange"> {
    required?: boolean;
    isLoading?: boolean;
    isDisabled?: boolean;
    errorMessage?: string | null;
    emptyContent?: string | null;
    renderLabel?: (items: Key[]) => ReactNode;
    searchDelay?: number;
    onSearchChange?: (text: string) => void;
    onLoadMore?: () => void;
    onSelectionChange?: (keys: Key[]) => void;
    onOpenChange?: (isOpen: boolean) => void;
}

const Select = <T extends object>(props: Props<T>) => {
    const triggerRef = useRef<HTMLButtonElement>(null);
    const popupContentRef = useRef<HTMLDivElement>(null);

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>();
    const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);

    useEffect(() => {
        if (props.onOpenChange) props.onOpenChange(isOpen);
    }, [isOpen]);

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

    useEffect(() => {
        if (searchTerm === undefined) return; // Prevents calling seach change event on first time rendering

        const delayDebounceFn = setTimeout(() => {
            if (props.onSearchChange) props.onSearchChange(searchTerm);
        }, props.searchDelay ?? 500)

        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm]);

    const renderLabel = useMemo(() => {
        if (!selectedKeys || selectedKeys.length <= 0) return props.placeholder;

        if (props.renderLabel && typeof props.renderLabel === "function") {
            return props.renderLabel(selectedKeys);
        }

        return selectedKeys.join(", ");
    }, [selectedKeys, props.renderLabel]);

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

    const onScroll = (event: React.UIEvent<HTMLUListElement>) => {
        const bottom = event.currentTarget.scrollHeight - event.currentTarget.scrollTop === event.currentTarget.clientHeight;
        if (bottom) {
            if (props.onLoadMore) props.onLoadMore();
        }
    }

    const onSelectionChange = (keys: Selection) => {
        const newSelectedKeys = Array.from(keys).map(key => key);

        setSelectedKeys(newSelectedKeys);

        if (props.selectionMode === "single") {
            setIsOpen(false);
        }

        // MUST BE CALLED LAST, influences state
        if (props.onSelectionChange) props.onSelectionChange(newSelectedKeys);
    }

    useEffect(() => {
        if (isOpen && popupContentRef.current && triggerRef.current) {
            let selectRect = triggerRef.current.getBoundingClientRect();
            let popover = popupContentRef.current;

            popover.style.width = selectRect.width + "px";
        }
    }, [isOpen]);

    return (
        <div className="flex flex-col w-full">
            <Popover
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                placement={"bottom-start"}
                disableAnimation={true}
                triggerScaleOnOpen={false}
            >
                <PopoverTrigger>
                    <Button ref={triggerRef} className="bg-default-100 w-full h-14 flex px-3 hover:bg-default-200" endContent={renderIndicator} disabled={props.isDisabled} disableAnimation={true}>
                        <div className="grow flex flex-col text-left">
                            {props.label &&
                                <div className="text-foreground-600 flex">
                                    {props.label}{props.required && <div className="text-danger">*</div>}
                                </div>
                            }
                            {renderLabel}
                        </div>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                    {(titleProps) => (
                        <div ref={popupContentRef} className="p-1">
                            {props.onSearchChange &&
                                <>
                                    <TextInput defaultValue={searchTerm ?? ""} onChange={(event) => setSearchTerm(event.target.value)} />
                                    <Spacer y={2} />
                                </>
                            }
                            {Array.from(props.items ?? []).length > 0 || React.Children.map(props.children, child => child).length > 0
                                ? (
                                    <>
                                        <Listbox
                                            {...props}
                                            selectionMode={props.selectionMode}
                                            selectedKeys={selectedKeys}
                                            onSelectionChange={onSelectionChange}
                                            className="max-h-64 overflow-y-auto"
                                            onScroll={onScroll}

                                        />
                                        {props.isLoading &&
                                            <div className="flex justify-center py-1"><Spinner color="default" /></div>
                                        }
                                    </>
                                )
                                : (
                                    props.isLoading
                                        ? <div className="flex justify-center py-1"><Spinner color="default" /></div>
                                        : <p className="text-center pb-1">{props.emptyContent}</p>
                                )
                            }

                        </div>
                    )}
                </PopoverContent>
            </Popover>
            {props.errorMessage &&
                <div className="flex relative flex-col gap-1.5 pt-1 px-1">
                    <div className="text-tiny text-danger">
                        {props.errorMessage}
                    </div>
                </div>
            }
        </div>
    );
};

export type { Props };
export default Select;