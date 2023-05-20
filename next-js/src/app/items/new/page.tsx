"use client";
import CancelButton from "@/components/buttons/cancel-btn";
import { useSnackbar } from "@/components/snackbar";
import { useMutation } from "@apollo/client";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { gql } from "__generated__";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

type FormData = {
  name: string;
};

const CREATE_SERVICE = gql(/* GraphQL */ `
  mutation CreateService($name: String!) {
    createService(input: { name: $name }) {
      uuid
      name
      createdAt
      updatedAt
    }
  }
`);

export default function Page() {
  const [openSnackbar] = useSnackbar();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const [createService] = useMutation(CREATE_SERVICE);

  const onSubmit = handleSubmit(async (data) => {
    const result = await createService({ variables: { name: data.name } });

    if (result.errors != null) {
      openSnackbar(result.errors.map((error) => error.message).join("\n"));
      return;
    }

    router.back();
  });

  return (
    <div className="p-4 flex justify-center">
      <form onSubmit={onSubmit}>
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
            <button
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
            </button>
            <CancelButton />
          </div>
        </div>
      </form>
    </div>
  );
}
