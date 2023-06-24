import { useSnackbar } from "@/features/general/snackbar";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { DELETE_SERVICE } from "../../../lib/graphql/query/service";
import ModalDelete from "@/features/general/modal/ModalDelete";

type Props = {
  uuid: string;
  afterDelete: () => void;
};

export default function DeleteServiceModal(props: Props) {
  const [openSnackbar] = useSnackbar();

  const form = useForm<FormData>();
  const [deleteService] = useMutation(DELETE_SERVICE);

  const handleDeleteService = () => {
    deleteService({
      variables: {
        uuid: props.uuid!,
      },
    }).then((result) => {
      if (result.errors != null) {
        openSnackbar(result.errors.map((error) => error.message).join("\n"));
        return;
      }

      props.afterDelete();
    });
  };

  return <ModalDelete onDelete={handleDeleteService} form={form} />;
}
