"use client";

import TextInput from "@/component/core/input/text";
import { Select } from "@/component/core/select";
import { GlobalFieldType } from "@/lib/graphql/__generated__/graphql";
import { GET_SETTINGS } from "@/lib/graphql/query/settings";
import { useQuery } from "@apollo/client";
import { Card, CardBody, CardHeader, SelectItem, Skeleton, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";

export default function Page() {
    const { data, loading, error } = useQuery(GET_SETTINGS);

    if (loading) return <div className="flex justify-center items-center h-full w-full"><Spinner /></div>

    return (
        <div className="grid grid-cols-2 gap-2">
            <Card>
                <CardHeader>
                    Modules
                </CardHeader>
                <CardBody>
                    <Table aria-label="Modules">
                        <TableHeader>
                            <TableColumn>Module</TableColumn>
                            <TableColumn>Active</TableColumn>
                        </TableHeader>
                        <TableBody
                            isLoading={loading}
                            loadingContent={<Spinner />}
                            emptyContent={loading ? "Loading" : "No content available"}
                        >
                            <TableRow>
                                <TableCell>
                                    Module inspections
                                </TableCell>
                                <TableCell>
                                    {data?.settings.moduleInspectionsActive ? "Yes" : "No"}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>
            <Card>
                <CardHeader>
                    Item fields
                </CardHeader>
                <CardBody>
                    {(data?.settings.globalFields ?? []).map(field => {
                        return (
                            <div className="flex gap-2">
                                <TextInput />
                                <Select>
                                    <SelectItem key={GlobalFieldType.String}>
                                        Text
                                    </SelectItem>
                                    <SelectItem key={GlobalFieldType.Integer}>
                                        Number
                                    </SelectItem>
                                    <SelectItem key={GlobalFieldType.Float}>
                                        Number
                                    </SelectItem>
                                </Select>
                                <p>{field.name}</p>
                                <p>{field.type}</p>
                            </div>
                        );
                    })}

                </CardBody>
            </Card>
        </div>
    );
}