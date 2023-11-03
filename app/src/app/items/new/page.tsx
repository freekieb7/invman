"use client";

import Header from "@/component/core/header";
import TextInput from "@/component/core/input/text";
import GlobalCustomFieldsEditCard from "@/component/custom_field/card/global_custom_fields_edit_card";
import LocalCustomFieldsEditCard from "@/component/custom_field/card/local_custom_fields_edit_card";
import SelectItemGroup from "@/component/item_group/select";
import { CreateItemInput } from "@/lib/graphql/__generated__/graphql";
import { CREATE_ITEM } from "@/lib/graphql/query/item";
import { useMutation } from "@apollo/client";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Button, Card, CardBody, CardHeader, Spacer } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useForm } from "react-hook-form";

export default function Page() {
    const router = useRouter();
    const [createItem, { loading, error }] = useMutation(CREATE_ITEM);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<CreateItemInput>();

    const onSubmit = handleSubmit(async (data) => {
        let input: CreateItemInput = {
            pid: data.pid,
        };

        if (data.groupId) {
            input.groupId = data.groupId;
        }

        if (data.localCustomFields) {
            input.localCustomFields = data.localCustomFields;
        }

        if (data.globalCustomFieldsValues) {
            input.globalCustomFieldsValues = data.globalCustomFieldsValues;
        }

        const result = await createItem({
            variables: { input: input }
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
                                <TextInput
                                    label="ID"
                                    required
                                    {...register("pid", { required: "Required" })}
                                    errorMessage={errors.pid?.message}
                                />
                                <SelectItemGroup
                                    {...register("groupId")}
                                    errorMessage={errors.groupId?.message}
                                />
                            </CardBody>
                        </Card>
                    </div>
                    <div className="col-span-12 md:col-span-6">

                    </div>
                </div>
                <Spacer y={2} />
                <div className="grid grid-cols-12 gap-2">
                    <LocalCustomFieldsEditCard
                        className="col-span-12 md:col-span-6"
                        onChange={(fields) => setValue("localCustomFields", fields)}
                    />
                </div>

                <Spacer y={2} />
                <div className="flex gap-2">
                    <Button
                        color="primary"
                        startContent={loading ? null : <PlusIcon className="h-6 w-6" />}
                        onClick={onSubmit}
                        isLoading={loading}
                    >
                        Create
                    </Button>
                    <Button color="default" startContent={<XMarkIcon className="h-6 w-6" />}>
                        Cancel
                    </Button>
                </div>
            </form>
        </>
    );
};