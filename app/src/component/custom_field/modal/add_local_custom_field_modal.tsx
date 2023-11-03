import TextInput from "@/component/core/input/text";
import { Select } from "@/component/core/select";
import { Tooltip } from "@/component/core/tooltip";
import { CustomFieldsWithValueInput, TextCustomFieldInputWithValue } from "@/lib/graphql/__generated__/graphql";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { Button, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, SelectItem, Spacer } from "@nextui-org/react";
import { enqueueSnackbar } from "notistack";
import { useForm } from "react-hook-form";

enum CustomFieldType {
    None = "None",
    Text = "Text",
}

interface Props {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onAdd: (dynamicFields: CustomFieldsWithValueInput) => void;
}

const AddLocalCustomFieldModal = (props: Props) => {
    let valueHolder: CustomFieldsWithValueInput = {};

    const {
        handleSubmit,
        register,
        watch,
        formState: { errors, isValid }
    } = useForm<{
        name?: string;
        type?: CustomFieldType;
    }>({
        defaultValues: {
            name: undefined,
            type: undefined,
        }
    });

    const onSubmit = handleSubmit(async (data) => {
        switch (data.type) {
            case CustomFieldType.Text:
                props.onAdd({
                    textCustomField: {
                        ...valueHolder.textCustomField,
                        field: {
                            name: data.name!,
                        },
                    }
                })
                break;
            default:
                enqueueSnackbar('Custom field type could not be processed', { variant: "error" });
                return;
        }

        props.onOpenChange(false);
    })

    return (
        <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>
                            Add field to item
                        </ModalHeader>
                        <ModalBody>
                            <TextInput
                                label="Field name"
                                required={true}
                                {...register("name", {
                                    required: "Required",
                                })}
                                errorMessage={errors.name?.message}
                            />
                            <Select
                                label="Field type"
                                required={true}
                                {...register("type", {
                                    validate: {
                                        required: v => {
                                            if (!(v ?? "" in CustomFieldType)) {
                                                return "Required";
                                            }
                                            return;
                                        },
                                    },
                                })}
                                errorMessage={errors.type?.message}
                            >
                                <SelectItem key={CustomFieldType.Text}>
                                    {CustomFieldType.Text}
                                </SelectItem>
                                <SelectItem key={CustomFieldType.None}>
                                    {CustomFieldType.None}
                                </SelectItem>
                            </Select>
                            {watch("type") &&
                                <>
                                    <Divider />
                                    <ValueSection
                                        type={watch("type")!}
                                        onChange={(value) => {
                                            valueHolder = value;
                                        }}
                                    />
                                </>
                            }

                        </ModalBody>
                        <ModalFooter>
                            <Button variant="light" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit" color="primary" isDisabled={!isValid} onClick={onSubmit}>
                                Create
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}

interface ValueSectionProps {
    type: CustomFieldType,
    onChange: (value: CustomFieldsWithValueInput) => void,
}

const ValueSection = (props: ValueSectionProps) => {
    switch (props.type) {
        case CustomFieldType.Text:
            let field: TextCustomFieldInputWithValue = {
                field: {
                    name: "" // Required to define
                }
            };

            return (
                <>
                    <TextInput
                        label="Value"
                        onChange={(event) => {
                            field.value = event.target.value;
                            props.onChange({ textCustomField: field })
                        }}
                    />
                    <TextInput
                        label="Empty value"
                        afterLabel={<Tooltip content="When 'Value' is empty, 'Empty value' will become the 'Value'"><InformationCircleIcon className="h-4 w-4" /></Tooltip>}
                        onChange={(event) => {
                            field.onEmptyValue = event.target.value;
                            props.onChange({ textCustomField: field })
                        }}
                    />
                </>
            );
        default:
            return <div className="text-danger">Something went wrong</div>;
    }
}

export { CustomFieldType }
export default AddLocalCustomFieldModal;