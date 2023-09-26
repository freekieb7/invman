"use client";

import Header from "@/component/core/header";
import FloatInput from "@/component/core/input/float";
import NumberInput, { NumberInputProps } from "@/component/core/input/number";
import TextInput, { TextInputProps } from "@/component/core/input/text";
import { Select } from "@/component/core/select";
import SelectItemGroup from "@/component/item_group/select";
import { CREATE_ITEM_GROUP } from "@/lib/graphql/query/item_group";
import { useMutation } from "@apollo/client";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Button, Card, CardBody, CardHeader, Spacer } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

type FormData = {
    name: string;
}

export default function Page() {
    const router = useRouter();
    const [createItemGroup, { loading }] = useMutation(CREATE_ITEM_GROUP);

    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<FormData>();

    const onSubmit = handleSubmit(async (data) => {
        const result = await createItemGroup({
            variables: {
                input: {
                    name: data.name,
                }
            }
        });

        if (result.errors) {
            console.log(result);
            return
        }

        router.back();
    })

    return (
        <>
            <Header title="New item group" />
            <form onSubmit={onSubmit}>
                <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-12 md:col-span-6">
                        <Card>
                            <CardHeader>
                                General
                            </CardHeader>
                            <CardBody>
                                <TextInput label="Name"
                                    {...register("name", { required: "Required" })}
                                    errorMessage={errors.name?.message}
                                />
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