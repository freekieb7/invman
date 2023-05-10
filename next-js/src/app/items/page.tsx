"use client";

import NextPageButton from "@/components/buttons/next-page-btn";
import PrevPageButton from "@/components/buttons/prev-page-btn";
import PagesizeDropdown from "@/components/dropdowns/pagesize-dropdown";
import { useQuery } from "@apollo/client";
import { gql } from "__generated__";
import { useState } from "react";

const GET_SERVICES = gql(/* GraphQL */ `
  query GetServices {
    services {
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

export default function Page() {
  const [tableInfo, setTableInfo] = useState<Table>({
    pageNumber: 1,
    pageSize: 5,
  });
  const { loading, error, data } = useQuery(GET_SERVICES);

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error! ${error.message}</div>;

  const handlePagesizeChange = (pageSize: number) => {
    setTableInfo({
      ...tableInfo,
      pageSize: pageSize,
    });
  };

  return (
    <div>
      {/* <Services></Services> */}
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
          <tbody className="bg-slate-700">
            {data?.services.map(function (service) {
              return (
                <tr className="border-b border-slate-600">
                  <td className="px-2 py-1">{service.id}</td>
                  <td className="px-2 py-1">{service.name}</td>
                  <td className="px-2 py-1">{service.createdAt}</td>
                  <td className="px-2 py-1">{service.updatedAt}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center text-white rounded-md p-2 items-center">
        <p className="px-2">Rows per page:</p>
        <div className="px-2">
          <PagesizeDropdown
            options={[5, 10, 25]}
            onChange={(pageSize) => setPageSize(pageSize)}
          ></PagesizeDropdown>
        </div>

        <p className="px-2">
          {pageNumber * pageSize - pageSize + 1}-{pageNumber * pageSize}
        </p>
        <div className="flex px-2">
          <PrevPageButton />
          <NextPageButton />
        </div>
      </div>
    </div>
  );
}
