"use client";

import Header from "@/component/core/header";
import TextInput from "@/component/core/input/text";
import { Select } from "@/component/core/select";
import ModalDeleteItem from "@/component/item/modal/delete";
import { GET_ITEMS } from "@/lib/graphql/query/item";
import { useQuery } from "@apollo/client";
import { AdjustmentsHorizontalIcon, ArrowPathIcon, EyeIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Button, Spacer, Tooltip, useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Divider, SelectItem } from "@nextui-org/react";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import Error from "next/error";
import Link from "next/link";
import { useState } from "react";

export default function Page() {
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


    if (error) return <Error statusCode={500} />;

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
                    <Button isIconOnly onClick={() => setFilterOpen(!filterOpen)}>
                        <AdjustmentsHorizontalIcon className="h-6 w-6" />
                    </Button>
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
                    <div className="flex gap-2 items-center">
                        <Select label="Field">
                            <SelectItem key={0}>
                                Name
                            </SelectItem>
                        </Select>
                        <Select label="Rule">
                            <SelectItem key={0}>
                                Contains
                            </SelectItem>
                        </Select>
                        <TextInput className="h-full" placeholder="Value" />
                        <Button isIconOnly variant="light">
                            <PlusIcon className="h-6 w-6" />
                        </Button>
                    </div>
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
                    <TableColumn>CREATED ON</TableColumn>
                    <TableColumn>UPDATED ON</TableColumn>
                    <TableColumn>Actions</TableColumn>
                </TableHeader>
                <TableBody
                    isLoading={loading}
                    loadingContent={<Spinner />}
                    emptyContent={loading ? "Loading" : "No content available"}
                >
                    {(data?.items ?? []).map((item) => {
                        return (
                            <TableRow key={item.id}>
                                <TableCell>

                                    {item.id}</TableCell>
                                <TableCell
                                >{item.createdAt}</TableCell>
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