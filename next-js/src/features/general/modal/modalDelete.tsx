import { XMarkIcon } from "@heroicons/react/24/solid";
import { useModal } from "./hook/useModal";
import { FieldValues, UseFormReturn, useForm } from "react-hook-form";
import FormDeleteBtn from "../form/formDeleteBtn";
import FormCancelBtn from "../form/formCancelBtn";

interface Props<T extends FieldValues> {
  onDelete: (data: T) => Promise<void>;
  form: UseFormReturn<T>;
}

export default function DeleteModal<T extends FieldValues>({
  onDelete,
  form,
  children,
}: Props<T> & { children?: React.ReactNode }) {
  const [_, closeModal] = useModal();

  return (
    <div className="p-2 w-80 h-40 grid content-between">
      <div className="flex justify-between">
        <div className="font-bold">Delete</div>
        <XMarkIcon
          cursor={"pointer"}
          onClick={closeModal}
          className="h-5 w-5 text-purple-500"
        />
      </div>
      <div>Are you sure?</div>
      <form>
        <div className="flex flex-col justify-between">
          {children}
          <div className="col-span-12 grid grid-cols-2 gap-4 items-center">
            <FormDeleteBtn
              isLoading={form.formState.isSubmitting}
              onClick={form.handleSubmit(onDelete)}
            />
            <FormCancelBtn
              isLoading={form.formState.isSubmitting}
              onClick={closeModal}
            />
          </div>
        </div>
      </form>
    </div>
    // <div className="p-2 w-80 flex flex-col h-full">
    //   <div className="flex justify-center items-center">
    //     <div className="font-bold">Delete</div>
    //     <XMarkIcon
    //       cursor={"pointer"}
    //       onClick={closeModal}
    //       className="h-5 w-5 text-purple-500 ml-auto flex items-center"
    //     />
    //   </div>
    //   <div className="pt-4">Are you sure?</div>
    //   <form>
    //     <div className="flex flex-col justify-between">
    //       {children}
    //       <div className="col-span-12 grid grid-cols-2 gap-4 items-center">
    //         <FormDeleteBtn onClick={form.handleSubmit(onDelete)} />
    //         <FormCancelBtn onClick={closeModal} />
    //       </div>
    //     </div>
    //   </form>
    // </div>
  );
}
