"use client";

import Header from "@/component/core/header";
import FloatInput from "@/component/core/input/float";
import NumberInput, { NumberInputProps } from "@/component/core/input/number";
import TextInput, { TextInputProps } from "@/component/core/input/text";
import { Select, SelectProps } from "@/component/core/select";
import SelectItemGroup from "@/component/item_group/select";
import { CustomFieldInput, CustomFieldType } from "@/lib/graphql/__generated__/graphql";
import { CREATE_ITEM } from "@/lib/graphql/query/item";
import { useMutation } from "@apollo/client";
import { PlusIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Button, Card, CardBody, CardHeader, SelectItem, Spacer } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { FieldError, useFieldArray, useForm } from "react-hook-form";

type FormData = {
    pid: string;
    itemGroupID?: string;
    customFields: [CustomFieldInput];
}

export default function Page() {
    const router = useRouter();
    const [createItem, { loading, error }] = useMutation(CREATE_ITEM);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<FormData>();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "customFields",
    });

    const onSubmit = handleSubmit(async (data) => {
        const result = await createItem({
            variables: {
                input: {
                    pid: data.pid,
                    groupID: data.itemGroupID,
                    attributes: {
                        general: null, // TODO
                        specific: {
                            fields: data.customFields
                        }
                    }
                }
            }
        });

        if (result.errors) {
            console.log(result);
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
                                <TextInput label="ID"
                                    {...register("pid", { required: "Required" })}
                                />
                                <SelectItemGroup
                                    {...register(`itemGroupID`)}
                                />
                            </CardBody>
                        </Card>
                    </div>
                    <div className="col-span-12 md:col-span-6">
                        <Card>
                            <CardHeader>
                                Custom fields
                            </CardHeader>
                            <CardBody>
                                {fields.map((field, index) => (
                                    <CustomFieldRow
                                        key={field.id}
                                        nameProps={{
                                            ...register(`customFields.${index}.name` as 'customFields.0.name', { required: "Name is required" }),
                                            required: true,
                                            errorMessage: errors.customFields?.[index]?.name?.message,
                                        }}
                                        typeProps={{
                                            ...register(`customFields.${index}.type` as 'customFields.0.type', { required: "Name is required" }),
                                            defaultValue: field.type,
                                            required: true,
                                            errorMessage: (errors.customFields?.[index]?.type as FieldError | undefined)?.message,
                                        }}
                                        valueProps={{
                                            ...register(`customFields.${index}.value` as 'customFields.0.value'),
                                            errorMessage: errors.customFields?.[index]?.value?.message,
                                        }}
                                        onRemove={() => remove(fields.indexOf(field))}
                                    />
                                ))}
                                <Button isIconOnly onClick={() => {
                                    append({
                                        name: "",
                                        type: CustomFieldType.String,
                                        value: ""
                                    })
                                }}>
                                    <PlusIcon className="h-8 w-8" />
                                </Button>

                            </CardBody>
                        </Card>
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
}

interface RowProps {
    defaultValue?: CustomFieldInput;
    nameProps: TextInputProps;
    typeProps: SelectProps;
    valueProps: TextInputProps | NumberInputProps;
    onRemove: () => void;
}

const CustomFieldRow = (props: RowProps) => {
    const [fieldType, setFieldType] = useState<CustomFieldType>(props.defaultValue?.type as CustomFieldType ?? CustomFieldType.String);

    return (
        <div className="flex gap-2 pb-2">
            <div className="grid grid-cols-12 gap-2">
                <TextInput
                    {...props.nameProps}
                    label="Name"
                    className="col-span-4"
                />
                <Select
                    {...props.typeProps}
                    label="Type"
                    className="col-span-4"
                    onSelectionChange={(keys) => {
                        setFieldType(Array.from(keys)[0] as CustomFieldType);
                    }}
                >
                    <SelectItem key={CustomFieldType.String} value={CustomFieldType.String}>
                        Text
                    </SelectItem>
                    <SelectItem key={CustomFieldType.Integer} value={CustomFieldType.Integer}>
                        Whole number
                    </SelectItem>
                    <SelectItem key={CustomFieldType.Float} value={CustomFieldType.Float}>
                        Decimal number
                    </SelectItem>
                </Select>
                {fieldType == CustomFieldType.String &&
                    <TextInput
                        {...props.valueProps}
                        label="S Value"
                        className="col-span-4"
                    />
                }
                {fieldType == CustomFieldType.Integer &&
                    <NumberInput
                        {...props.valueProps}
                        label="I Value"
                        className="col-span-4"
                    />
                }
                {fieldType == CustomFieldType.Float &&
                    <FloatInput
                        {...props.valueProps}
                        label="F Value"
                        className="col-span-4"
                    />
                }
            </div>
            <Button isIconOnly onClick={props.onRemove}>
                <TrashIcon className="h-6 w-6" />
            </Button>
        </div>
    );
}