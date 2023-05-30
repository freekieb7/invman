"use client";

import LoadingOverlay from "@/features/general/page/loadingPage";
import Table, {
  TableMeta,
  PageSizeOptions,
} from "features/general/table/table";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useState } from "react";
import TableCreateButton from "@/features/general/table/tableCreateBtn";
import ErrorPage from "@/features/general/page/errorPage";
import ModalDeleteService from "@/features/services/components/modalDeleteService";
import { useModal } from "@/features/general/modal/hook/useModal";
import {
  Order_By,
  Service,
  Service_Column,
} from "lib/graphql/__generated__/graphql";
import { GET_SERVICES } from "lib/graphql/query/service";

export default function Page() {
  const [tableMeta, setTableMeta] = useState<TableMeta<Service>>({
    page: 1,
    pageSize: PageSizeOptions[0],
    columns: [
      {
        name: "UUID",
        onOrderBy(order) {
          setTableMeta({
            ...tableMeta,
            columns: [
              ...tableMeta.columns.map((column) => {
                column.name === "UUID"
                  ? (column.orderBy = order)
                  : (column.orderBy = undefined);

                return column;
              }),
            ],
          });

          refetch({
            order: {
              name: Service_Column.Uuid,
              order: order,
            },
          });
        },
      },
      {
        name: "Name",
        onOrderBy(order) {
          setTableMeta({
            ...tableMeta,
            columns: [
              ...tableMeta.columns.map((column) => {
                column.name === "Name"
                  ? (column.orderBy = order)
                  : (column.orderBy = undefined);

                return column;
              }),
            ],
          });

          refetch({
            order: {
              name: Service_Column.Name,
              order: order,
            },
          });
        },
      },
      {
        name: "Created at",
        onOrderBy(order) {
          setTableMeta({
            ...tableMeta,
            columns: [
              ...tableMeta.columns.map((column) => {
                column.name === "Created at"
                  ? (column.orderBy = order)
                  : (column.orderBy = undefined);

                return column;
              }),
            ],
          });

          refetch({
            order: {
              name: Service_Column.CreatedAt,
              order: order,
            },
          });
        },
      },
      {
        name: "Updated at",
        onOrderBy(order) {
          setTableMeta({
            ...tableMeta,
            columns: [
              ...tableMeta.columns.map((column) => {
                column.name === "Updated at"
                  ? (column.orderBy = order)
                  : (column.orderBy = undefined);

                return column;
              }),
            ],
          });

          refetch({
            order: {
              name: Service_Column.UpdatedAt,
              order: order,
            },
          });
        },
      },
    ],
    rows: [],
    hasNext: false,
    hasPrev: false,
  });

  const { loading, error, previousData, refetch } = useQuery(GET_SERVICES, {
    fetchPolicy: "network-only", // Could be smarter, but for now OK
    variables: {
      first: tableMeta.pageSize,
    },
    onCompleted: (data) => {
      setTableMeta({
        ...tableMeta,
        hasNext: data.services!.pageInfo.hasNextPage,
        hasPrev: data.services!.pageInfo.hasPreviousPage,
        rows: data.services!.edges.map((edge) => {
          return {
            meta: edge.node,
            values: [
              edge.node.uuid,
              edge.node.name,
              edge.node.createdAt,
              edge.node.updatedAt,
            ],
          };
        }),
      });
    },
  });

  const handlePageSizeChange = (pageSize: number) => {
    setTableMeta({
      ...tableMeta,
      pageSize: pageSize,
    });

    refetch({
      first: pageSize,
    });
  };

  const handlePageChange = (pageNumber: number) => {
    setTableMeta({
      ...tableMeta,
      page: pageNumber,
    });

    refetch({
      after:
        pageNumber > 1
          ? tableMeta.rows[tableMeta.rows.length - 1]?.meta.uuid
          : null,
    });
  };

  const [openModal, closeModal] = useModal();

  if (error) return <ErrorPage />;

  if (previousData == null && loading) return <LoadingOverlay />;

  return (
    <>
      <Link href="/services/new">
        <TableCreateButton />
      </Link>
      <Table
        meta={tableMeta}
        onPageChange={handlePageChange}
        onSizeChange={handlePageSizeChange}
        onClickRemoveBtn={(rowIndex) =>
          openModal(
            <ModalDeleteService
              uuid={tableMeta.rows[rowIndex].meta.uuid}
              onCancel={closeModal}
              onDelete={() => {
                refetch();
                closeModal();
              }}
            />
          )
        }
      />
    </>
  );
}
