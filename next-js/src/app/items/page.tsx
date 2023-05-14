"use client";

import NextPageButton from "@/components/buttons/next-page-btn";
import PrevPageButton from "@/components/buttons/prev-page-btn";
import PagesizeDropdown from "@/components/dropdowns/pagesize-dropdown";
import LoadingOverlay from "@/components/overlay/loading-overlay";
import { useQuery } from "@apollo/client";
import { gql } from "__generated__";
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

interface Table {
  pageSize: number;
  pageNumber: number;
}

const pageSizeOptions = [1, 2, 5];

export default function Page() {
  const [tableInfo, setTableInfo] = useState<Table>({
    pageNumber: 1,
    pageSize: pageSizeOptions[0],
  });

  const { loading, error, data, refetch, previousData } = useQuery(
    GET_SERVICES,
    {
      variables: {
        maxResults: tableInfo.pageSize,
      },
    }
  );

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
      <div className="flex justify-center">
        <table className="table-auto bg-slate-800 text-white rounded-md">
          <thead>
            <tr className="border-b border-slate-600 text-left">
              <th className="p-2">ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Created At</th>
              <th className="p-2">Updated At</th>
            </tr>
          </thead>

          <tbody className="bg-slate-700 w-full relative">
            {data != null
              ? data.services.map(function (service) {
                  return (
                    <tr key={service.id} className="border-b border-slate-600">
                      <td className="px-2 py-1">{service.id}</td>
                      <td className="px-2 py-1">{service.name}</td>
                      <td className="px-2 py-1">{service.createdAt}</td>
                      <td className="px-2 py-1">{service.updatedAt}</td>
                    </tr>
                  );
                })
              : previousData?.services.map(function (service) {
                  return (
                    <tr key={service.id} className="border-b border-slate-600">
                      <td className="px-2 py-1">{service.id}</td>
                      <td className="px-2 py-1">{service.name}</td>
                      <td className="px-2 py-1">{service.createdAt}</td>
                      <td className="px-2 py-1">{service.updatedAt}</td>
                    </tr>
                  );
                })}
            {loading ? (
              <tr>
                <td>
                  <div className="absolute top-0 bottom-0 right-0 left-0 flex items-center justify-center bg-slate-600 opacity-75">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-400 border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                  </div>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center text-white rounded-md p-2 items-center">
        <p className="px-2">Rows per page:</p>
        <div className="px-2">
          <PagesizeDropdown
            options={pageSizeOptions}
            onChange={(pageSize) => handlePageSizeChange(pageSize)}
          ></PagesizeDropdown>
        </div>

        <p className="px-2">
          {tableInfo.pageNumber * tableInfo.pageSize - tableInfo.pageSize + 1}-
          {tableInfo.pageNumber * tableInfo.pageSize}
        </p>
        <div className="flex px-2">
          <PrevPageButton />
          <NextPageButton />
        </div>
      </div>
    </div>
  );
}
