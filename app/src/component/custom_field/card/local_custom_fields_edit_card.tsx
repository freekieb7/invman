import { CustomFieldsWithValueInput } from "@/lib/graphql/__generated__/graphql";
import { KeyIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Button, Card, CardBody, CardHeader, Spacer, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import AddLocalCustomFieldModal, { CustomFieldType } from "../modal/add_local_custom_field_modal";
import { Tooltip } from "@/component/core/tooltip";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

type FormValues = {
    localCustomFields: CustomFieldsWithValueInput[];
}

interface Props {
    className?: string;
    allowEdit?: boolean;
    onChange?: (localCustomFields: CustomFieldsWithValueInput[]) => void;
}

const LocalCustomFieldsEditCard = (props: Props) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

    const { control, getValues } = useForm<FormValues>();
    const { fields, append, remove } = useFieldArray({
        control: control,
        name: "localCustomFields",
    });

    useEffect(() => {
        if (props.onChange) props.onChange(getValues().localCustomFields);
    }, [fields]);

    const onAdd = (dynamicFields: CustomFieldsWithValueInput) => {
        if (dynamicFields.textCustomField) {
            append({
                textCustomField: dynamicFields.textCustomField
            })
        }
    }

    const rows = fields.map(field => {
        let name: string = "?";
        let type: string = "?";
        let value: string | undefined = undefined;
        let emptyValue: string | undefined = undefined;

        if (field.textCustomField) {
            name = field.textCustomField.field.name;
            type = CustomFieldType.Text;
            value = field.textCustomField.value ?? undefined;
            emptyValue = field.textCustomField.onEmptyValue ?? undefined;
        }

        return {
            key: field.id,
            name: name,
            type: type,
            value: value,
            emptyValue: emptyValue,
        };
    });

    const columns = [
        {
            key: "name",
            label: "Name"
        },
        {
            key: "type",
            label: "Type"
        },
        {
            key: "value",
            label: "Value"
        },
        {
            key: "emptyValue",
            label: "Empty value"
        },
        {
            key: "actions",
            label: "",
            hideHeader: true,
        }
    ];

    return (
        <>
            {isAddModalOpen &&
                <AddLocalCustomFieldModal isOpen={isAddModalOpen} onOpenChange={setIsAddModalOpen} onAdd={onAdd} />
            }
            <Card className={props.className}>
                <CardHeader>
                    <KeyIcon className="h-6 w-6" />
                    <Spacer />
                    Private custom fields
                    <Spacer />
                    <Tooltip content={
                        <div className="px-1 py-2">
                            <div className="text-small font-bold">Private custom fields</div>
                            <div className="text-tiny">Private custom fields are:</div>
                            <ul className="list-disc list-inside text-tiny">
                                <li>
                                    only available for a single item;
                                </li>
                                <li>
                                    not shared between items;
                                </li>
                                <li>
                                    meant for when an items required a unique field;
                                </li>
                                <li>
                                    meant as an alternative for global custom fields.
                                </li>
                            </ul>
                        </div>
                    }>
                        <InformationCircleIcon className="h-4 w-4" />
                    </Tooltip>
                </CardHeader>
                <CardBody className="gap-2">
                    <Table aria-label="Local custom-fields" removeWrapper isStriped>
                        <TableHeader columns={columns}>
                            {(column) => (
                                <TableColumn
                                    hideHeader={column.hideHeader}
                                    key={column.key}
                                >
                                    {column.label}
                                </TableColumn>
                            )}
                        </TableHeader>
                        <TableBody items={rows}>
                            {(item) => (
                                <TableRow key={item.key}>
                                    {(columnKey) => {
                                        const value = getKeyValue(item, columnKey);

                                        if (columnKey == "value" && value === undefined) {
                                            return (
                                                <TableCell>
                                                    <i>No value</i>
                                                </TableCell>
                                            );
                                        }

                                        if (columnKey == "emptyValue" && value === undefined) {
                                            return (
                                                <TableCell>
                                                    <i>No value</i>
                                                </TableCell>
                                            );
                                        }

                                        if (columnKey == "actions") {
                                            return (
                                                <TableCell>
                                                    <Tooltip content="Delete">
                                                        <span className="cursor-pointer active:opacity-50" onClick={() => remove(fields.findIndex(field => field.id == item.key))}>
                                                            <TrashIcon className="w-4 h-4 text-danger" />
                                                        </span>
                                                    </Tooltip>
                                                </TableCell>
                                            );
                                        }

                                        return (
                                            <TableCell>
                                                {value}
                                            </TableCell>
                                        );
                                    }}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <Tooltip content={"Add"}>
                        <Button isIconOnly onClick={() => setIsAddModalOpen(true)}>
                            <PlusIcon className="h-8 w-8" />
                        </Button>
                    </Tooltip>
                </CardBody>
            </Card>
        </>
    );
};

export default LocalCustomFieldsEditCard;