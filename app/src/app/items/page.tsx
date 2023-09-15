"use client";

import { GET_ITEMS } from "@/lib/graphql/query/item";
import { useQuery } from "@apollo/client";
import { ArrowPathIcon, PlusIcon } from "@heroicons/react/24/solid";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Pagination, Button, Spacer } from "@nextui-org/react";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
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
            <div className="flex gap-3">
                <Button isIconOnly aria-label="New item" onClick={() => {

                }}>
                    <PlusIcon className="h-6 w-6" />
                </Button>
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
                classNames={{
                    base: "max-h-[520px] overflow-scroll",
                    table: "min-h-[400px]",
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
                </TableHeader>
                <TableBody
                    emptyContent={"No rows to display."}
                    isLoading={loading}
                    loadingContent={<Spinner />}
                >
                    {(data?.items ?? []).map((item, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.createdAt}</TableCell>
                                <TableCell>{item.updatedAt}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </>

    );
}