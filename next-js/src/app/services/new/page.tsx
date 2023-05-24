"use client";
import { useSnackbar } from "features/ui/snackbar";
import { useMutation } from "@apollo/client";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import FormCancelButton from "@/features/ui/form/formCancelBtn";
import FormCreateButton from "@/features/ui/form/formCreateBtn";
import { CREATE_SERVICE } from "@/features/services/fetching/graphql";

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
    formState: { errors },
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
              <span className="block text-sm font-medium text-slate-300">
                Name
              </span>
              <input
                {...register("name", { required: true })}
                className="p-1 rounded-[4px] placeholder-slate-400 contrast-more:placeholder-slate-500"
                placeholder="Service name"
              />
              {errors["name"] && (
                <p className="flex text-red-700 items-center">
                  <ExclamationTriangleIcon height={17} width={17} />
                  This field is required
                </p>
              )}
              <p className="mt-2 opacity-30 contrast-more:opacity-100 text-slate-100 text-sm">
                We need this to steal your identity.
              </p>
            </label>
          </div>
          <div className="col-span-12 grid grid-cols-2 gap-4 items-center">
            <FormCreateButton onClick={onSubmit} />
            {/* TODO */}
            {/* <button
              type="submit"
              className="p-1 rounded-sm bg-indigo-700 text-slate-100"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex h-6 items-center justify-center">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-purple-400 border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                </div>
              ) : (
                "Submit"
              )}
            </button> */}
            <FormCancelButton onClick={() => router.back()} />
          </div>
        </div>
      </form>
    </div>
  );
}
