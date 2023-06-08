import { useModal } from "@/features/general/modal/hook/useModal";
import { useQuery } from "@apollo/client";
import {
  ArrowDownIcon,
  MagnifyingGlassIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { OrderBy, ServiceSubject } from "lib/graphql/__generated__/graphql";
import { GET_SERVICES } from "lib/graphql/query/service";
import { useState } from "react";
import DeleteServiceModal from "./DeleteServiceModal";

const PAGINATION_LIMIT = 5;

export default function ServicesTable() {
  const [openModal, closeModal] = useModal();
  const [showLoadMore, setShowLoadMore] = useState(false);

  const [form, setForm] = useState({
    limit: PAGINATION_LIMIT,
    offset: 0,
    order: {
      name: ServiceSubject.CreatedAt,
      order: OrderBy.Desc,
    },
  });

  const { data, loading, error, fetchMore, refetch } = useQuery(GET_SERVICES, {
    fetchPolicy: "cache-and-network",
    variables: {
      limit: PAGINATION_LIMIT,
      offset: 0,
      order: {
        name: ServiceSubject.CreatedAt,
        order: OrderBy.Desc,
      },
    },
    onCompleted(data) {
      const reachedMaxResults = data.services!.length % PAGINATION_LIMIT > 0;
      setShowLoadMore(!reachedMaxResults);
    },
  });

  const onShowMore = () => {
    fetchMore({
      variables: {
        offset: data!.services!.length,
      },
    });
  };

  const onDeleteService = (uuid: string) => {
    openModal(
      <DeleteServiceModal
        uuid={uuid}
        afterDelete={() => {
          closeModal();
          refetch();
        }}
      />
    );
  };

  if (loading) return <p>Loading</p>; // TODO shadow table
  if (error) return <p className="text-red-700">Something went wrong</p>; // TODO  error table

  return (
    <>
      <div className="pb-2">
        <div className="bg-slate-800 p-2">
          <div className="grid grid-cols-2 gap-4 place-content-center place-items-center">
            <select
              className="cursor-pointer p-1 bg-slate-700 rounded text-slate-200"
              id="number-of-rows"
              value={form.order.name}
              onChange={(event) => {
                event.preventDefault();
                setForm({
                  ...form,
                  order: {
                    name: event.target.value as ServiceSubject,
                    order: form.order.order,
                  },
                });
              }}
            >
              <option className="cursor-pointer" value={ServiceSubject.Uuid}>
                UUID
              </option>
              <option className="cursor-pointer" value={ServiceSubject.Name}>
                Name
              </option>
              <option
                className="cursor-pointer"
                value={ServiceSubject.CreatedAt}
              >
                Created at
              </option>
              <option
                className="cursor-pointer"
                value={ServiceSubject.UpdatedAt}
              >
                Updated at
              </option>
            </select>
            <select
              className="cursor-pointer p-1 bg-slate-700 rounded text-slate-200"
              id="number-of-rows"
              value={form.order.order}
              onChange={(event) => {
                event.preventDefault();
                setForm({
                  ...form,
                  order: {
                    name: form.order.name,
                    order: event.target.value as OrderBy,
                  },
                });
              }}
            >
              <option className="cursor-pointer" value={OrderBy.Asc}>
                A - Z
              </option>
              <option className="cursor-pointer" value={OrderBy.Desc}>
                Z - A
              </option>
            </select>
          </div>

          <button
            className="flex justify-center items-center gap-2 text-slate-200 p-2 bg-slate-900 rounded"
            onClick={() => {
              setForm({
                ...form,
                limit: PAGINATION_LIMIT,
                offset: 0,
              });

              refetch({
                ...form,
              });
            }}
          >
            <MagnifyingGlassIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
      <table className="table-auto text-slate-200">
        <thead className="bg-slate-800">
          <tr className="text-left">
            <th className="p-1"></th>
            <th className="p-1">UUID</th>
            <th className="p-1">Name</th>
            <th className="p-1">Created at</th>
            <th className="p-1">Updated at</th>
          </tr>
        </thead>
        <tbody className="bg-slate-700">
          {data!.services!.map((service, index) => {
            return (
              <tr key={index}>
                <td className="p-1">
                  <button>
                    <TrashIcon
                      className="w-4 h-4"
                      onClick={() => onDeleteService(service.uuid)}
                    />
                  </button>
                </td>
                <td className="p-1">{service.uuid}</td>
                <td className="p-1">{service.name}</td>
                <td className="p-1">{service.createdAt}</td>
                <td className="p-1">{service.updatedAt}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {showLoadMore && (
        <button
          className="text-slate-200 bg-slate-600 p-2 flex justify-center items-center"
          onClick={onShowMore}
        >
          <ArrowDownIcon className="h-4 w-4" />
          <div className="pl-2">More</div>
        </button>
      )}
    </>
  );
}
