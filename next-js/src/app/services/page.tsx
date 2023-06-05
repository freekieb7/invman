"use client";

import LoadingOverlay from "@/features/general/page/loadingPage";
import Table, { Column, ColumnType } from "features/general/table/table";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import TableCreateButton from "@/features/general/table/tableCreateBtn";
import ErrorPage from "@/features/general/page/errorPage";
import { GET_SERVICES } from "lib/graphql/query/service";
import { OrderBy, ServiceColumn } from "lib/graphql/__generated__/graphql";
import { ColumnOrder } from "@/features/general/table/orderIndicator";

const columns: Column[] = [
  {
    field: "uuid",
    label: "UUID",
    type: ColumnType.Text,
    orderId: ServiceColumn.Uuid,
  },
  {
    field: "name",
    label: "Name",
    type: ColumnType.Text,
    orderId: ServiceColumn.Name,
  },
  {
    field: "createdAt",
    label: "Created at",
    type: ColumnType.DateTime,
    orderId: ServiceColumn.CreatedAt,
  },
  {
    field: "updatedAt",
    label: "Updated at",
    type: ColumnType.DateTime,
    orderId: ServiceColumn.UpdatedAt,
  },
];

const paginationSize = 5;

export default function Page() {
  const { data, loading, error, previousData, observable, fetchMore, refetch } =
    useQuery(GET_SERVICES, {
      variables: {
        first: paginationSize,
        order: {
          name: ServiceColumn.CreatedAt,
          order: OrderBy.Desc,
        },
      },
    });

  const handleOrderBy = (column: Column) => {
    refetch({
      order: {
        name: Object.entries(ServiceColumn).find(
          (col) => col[1] === column.orderId
        )![1],
        order: column.order === ColumnOrder.Asc ? OrderBy.Asc : OrderBy.Desc,
      },
    });
  };

  const handleShowMore = () => {
    if (observable.options.variables?.order?.order === OrderBy.Desc) {
      // DESC order
      fetchMore({
        variables: {
          after: data?.services?.pageInfo.endCursor,
        },
      });
    } else {
      // ASC order
      fetchMore({
        variables: {
          after: data?.services?.pageInfo.endCursor,
        },
      });
    }
  };

  // const [openModal, closeModal] = useModal();

  if (error) return <ErrorPage />;
  if (previousData == null && loading) return <LoadingOverlay />;

  return (
    <>
      <Link href="/services/new">
        <TableCreateButton />
      </Link>
      <Table
        rows={data!.services!.edges.flatMap((edge) => edge.node)}
        columns={columns}
        hasMore={data?.services?.pageInfo.hasNextPage ?? false}
        onOrderBy={handleOrderBy}
        onShowMore={handleShowMore}
        onRemove={(rowIndex) => {}}
      />
    </>
  );
}
