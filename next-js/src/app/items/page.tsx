"use client";

import NextPageButton from "@/components/buttons/next-page-btn";
import PrevPageButton from "@/components/buttons/prev-page-btn";
import { useQuery } from "@apollo/client";
import { gql } from "__generated__";

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

export default function Page() {
  const { loading, error, data } = useQuery(GET_SERVICES);

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error! ${error.message}</div>;

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
          <button>
            <select
              className="cursor-pointer p-1 bg-slate-700 rounded"
              name="number-of-rows"
              id="number-of-rows"
            >
              <option className="cursor-pointer" value="5">
                5
              </option>
              <option className="cursor-pointer" value="10">
                10
              </option>
            </select>
          </button>
        </div>

        <p className="px-2">1-5 of 100</p>
        <div className="flex px-2">
          <PrevPageButton />
          <NextPageButton />
        </div>
      </div>
    </div>
  );
}
