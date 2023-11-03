import { DELETE_ITEM } from "@/lib/graphql/query/item";
import { useMutation } from "@apollo/client";
import { TrashIcon } from "@heroicons/react/24/solid";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner } from "@nextui-org/react"

type Props = {
    itemID?: string;
    isOpen?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    onDelete?: (id: string) => void;
}

const ModalDeleteItem = (props: Props) => {
    return (
        <Modal isOpen={props.isOpen} defaultOpen={props.defaultOpen} onOpenChange={props.onOpenChange}>
            <ModalContent>
                {(onClose) => {
                    return (
                        props.itemID == undefined
                            ? <div>Item ID could not be found</div>
                            : <ModalLayout itemID={props.itemID} onDelete={props.onDelete} onClose={onClose} />
                    )
                }}
            </ModalContent>
        </Modal >
    )
}

const ModalLayout = ({ onDelete, onClose, itemID }: { onDelete?: (id: string) => void, onClose: () => void, itemID: string }) => {
    const [deleteItem, { loading: delLoading }] = useMutation(DELETE_ITEM, {
        update(cache) {
            cache.evict({ id: `Item:${itemID}` });
            cache.gc();
        }
    });

    const onSubmit = async () => {
        const result = await deleteItem({
            variables: {
                id: itemID
            }
        });

        if (result.errors) {
            console.log(result);
            return
        }

        if (onDelete) onDelete(itemID);
        onClose();
    };

    return (
        <>
            <ModalHeader className="flex flex-col gap-1">Delete item</ModalHeader>
            <ModalBody>
                <p>
                    Do you want to delete this item?
                </p>
            </ModalBody>
            <ModalFooter>
                <Button variant="light" onPress={onClose}>
                    Cancel
                </Button>
                <Button isLoading={delLoading} color="danger" startContent={delLoading ? null : <TrashIcon className="h-6 w-6" />} onPress={onSubmit}>
                    Delete
                </Button>
            </ModalFooter>
        </>
    );
}

export default ModalDeleteItem;