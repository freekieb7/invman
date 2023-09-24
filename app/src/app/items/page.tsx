"use client";

import Header from "@/component/core/header";
import TextInput from "@/component/core/input/text";
import ModalDeleteItem from "@/component/item/modal/delete";
import SelectItemGroup from "@/component/item_group/select";
import { FilterOperator, ItemsFilter, ItemsFilterSubject } from "@/lib/graphql/__generated__/graphql";
import { GET_ITEMS } from "@/lib/graphql/query/item";
import { useQuery } from "@apollo/client";
import { AdjustmentsHorizontalIcon, ArrowPathIcon, EyeIcon, MagnifyingGlassIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Button, Spacer, Tooltip, useDisclosure, Divider, SelectItem, Card, CardHeader, CardBody, Badge, Chip, Select } from "@nextui-org/react";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import Link from "next/link";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

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

    if (error) enqueueSnackbar('Something went wrong', { variant: "error" });

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
                <Divider orientation="vertical" />
                <Tooltip content="Filter" placement="bottom" className="text-md">
                    <Badge content={filterCount > 0 ? filterCount : null} color="primary">
                        <Button isIconOnly color={filterOpen ? "primary" : "default"} onClick={() => setFilterOpen(!filterOpen)}>
                            <AdjustmentsHorizontalIcon className="h-6 w-6" />
                        </Button>
                    </Badge>
                </Tooltip>
                <Tooltip content="Refresh" placement="bottom" className="text-md">
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
                    <Filter onSearch={onFilter} onCountChange={(count) => setFilterCount(count)} />
                    <Spacer y={2} />
                </>
            )}
            <Table
                isStriped
                aria-label="Items table"
                isHeaderSticky={true}
                baseRef={scrollerRef}
                className="overflow-scroll"
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
                    <TableColumn>CREATED ON</TableColumn>
                    <TableColumn>UPDATED ON</TableColumn>
                    <TableColumn hideHeader>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody
                    isLoading={loading}
                    loadingContent={<Spinner />}
                    emptyContent={loading ? "Loading" : "No content available"}
                >
                    {(data?.items ?? []).map((item) => {
                        return (
                            <TableRow key={item.id}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.group?.name}</TableCell>
                                <TableCell>{item.createdAt}</TableCell>
                                <TableCell>{item.updatedAt}</TableCell>
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
                                        <Tooltip content="Delete"
                                            closeDelay={0}
                                            offset={15}
                                            disableAnimation
                                        >
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
    onCountChange: (count: number) => void;
    onSearch: (filters: ItemsFilter[]) => void;
}

type FormData = {
    filters: [ItemsFilter];
}

const Filter = (props: FilterProps) => {
    const {
        control,
        handleSubmit,
        register,
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

    const { fields, append, remove, update } = useFieldArray({
        control,
        name: "filters",
    });

    const onAdd = () => {
        append({
            subject: ItemsFilterSubject.Group,
            operator: FilterOperator.Equals,
            value: null,
        });
        props.onCountChange(fields.length + 1);
    }

    const onChange = (index: number, changedFilter: ItemsFilter) => {
        update(index, changedFilter)
    }

    const onRemove = (index: number) => {
        remove(index);
        props.onCountChange(fields.length + 1);
    }

    const onSubmit = handleSubmit((data) => {
        console.log(data);
        props.onSearch(data.filters.map(filter => {
            return {
                subject: filter.subject,
                operator: filter.operator,
                value: filter.value == "" ? null : filter.value,
            }
        }));
    })

    return (
        <form className="max-w-5xl" onSubmit={onSubmit}>
            <Card>
                <CardHeader>
                    Filters
                </CardHeader>
                <CardBody>
                    {fields.map((field, index) => {
                        const ValueField = () => {
                            switch (field.subject) {
                                case ItemsFilterSubject.Group:
                                    switch (field.operator) {
                                        case FilterOperator.Equals:
                                            return <SelectItemGroup
                                                defaultSelectedKeys={field.value ? [field.value] : []}
                                                onSelectionChange={(keys) => {
                                                    setValue(`filters.${index}.value` as `filters.0.value`, Array.from(keys).toString())
                                                }}
                                            />
                                    }

                                default:
                                    return <TextInput
                                        defaultValue={field.value ?? ""}
                                        {...register(`filters.${index}.value` as any)}
                                    // onChange={(event) => props.onChange({ ...props.value, value: event.target.value })}
                                    />
                            }
                        }


                        return (
                            <div key={field.id} className="flex gap-2 items-center py-1">
                                <Button isIconOnly variant="light" onClick={() => onRemove(index)}>
                                    <TrashIcon className="h-6 w-6" />
                                </Button>
                                <Select
                                    isRequired
                                    label="Subject"
                                    defaultSelectedKeys={[field.subject]}
                                    // {...register(`filters.${index}.subject` as any)}
                                    onChange={(event) => {
                                        onChange(index, { ...field, subject: event.target.value as ItemsFilterSubject })
                                    }}
                                // {...register(`filters.${index}.subject` as 'filters.0.subject', { required: true })}
                                >
                                    {Object.keys(ItemsFilterSubject).map((subject) => {
                                        return (
                                            <SelectItem key={subject.toLowerCase()} value={subject}>
                                                {subject}
                                            </SelectItem>
                                        );
                                    })}
                                </Select>
                                <Select
                                    isRequired
                                    label="Operator"
                                    defaultSelectedKeys={[field.operator]}
                                    onChange={(event) => {
                                        onChange(index, { ...field, operator: event.target.value as FilterOperator })
                                    }}
                                // {...register(`filters.${index}.operator` as 'filters.0.operator', { required: true })}
                                >
                                    {Object.keys(FilterOperator).map((operator) => {
                                        return (
                                            <SelectItem key={operator.toLowerCase()} value={operator}>
                                                {operator}
                                            </SelectItem>
                                        );
                                    })}
                                </Select>
                                <ValueField />
                            </div>
                        );
                    })}
                    <Spacer y={2} />
                    <div className="flex gap-2 max h-10 items-center ">
                        <Button type="submit" color="primary" className="w-fit">
                            <MagnifyingGlassIcon className="h-6 w-6" />
                            Search
                        </Button>
                        <Divider orientation="vertical" />
                        <Tooltip content={"Add filter"}>
                            <Button isIconOnly variant="light" onClick={onAdd}>
                                <PlusIcon className="h-6 w-6" />
                            </Button>
                        </Tooltip>
                    </div>

                </CardBody>
            </Card>
        </form>
    );
}
