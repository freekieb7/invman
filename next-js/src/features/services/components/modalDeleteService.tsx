import { useSnackbar } from "@/features/general/snackbar";
import { useMutation } from "@apollo/client";
import { FieldValues, useForm } from "react-hook-form";
import { DELETE_SERVICE } from "../../../lib/graphql/query/service";
import DeleteModal from "@/features/general/modal/modalDelete";

interface Props {
  uuid: string;
  onCancel: () => void;
  onDelete: () => void;
}

export default function ModalDeleteService({
  uuid,
  onCancel,
  onDelete,
}: Props) {
  const [openSnackbar] = useSnackbar();

  const form = useForm<FormData>();
  const [deleteService] = useMutation(DELETE_SERVICE);

  const handleDeleteService = async (fieldValues: FieldValues) => {
    const result = await deleteService({
      variables: {
        uuid: uuid,
      },
    });

    if (result.errors != null) {
      openSnackbar(result.errors.map((error) => error.message).join("\n"));
      return;
    }

    onDelete();
  };

  return (
    <DeleteModal onDelete={handleDeleteService} form={form}>
      <input hidden readOnly name="uuid" value={uuid} />
    </DeleteModal>
  );
}
