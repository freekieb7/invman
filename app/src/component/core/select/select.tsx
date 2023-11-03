import { ChevronDownIcon } from "@nextui-org/shared-icons";
import React, { ChangeEventHandler, ForwardedRef, Key, ReactElement, ReactNode, Ref, useEffect, useId, useMemo, useRef, useState } from "react";
import { Button, Listbox, Popover, PopoverContent, PopoverTrigger, Selection, Spacer, Spinner } from "@nextui-org/react";
import TextInput from "../input/text";
import { motion } from "framer-motion";
import { ReactRef, useDOMRef, filterDOMProps } from "@nextui-org/react-utils";

interface ItemProps<T> {
    /** Rendered contents of the item or child items. */
    children: ReactNode,
    /** Rendered contents of the item if `children` contains child items. */
    title?: ReactNode, // label?? contents?
    /** A string representation of the item's contents, used for features like typeahead. */
    textValue?: string,
    /** An accessibility label for this item. */
    'aria-label'?: string,
    /** A list of child item objects. Used for dynamic collections. */
    childItems?: Iterable<T>,
    /** Whether this item has children, even if not loaded yet. */
    hasChildItems?: boolean
}

type ItemElement<T> = ReactElement<ItemProps<T>>;
type ItemRenderer<T> = (item: T) => ItemElement<T>;

interface SectionProps<T> {
    /** Rendered contents of the section, e.g. a header. */
    title?: ReactNode,
    /** An accessibility label for the section. */
    'aria-label'?: string,
    /** Static child items or a function to render children. */
    children: ItemElement<T> | ItemElement<T>[] | ItemRenderer<T>,
    /** Item objects in the section. */
    items?: Iterable<T>
}

type SectionElement<T> = ReactElement<SectionProps<T>>;
type CollectionElement<T> = SectionElement<T> | ItemElement<T>;
type CollectionChildren<T> = CollectionElement<T> | CollectionElement<T>[] | ((item: T) => CollectionElement<T>);

interface Props<T> {
    name?: string;
    label: string;
    placeholder?: string;
    children: CollectionChildren<T>
    items?: Iterable<T>,
    onChange?: ChangeEventHandler<HTMLSelectElement> | undefined;
    required?: boolean;
    multiple?: boolean;
    isLoading?: boolean;
    isDisabled?: boolean;
    errorMessage?: string | null;
    emptyContent?: string | null;
    renderLabel?: (items: Key[]) => ReactNode;
    onSearchChange?: (text: string) => void;
    onLoadMore?: () => void;
    onSelectionChange?: (keys: Key[]) => void;
    onOpenChange?: (isOpen: boolean) => void;
    afterLabel?: ReactNode;
}

const Select = <T extends object>(props: Props<T>, ref: ForwardedRef<HTMLSelectElement>) => {
    const triggerRef = useRef<HTMLButtonElement>(null);
    const popupContentRef = useRef<HTMLDivElement>(null);
    const domRef = useRef(ref);

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
    const hasChildren = Array.from(props.items ?? []).length > 0 || React.Children.map(props.children, child => child).length > 0;

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
        const delayDebounceFn = setTimeout(() => {
            if (props.onSearchChange) props.onSearchChange(searchTerm);
        }, 500)

        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm]);

    useEffect(() => {
        if (isOpen && popupContentRef.current && triggerRef.current) {
            let selectRect = triggerRef.current.getBoundingClientRect();
            let popover = popupContentRef.current;

            popover.style.width = selectRect.width + "px";
        }
    }, [isOpen]);

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
        const newSelectedKeys = Array.from(keys);

        setSelectedKeys(newSelectedKeys);

        if (!props.multiple) {
            // Auto close after selecting item
            setIsOpen(false);
        }

        if (props.onChange) props.onChange({
            target: {
                ...domRef.current,
                value: Array.from(keys).join(","),
                name: props.name,
            },
        } as React.ChangeEvent<HTMLSelectElement>);

        // MUST BE CALLED LAST, influences state
        if (props.onSelectionChange) props.onSelectionChange(newSelectedKeys);
    }

    return (
        <div className="flex flex-col w-full">
            <select
                hidden
                ref={ref}
            />
            <div className="text-small flex flex-row">
                {props.label}
                {props.required &&
                    <span className="text-danger">*</span>
                }
                {props.afterLabel &&
                    <div className="pl-1">{props.afterLabel}</div>
                }
            </div>
            <Popover
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                placement={"bottom-start"}
                disableAnimation={true}
                triggerScaleOnOpen={false}
            >
                <PopoverTrigger>
                    <Button ref={triggerRef} className="bg-default-100 w-full flex px-3 hover:bg-default-200" endContent={renderIndicator} disabled={props.isDisabled} disableAnimation={true}>
                        <div className="grow flex flex-col text-left">
                            {renderLabel}
                        </div>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 border border-default-200">
                    {() => (
                        <div ref={popupContentRef} className="p-1">
                            {hasChildren && props.onSearchChange &&
                                <>
                                    <TextInput defaultValue={searchTerm ?? ""} onChange={(event) => setSearchTerm(event.target.value)} />
                                    <Spacer y={2} />
                                </>
                            }
                            {hasChildren
                                ? (
                                    <>
                                        <Listbox
                                            aria-label="Select listbox"
                                            items={props.items}
                                            selectionMode={props.multiple ? "multiple" : "single"}
                                            selectedKeys={selectedKeys}
                                            onSelectionChange={onSelectionChange}
                                            className="max-h-64 overflow-y-auto"
                                            onScroll={onScroll}
                                        >
                                            {props.children}
                                        </Listbox>
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

export type SelectProps<T = object> = Props<T> & { ref?: Ref<HTMLElement> };

// forwardRef doesn't support generic parameters, so cast the result to the correct type
export default React.forwardRef(Select) as <T = object>(props: SelectProps<T>) => ReactElement;