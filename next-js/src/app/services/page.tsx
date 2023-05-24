"use client";

import { useModal } from "features/ui/modal/hook/useModal";
import LoadingOverlay from "@/features/ui/page/loadingPage";
import { useSnackbar } from "features/ui/snackbar";
import Table, { TableInfo, PageSizeOptions } from "features/ui/table/table";
import { useMutation, useQuery } from "@apollo/client";
import { Service } from "__generated__/graphql";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import DeleteModal from "@/features/ui/modal/modalDelete";
import TableCreateButton from "@/features/ui/table/tableCreateBtn";
import {
  DELETE_SERVICE,
  GET_SERVICES,
} from "@/features/services/fetching/graphql";
import ErrorPage from "@/features/ui/page/errorPage";

interface FormData {
  uuid: string;
}

export default function Page() {
  const [openSnackbar] = useSnackbar();
  const [openModal, closeModal] = useModal();

  const form = useForm<FormData>();

  const [tableInfo, setTableInfo] = useState<TableInfo<Service>>({
    page: 1,
    pageSize: PageSizeOptions[0],
    columns: ["UUID", "Name", "Created at", "Updated at"],
    rows: [],
  });

  const { loading, error, previousData, refetch } = useQuery(GET_SERVICES, {
    fetchPolicy: "network-only", // Could be smarter, but for now OK
    variables: {
      maxResults: tableInfo.pageSize,
    },
    onCompleted: (data) => {
      setTableInfo({
        ...tableInfo,
        rows: data.services.map((service) => {
          return {
            meta: service,
            values: [
              service.uuid,
              service.name,
              service.createdAt,
              service.updatedAt,
            ],
          };
        }),
      });
    },
  });

  const [deleteService] = useMutation(DELETE_SERVICE);

  const handlePageSizeChange = (pageSize: number) => {
    setTableInfo({
      ...tableInfo,
      pageSize: pageSize,
    });

    refetch({
      maxResults: pageSize,
    });
  };

  const handleDeleteService = async (data: FormData) => {
    const result = await deleteService({
      variables: {
        uuid: data.uuid,
      },
    });

    if (result.errors != null) {
      openSnackbar(result.errors.map((error) => error.message).join("\n"));
      return;
    }

    refetch();
    closeModal();
  };

  const onClickRemoveBtn = (rowIndex: number) => {
    form.reset();

    openModal(
      <DeleteModal form={form} onDelete={handleDeleteService}>
        <input
          {...form.register("uuid")}
          value={tableInfo.rows[rowIndex].meta.uuid}
        />
      </DeleteModal>
    );
  };

  if (error) return <ErrorPage />;

  if (previousData == null && loading) return <LoadingOverlay />;

  return (
    <>
      <Link href="/services/new">
        <TableCreateButton />
      </Link>
      <Table
        tableInfo={tableInfo}
        loading={false}
        onPageChange={() => {}} // TODO
        onSizeChange={handlePageSizeChange}
        onClickRemoveBtn={onClickRemoveBtn}
      />
    </>
  );
}
