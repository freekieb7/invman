import { XMarkIcon } from "@heroicons/react/24/solid";
import { useModal } from "./hook/useModal";
import { FieldValues, UseFormReturn, useForm } from "react-hook-form";

interface Props<T extends FieldValues> {
  onDelete: (data: T) => Promise<void>;
  form: UseFormReturn<T>;
}

export default function DeleteModal<T extends FieldValues>({
  onDelete,
  form,
  children,
}: Props<T> & { children: React.ReactNode }) {
  const [_, closeModal] = useModal();

  return (
    <form onSubmit={form.handleSubmit(onDelete)}>
      <div className="p-2 w-80 flex flex-col">
        <div className="flex justify-center items-center">
          <div className="font-bold">Delete</div>
          <XMarkIcon
            cursor={"pointer"}
            onClick={closeModal}
            className="h-5 w-5 text-purple-500 ml-auto flex items-center"
          />
        </div>
        <div className="pt-4">Are you sure?</div>
        {children}
        <div className="bottom-0 col-span-12 grid grid-cols-2 gap-4 items-center">
          <button
            type="submit"
            className="p-1 rounded-sm bg-indigo-700 text-slate-100"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <div className="flex h-6 items-center justify-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-purple-400 border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              </div>
            ) : (
              "Submit"
            )}
          </button>
          <button
            type="button"
            className="p-1 bg-gray-600 rounded-sm"
            onClick={closeModal}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
