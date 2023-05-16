"use client";

import CreateButton from "@/components/buttons/create-btn";
import LoadingOverlay from "@/components/overlay/loading-overlay";
import Table, { TableInfo, PageSizeOptions } from "@/components/table/table";
import { useQuery } from "@apollo/client";
import { gql } from "__generated__";
import Link from "next/link";
import { useState } from "react";

const GET_SERVICES = gql(/* GraphQL */ `
  query GetServices($cursor: String, $maxResults: Int) {
    services(cursor: $cursor, maxResults: $maxResults) {
      id
      name
      createdAt
      updatedAt
    }
  }
`);

export default function Page() {
  const [tableInfo, setTableInfo] = useState<TableInfo>({
    page: 1,
    pageSize: PageSizeOptions[0],
    columns: ["ID", "Name", "Created at", "Updated at"],
    rows: [],
  });

  const { loading, error, previousData, refetch } = useQuery(GET_SERVICES, {
    variables: {
      maxResults: tableInfo.pageSize,
    },
    onCompleted: (data) => {
      setTableInfo({
        ...tableInfo,
        rows: data.services.map((service) => {
          return {
            id: service.id,
            values: [
              service.id,
              service.name,
              service.createdAt,
              service.updatedAt,
            ],
          };
        }),
      });
    },
  });

  const handlePageSizeChange = (pageSize: number) => {
    setTableInfo({
      ...tableInfo,
      pageSize: pageSize,
    });

    refetch({
      maxResults: pageSize,
    });
  };

  if (error) return <div>Error! ${error.message}</div>;

  if (previousData == null && loading) return <LoadingOverlay />;

  return (
    <div className="p-4">
      <Link href="/items/new">
        <CreateButton />
      </Link>
      <Table
        tableInfo={tableInfo}
        loading={false}
        onPageChange={() => {}} // TODO
        onSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
