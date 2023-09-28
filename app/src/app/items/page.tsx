"use client";

import Header from "@/component/core/header";
import TextInput from "@/component/core/input/text";
import { Tooltip } from "@/component/core/tooltip";
import ModalDeleteItem from "@/component/item/modal/delete";
import SelectItemGroup from "@/component/item_group/select";
import { FilterOperator, ItemsFilter, ItemsFilterSubject } from "@/lib/graphql/__generated__/graphql";
import { GET_ITEMS } from "@/lib/graphql/query/item";
import { useQuery } from "@apollo/client";
import { AdjustmentsHorizontalIcon, ArrowPathIcon, EyeIcon, MagnifyingGlassIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Button, Spacer, useDisclosure, Divider, SelectItem, Card, CardHeader, CardBody, Badge, Select } from "@nextui-org/react";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import Link from "next/link";
import { enqueueSnackbar } from "notistack";
import { useEffect, useMemo, useState } from "react";
import { FieldArrayWithId, useFieldArray, useForm } from "react-hook-form";

export default function Page() {
    const [filterCount, setFilterCount] = useState<number>(0);
    const [itemToDelete, setItemToDelete] = useState<string>();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [hasMore, setHasMore] = useState<boolean>(false);
    const [filterOpen, setFilterOpen] = useState<boolean>(true);

    const rowsPerPage = 30;

    const { loading, error, data, fetchMore, refetch } = useQuery(GET_ITEMS, {
        variables: {
            limit: rowsPerPage,
            offset: 0,
        },
        onCompleted(data) {
            setHasMore(data.items.length >= rowsPerPage)
        },
    })

    const [loaderRef, scrollerRef] = useInfiniteScroll({
        hasMore,
        onLoadMore: () => {
            const currentLength = data?.items.length ?? 0;
            fetchMore({
                variables: {
                    offset: currentLength,
                    limit: rowsPerPage,
                },
            }).then(fetchMoreResult => {
                setHasMore(fetchMoreResult.data.items.length >= rowsPerPage);
            });
        }
    });

    const onFilter = (filters: ItemsFilter[]) => {
        refetch({
            offset: 0,
            filters: filters.filter(filter => filter.value),
        })
    }

    if (error) enqueueSnackbar('Unable to obtain items', { variant: "error" });

    return (
        <>
            <ModalDeleteItem itemID={itemToDelete} isOpen={isOpen} onOpenChange={onOpenChange} />
            <Header title="Items overview">
                <Link href={`/items/new`}>
                    <Button>
                        <PlusIcon className="h-6 w-6" />
                        Create item
                    </Button>
                </Link>
                <Link href={`/item_groups/new`}>
                    <Button>
                        <PlusIcon className="h-6 w-6" />
                        Create item group
                    </Button>
                </Link>
                <Divider orientation="vertical" />
                <Tooltip content="Filter" placement="bottom">
                    <Badge content={filterCount > 0 ? filterCount : null} color="primary">
                        <Button isIconOnly color={filterOpen ? "primary" : "default"} onClick={() => setFilterOpen(!filterOpen)}>
                            <AdjustmentsHorizontalIcon className="h-6 w-6" />
                        </Button>
                    </Badge>
                </Tooltip>
                <Tooltip content="Refresh" placement="bottom">
                    <Button isIconOnly onClick={() => {
                        refetch({
                            limit: rowsPerPage,
                            offset: 0,
                        }).then(fetchMoreResult => {
                            setHasMore(fetchMoreResult.data.items.length >= rowsPerPage);
                        });
                    }}>
                        <ArrowPathIcon className="h-6 w-6" />
                    </Button>
                </Tooltip>
            </Header>
            {filterOpen && (
                <>
                    <Filters isLoading={loading} onSearch={onFilter} onCountChange={(count) => setFilterCount(count)} />
                    <Spacer y={2} />
                </>
            )}
            <Table
                isStriped
                aria-label="Items table"
                isHeaderSticky={true}
                baseRef={scrollerRef}
                className="overflow-scroll shadow-lg"
                classNames={{
                    wrapper: "p-0",
                }}
                bottomContent={
                    hasMore ? (
                        <div className="flex justify-center pb-4">
                            <Spinner ref={loaderRef} />
                        </div>
                    ) : null
                }
            >
                <TableHeader>
                    <TableColumn>ID</TableColumn>
                    <TableColumn>GROUP</TableColumn>
                    {...(data?.items[0].globalFieldValues ?? []).map(field => {
                        return (
                            <TableColumn>{field.fieldName}</TableColumn>
                        )
                    }) as any},
                    <TableColumn hideHeader>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody
                    isLoading={loading}
                    loadingContent={<Spinner />}
                    emptyContent={loading ? " " : "No content available"}
                >
                    {(data?.items ?? []).map((item) => {
                        return (
                            <TableRow key={item.id}>
                                <TableCell>{item.pid}</TableCell>
                                <TableCell>{item.group?.name}</TableCell>
                                {...(item.globalFieldValues ?? []).map(field => {
                                    return (
                                        <TableCell>
                                            {field.value}
                                        </TableCell>
                                    )
                                }) as any}
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Tooltip content="Details"
                                            closeDelay={0}
                                            offset={15}
                                            disableAnimation
                                        >
                                            <Link href={`/items/${item.id}`}>
                                                <span className="cursor-pointer active:opacity-50">
                                                    <EyeIcon className="w-4 h-4" />
                                                </span>
                                            </Link>
                                        </Tooltip>
                                        <Tooltip content="Delete">
                                            <span className="cursor-pointer active:opacity-50" onClick={() => {
                                                setItemToDelete(item.id);
                                                onOpen();
                                            }}>
                                                <TrashIcon className="w-4 h-4 text-danger" />
                                            </span>
                                        </Tooltip>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </>
    );
}

interface FilterProps {
    isLoading?: boolean;
    onCountChange: (count: number) => void;
    onSearch: (filters: ItemsFilter[]) => void;
}

type FormData = {
    filters: [ItemsFilter];
}

const Filters = (props: FilterProps) => {
    const {
        control,
        handleSubmit,
        setValue,
    } = useForm<FormData>({
        defaultValues: {
            filters: [{
                subject: ItemsFilterSubject.Group,
                operator: FilterOperator.Equals,
                value: null,
            }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "filters",
    });

    const onAdd = () => {
        append({
            subject: ItemsFilterSubject.Group,
            operator: FilterOperator.Equals,
            value: null,
        });
    }

    const onChange = (index: number, changedFilter: ItemsFilter) => {
        setValue(`filters.${index}` as 'filters.0', changedFilter);
    }

    const onRemove = (index: number) => {
        remove(index);
    }

    const onSubmit = handleSubmit((data) => {
        props.onSearch(data.filters.map(filter => {
            return {
                subject: filter.subject,
                operator: filter.operator,
                value: filter.value == "" ? null : filter.value,
            }
        }));
    });

    useEffect(() => {
        props.onCountChange(fields.length);
    }, [fields])

    return (
        <form className="max-w-5xl" onSubmit={onSubmit}>
            <Card>
                <CardHeader>
                    Filters
                </CardHeader>
                <CardBody>
                    {fields.map((field, index) => <FilterRow
                        key={field.id}
                        field={field}
                        index={index}
                        onChange={(newFilter) => onChange(index, newFilter)}
                        onRemove={() => onRemove(index)}
                    />)}
                    <Spacer y={2} />
                    <div className="flex gap-2 max h-10 items-center justify-between ">
                        <Tooltip content={"Add filter"} placement="right">
                            <Button isIconOnly variant="light" onClick={onAdd}>
                                <PlusIcon className="h-6 w-6" />
                            </Button>
                        </Tooltip>
                        <Button isLoading={props.isLoading} type="submit" color="primary" className="w-fit" startContent={props.isLoading ? null : <MagnifyingGlassIcon className="h-6 w-6" />}>
                            Search
                        </Button>
                    </div>
                </CardBody>
            </Card>
        </form>
    );
}

interface FilterRowProps {
    field: FieldArrayWithId<FormData, "filters", "id">;
    index: number;
    onChange: (filter: ItemsFilter) => void;
    onRemove: () => void;
}

const FilterRow = (props: FilterRowProps) => {
    const [filter, setFilter] = useState<ItemsFilter>({
        subject: props.field.subject,
        operator: props.field.operator,
        value: props.field.value,
    });

    useEffect(() => {
        props.onChange(filter);
    }, [filter]);

    const SubjectSelecter = () => {
        return (
            <Select
                isRequired
                label="Subject"
                defaultSelectedKeys={[filter.subject]}
                onChange={(event) => {
                    setFilter({
                        subject: event.target.value as ItemsFilterSubject,
                        operator: FilterOperator.Contains,
                        value: null,
                    });
                }}
            >
                {Object.keys(ItemsFilterSubject).map((subject) => {
                    return (
                        <SelectItem key={subject.toLowerCase()} value={subject}>
                            {subject}
                        </SelectItem>
                    );
                })}
            </Select>
        );
    }

    const OperatorSelecter = () => {
        return (
            <Select
                isRequired
                label="Operator"
                defaultSelectedKeys={[filter.operator]}
                onChange={(event) => {
                    setFilter({
                        subject: filter.subject,
                        operator: event.target.value as FilterOperator,
                        value: null,
                    });
                }}
            >
                {Object.keys(FilterOperator).map((operator) => {
                    return (
                        <SelectItem key={operator.toLowerCase()} value={operator}>
                            {operator}
                        </SelectItem>
                    );
                })}
            </Select>
        );
    }

    const ValueField = useMemo(() => {
        switch (filter.subject) {
            case ItemsFilterSubject.Group:
                switch (filter.operator) {
                    case FilterOperator.Equals:
                        return <SelectItemGroup
                            onSelectedChange={(keys) => {
                                setFilter({ ...filter, value: keys.toString() });
                            }}
                        />
                }

            default:
                return <TextInput
                    onChange={(event) => {
                        setFilter({ ...filter, value: event.target.value });
                    }}
                />
        }
    }, [filter.subject, filter.operator]);

    return (
        <div key={props.field.id} className="flex gap-2 py-1">
            <Tooltip content="Remove filter" placement="top">
                <Button className="h-full self-center" isIconOnly variant="light" onClick={() => props.onRemove()}>
                    <TrashIcon className="h-6 w-6" />
                </Button>
            </Tooltip>
            <SubjectSelecter />
            <OperatorSelecter />
            {ValueField}
        </div>
    );
}