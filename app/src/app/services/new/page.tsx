"use client";
import { useSnackbar } from "features/general/snackbar";
import { useMutation } from "@apollo/client";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import FormCancelButton from "@/features/general/form/FormCancelBtn";
import FormCreateButton from "@/features/general/form/FormCreateBtn";
import { CREATE_SERVICE } from "lib/graphql/query/service";

type FormData = {
  name: string;
};

export default function Page() {
  const router = useRouter();
  const [openSnackbar] = useSnackbar();
  const [createService] = useMutation(CREATE_SERVICE);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = handleSubmit(async (data) => {
    const result = await createService({ variables: { name: data.name } });

    if (result.errors != null) {
      openSnackbar(result.errors.map((error) => error.message).join("\n"));
      return;
    }

    router.back();
  });

  return (
    <div className="flex justify-center">
      <form>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <label className="block">
              <label className="block" htmlFor="nickname">Name *</label>
              <input
                {...register("name", {
                  required: { value: true, message: "This field is required" },
                  minLength: { value: 3, message: "This field requires at least 1 character" },
                  maxLength: { value: 100, message: "This field requires allows max 100 characters" }
                })}
                id="name"
                type="text"
                className="p-2 border shadow-sm text-black border-slate-300 placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-indigo-500 block w-full rounded-md sm:text-sm focus:ring-1 invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500 disabled:shadow-none"
                placeholder="Service name"
                minLength={1} maxLength={100} required
              />
              {errors["name"] && (
                <p className="flex text-red-700 items-center">
                  <ExclamationTriangleIcon height={17} width={17} />
                  {errors["name"].message}
                </p>
              )}
            </label>
          </div>
          <div className="col-span-12 grid grid-cols-2 gap-4 items-center">
            <FormCreateButton isLoading={isSubmitting} onClick={onSubmit} />
            <FormCancelButton
              isLoading={isSubmitting}
              onClick={() => router.back()}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
