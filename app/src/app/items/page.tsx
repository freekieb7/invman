"use client";

import Header from "@/component/core/header";
import { GET_ITEMS } from "@/lib/graphql/query/item";
import { useQuery } from "@apollo/client";
import { ArrowPathIcon, EyeIcon, PlusIcon } from "@heroicons/react/24/solid";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Pagination, Button, Spacer, Tooltip } from "@nextui-org/react";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import Link from "next/link";
import { useState } from "react";

export default function Page() {
    const [hasMore, setHasMore] = useState<boolean>(false);

    const rowsPerPage = 20;

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

    return (
        <>
            <Header title="Items overview" showGoBack={false} />
            <div className="flex gap-2">
                <Link href={`/items/new`}>
                    <Button isIconOnly aria-label="New item">
                        <PlusIcon className="h-6 w-6" />
                    </Button>
                </Link>

                <Button isIconOnly aria-label="Refresh" onClick={() => {
                    refetch({
                        limit: rowsPerPage,
                        offset: 0,
                    }).then(fetchMoreResult => {
                        setHasMore(fetchMoreResult.data.items.length >= rowsPerPage);
                    });
                }}>
                    <ArrowPathIcon className="h-6 w-6" />
                </Button>
            </div>
            <Spacer y={2} />
            <Table
                aria-label="Example table with client side pagination"
                isHeaderSticky={true}
                baseRef={scrollerRef}
                className="flex justify-center items-center flex-grow overflow-clip"
                classNames={{
                    thead: "max-h-[520px] overflow-scroll",
                    wrapper: "p-0",
                }}
                bottomContent={
                    hasMore ? (
                        <div className="flex w-full justify-center">
                            <Spinner ref={loaderRef} color="white" />
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
                    {(data?.items ?? []).map((item, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.createdAt}</TableCell>
                                <TableCell>{item.updatedAt}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Tooltip color="secondary" content="Details">
                                            <Link href={`/items/${item.id}`}>
                                                <span className="cursor-pointer active:opacity-50">
                                                    <EyeIcon className="w-4 h-4" />
                                                </span>
                                            </Link>
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