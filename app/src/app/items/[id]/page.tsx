"use client";

import Header from "@/component/core/header";
import { GET_ITEM } from "@/lib/graphql/query/item";
import { useQuery } from "@apollo/client";
import { Card, CardBody, CardHeader, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { useParams, useRouter } from "next/navigation";

export default function Page() {
    const params = useParams();

    const { loading, error, data } = useQuery(GET_ITEM, {
        variables: {
            id: params.id,
        },
    })

    return (
        <>
            <Header title="Item details">Test</Header>
            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        Info
                    </CardHeader>
                    <CardBody>
                        <Table aria-label="Item info">
                            <TableHeader>
                                <TableColumn>
                                    Attribute
                                </TableColumn>
                                <TableColumn>Value</TableColumn>
                            </TableHeader>
                            <TableBody
                                isLoading={loading}
                                loadingContent={<Spinner />}
                                emptyContent={loading ? "Loading" : "No content available"}
                            >
                                {loading
                                    ? []
                                    : [
                                        ...(data?.item?.attributes?.specific.fields ?? []).map((field, index) => {
                                            return (
                                                <TableRow key={index}>
                                                    <TableCell>{field.name}</TableCell>
                                                    <TableCell>{field.value}</TableCell>
                                                </TableRow>
                                            );
                                        }),
                                        <TableRow key="createdAt">
                                            <TableCell>Created at</TableCell>
                                            <TableCell>{data?.item?.createdAt}</TableCell>
                                        </TableRow>
                                    ]
                                }
                            </TableBody>
                        </Table>
                    </CardBody>
                </Card>
                {data?.item?.group != null &&
                    <Card>
                        <CardHeader>
                            Group
                        </CardHeader>
                        <CardBody>
                            <Table
                                aria-label="Group info"
                            >
                                <TableHeader>
                                    <TableColumn>
                                        Attribute
                                    </TableColumn>
                                    <TableColumn>Value</TableColumn>
                                </TableHeader>
                                <TableBody
                                    isLoading={loading}
                                    loadingContent={<Spinner />}
                                    emptyContent={loading ? "Loading" : "No content available"}
                                >
                                    {loading
                                        ? []
                                        : [
                                            <TableRow key="name">
                                                <TableCell>Name</TableCell>
                                                <TableCell>{data?.item?.group?.name}</TableCell>
                                            </TableRow>,
                                            ...(data?.item?.group?.attributes?.specific.fields ?? []).map((field, index) => {
                                                return (
                                                    <TableRow key={index}>
                                                        <TableCell>{field.name}</TableCell>
                                                        <TableCell>{field.value}</TableCell>
                                                    </TableRow>
                                                );
                                            }),
                                            <TableRow key="createdAt">
                                                <TableCell>Created at</TableCell>
                                                <TableCell>{data?.item?.group?.createdAt}</TableCell>
                                            </TableRow>
                                        ]
                                    }
                                </TableBody>
                            </Table>
                        </CardBody>
                    </Card>
                }

            </div>
        </>

    );
}