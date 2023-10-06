"use client";

import Header from "@/component/core/header";
import TextInput from "@/component/core/input/text";
import { Select, SelectProps } from "@/component/core/select";
import { Tooltip } from "@/component/core/tooltip";
import { CreateItemInput, CustomFieldsWithValueInput, TextCustomFieldInputWithValue } from "@/lib/graphql/__generated__/graphql";
import { CREATE_ITEM } from "@/lib/graphql/query/item";
import { useMutation } from "@apollo/client";
import { PencilIcon, PlusIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Button, Card, CardBody, CardHeader, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, SelectItem, Spacer, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { Control, useFieldArray, useForm } from "react-hook-form";

export default function Page() {
    const router = useRouter();
    const [createItem, { loading, error }] = useMutation(CREATE_ITEM);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, },
    } = useForm<CreateItemInput>();

    const onSubmit = handleSubmit(async (data) => {
        const result = await createItem({
            variables: {
                input: {
                    pid: data.pid,
                    groupId: data.groupId,
                    localCustomFields: data.localCustomFields
                }
            }
        });

        if (result.errors) {
            return
        }

        router.back();
    })

    if (error) enqueueSnackbar(error.message, { variant: "error" })

    return (
        <>
            <Header title="New item" />
            <form onSubmit={onSubmit}>
                <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-12 md:col-span-6">
                        <Card>
                            <CardHeader>
                                General
                            </CardHeader>
                            <CardBody className="flex flex-col gap-2">
                                <TextInput label="ID" required={true}
                                    {...register("pid", { required: "Required" })}
                                />
                                {/* <SelectItemGroup

                                /> */}
                                <LocalFieldsCard control={control} />
                            </CardBody>
                        </Card>
                    </div>
                    <div className="col-span-12 md:col-span-6">

                    </div>
                </div>
                <Spacer y={2} />
                <div className="flex gap-2">
                    <Button
                        color="primary"
                        startContent={loading ? null : <PlusIcon className="h-6 w-6" />}
                        onClick={onSubmit}
                        isLoading={loading}
                    >
                        Save
                    </Button>
                    <Button color="default" startContent={<XMarkIcon className="h-6 w-6" />}>
                        Cancel
                    </Button>
                </div>
            </form>
        </>
    );
};


interface LocalFieldsCardProps {
    control: Control<CreateItemInput, any>;
}

const LocalFieldsCard = (props: LocalFieldsCardProps) => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

    const { fields, append, remove } = useFieldArray({
        control: props.control,
        name: "localCustomFields",
    });

    return (
        <>
            <AddLocalCustomFieldModal isOpen={isCreateModalOpen} onOpenChange={(isOpen => setIsCreateModalOpen(isOpen))} onAdd={(dynamicFields) => {
                if (dynamicFields.textCustomField) {
                    append({
                        textCustomField: dynamicFields.textCustomField
                    })
                }

            }} />
            <Card className="border border-default-200">
                <CardHeader>
                    Custom fields
                </CardHeader>
                <CardBody className="gap-2">
                    <Table aria-label="local fields">
                        <TableHeader>
                            <TableColumn>Name</TableColumn>
                            <TableColumn>Type</TableColumn>
                            <TableColumn>Value</TableColumn>
                            <TableColumn>Empty value</TableColumn>
                            <TableColumn hideHeader>Actions</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {fields.map((field, index) => {
                                let name: string = "?";
                                let type: string = "?";
                                let value: any = null;
                                let onEmptyValue: any = null;

                                if (field.textCustomField) {
                                    name = field.textCustomField.field.name;
                                    type = "Text";
                                    value = field.textCustomField.value;
                                    onEmptyValue = field.textCustomField.onEmptyValue;
                                }

                                return (
                                    <TableRow key={field.id}>
                                        <TableCell>
                                            {name}
                                        </TableCell>
                                        <TableCell>
                                            {type}
                                        </TableCell>
                                        <TableCell>
                                            {value ??
                                                <i>No value</i>
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {onEmptyValue ??
                                                <i>Leave empty</i>
                                            }
                                        </TableCell>
                                        <TableCell className="flex gap-2">
                                            {/* <Tooltip content="Edit">
                                                <span className="cursor-pointer active:opacity-50">
                                                    <PencilIcon className="w-4 h-4" />
                                                </span>
                                            </Tooltip> */}
                                            <Tooltip content="Delete">
                                                <span className="cursor-pointer active:opacity-50" onClick={() => remove(index)}>
                                                    <TrashIcon className="w-4 h-4 text-danger" />
                                                </span>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}

                        </TableBody>
                    </Table>

                    <Tooltip content={"Add"}>
                        <Button isIconOnly onClick={() => setIsCreateModalOpen(true)}>
                            <PlusIcon className="h-8 w-8" />
                        </Button>
                    </Tooltip>
                </CardBody>
            </Card>
        </>
    );
};

interface AddLocalCustomFieldModal {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onAdd: (dynamicFields: CustomFieldsWithValueInput) => void;
}

enum CustomFieldType {
    None = "none",
    Text = "text",
}

const AddLocalCustomFieldModal = (props: AddLocalCustomFieldModal) => {
    const {
        handleSubmit,
        reset,
        setValue,
        setError,
        register,
        watch,
        formState: { errors }
    } = useForm<{
        name: string;
        type?: CustomFieldType;
    }>({
        defaultValues: {
            name: undefined,
            type: CustomFieldType.None
        }
    });

    const onSubmit = handleSubmit(async (data) => {
        if (data.type == CustomFieldType.None) {
            setError("type", { message: "Required" });
            return;
        }

        let dynamicFields: CustomFieldsWithValueInput = {};

        switch (data.type) {
            case CustomFieldType.Text:
                dynamicFields.textCustomField = {
                    ...textCustomField,
                    field: {
                        name: data.name
                    }
                }
                break;

            default:
                break;
        }

        props.onAdd(dynamicFields);
        props.onOpenChange(false);
        reset();
    })

    let textCustomField: TextCustomFieldInputWithValue;

    const ValueSection = () => {
        switch (watch("type")) {
            case CustomFieldType.Text:
                textCustomField = {
                    field: {
                        name: watch("name")
                    }
                }

                return (
                    <>
                        <TextInput label="Default value" onChange={(event) => textCustomField.onEmptyValue = event.currentTarget.value} />
                        <TextInput label="Current value" onChange={(event) => textCustomField.value = event.currentTarget.value} />
                    </>
                )
            default:
                return null
        }
    }

    return (
        <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>
                            Add field to item
                        </ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col gap-2">
                                <TextInput label="Field name" required={true}
                                    {...register("name", { required: "Required" })}
                                    errorMessage={errors.name?.message} />
                                <Select label="Field type" required={true} selectionMode="single"
                                    onSelectionChange={(keys) => {
                                        if (keys.length > 0) {
                                            const str = keys[0];
                                            const strEnum = str as unknown as CustomFieldType;

                                            setValue("type", strEnum)
                                        } else {
                                            setValue("type", CustomFieldType.None);
                                        }
                                    }}
                                    errorMessage={errors.type?.message}
                                >
                                    <SelectItem key={CustomFieldType.Text}>
                                        Text
                                    </SelectItem>
                                </Select>
                                <Divider />
                                <ValueSection />
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="light" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit" color="primary" onClick={onSubmit}>
                                Create
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}