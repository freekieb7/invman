import { useModal } from "@/features/general/modal/hook/useModal";
import { useQuery } from "@apollo/client";
import {
  ArrowDownIcon,
  MagnifyingGlassIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { GET_SERVICES } from "lib/graphql/query/service";
import { useState } from "react";
import DeleteServiceModal from "./DeleteServiceModal";
import {
  OrderDirection,
  ServicesInput,
  ServicesOrderSubject,
  TextFilterOperator,
} from "lib/graphql/__generated__/graphql";

const PAGINATION_LIMIT = 5;

export default function ServicesTable() {
  const [openModal, closeModal] = useModal();
  const [showLoadMore, setShowLoadMore] = useState(false);

  const [filter, setFilter] = useState<ServicesInput>({
    limit: PAGINATION_LIMIT,
    order: {
      subject: ServicesOrderSubject.Uuid,
      order: OrderDirection.Asc,
    },
  });

  const { data, loading, error, fetchMore, refetch } = useQuery(GET_SERVICES, {
    fetchPolicy: "cache-and-network",
    variables: {
      input: {
        limit: filter.limit,
        order: filter.order,
      },
    },
    onCompleted(data) {
      const reachedMaxResults =
        data.services!.length === 0 ||
        data.services!.length % PAGINATION_LIMIT > 0;

      setShowLoadMore(!reachedMaxResults);
    },
  });

  const onShowMore = () => {
    fetchMore({
      variables: {
        input: {
          ...filter,
          offset: data?.services?.length,
        },
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
          <div className="grid grid-cols-3 gap-4 place-content-center place-items-center">
            {/* Filter */}
            <div className="text-slate-200">UUID</div>
            <select
              className="cursor-pointer p-1 bg-slate-700 rounded text-slate-200"
              onChange={(event) => {
                event.preventDefault();
                setFilter({
                  ...filter,
                  uuid: {
                    operator: event.target.value as TextFilterOperator,
                    value: filter.uuid?.value,
                  },
                });
              }}
            >
              <option
                className="cursor-pointer"
                value={TextFilterOperator.Contains}
              >
                Contains
              </option>
              <option
                className="cursor-pointer"
                value={TextFilterOperator.EndsWith}
              >
                Ends with
              </option>
              <option
                className="cursor-pointer"
                value={TextFilterOperator.Equals}
              >
                Equals
              </option>
              <option
                className="cursor-pointer"
                value={TextFilterOperator.IsEmpty}
              >
                Is empty
              </option>
              <option
                className="cursor-pointer"
                value={TextFilterOperator.IsNotEmpty}
              >
                Is not empty
              </option>
              <option
                className="cursor-pointer"
                value={TextFilterOperator.StartsWith}
              >
                Starts with
              </option>
            </select>
            <input
              className="p-1 rounded-[4px] placeholder-slate-400 contrast-more:placeholder-slate-500"
              placeholder="Service name"
              onChange={(event) => {
                event.preventDefault();
                setFilter({
                  ...filter,
                  uuid: {
                    operator:
                      filter.uuid?.operator ?? TextFilterOperator.Contains,
                    value: event.target.value,
                  },
                });
              }}
            />

            {/* Order by */}
            <select
              className="cursor-pointer p-1 bg-slate-700 rounded text-slate-200"
              value={filter.order?.subject as ServicesOrderSubject.Uuid}
              onChange={(event) => {
                event.preventDefault();
                setFilter({
                  ...filter,
                  order: {
                    subject: event.target.value as ServicesOrderSubject,
                    order: filter.order!.order,
                  },
                });
              }}
            >
              <option
                className="cursor-pointer"
                value={ServicesOrderSubject.Uuid}
              >
                UUID
              </option>
              <option
                className="cursor-pointer"
                value={ServicesOrderSubject.Name}
              >
                Name
              </option>
              <option
                className="cursor-pointer"
                value={ServicesOrderSubject.CreatedAt}
              >
                Created at
              </option>
              <option
                className="cursor-pointer"
                value={ServicesOrderSubject.UpdatedAt}
              >
                Updated at
              </option>
            </select>
            <div className="text-slate-200">Order by</div>
            <select
              className="cursor-pointer p-1 bg-slate-700 rounded text-slate-200"
              value={filter.order?.order ?? OrderDirection.Asc}
              onChange={(event) => {
                event.preventDefault();
                setFilter({
                  ...filter,
                  order: {
                    subject: filter.order!.subject,
                    order: event.target.value as OrderDirection,
                  },
                });
              }}
            >
              <option className="cursor-pointer" value={OrderDirection.Asc}>
                A - Z
              </option>
              <option className="cursor-pointer" value={OrderDirection.Desc}>
                Z - A
              </option>
            </select>
          </div>

          <button
            className="flex justify-center items-center gap-2 text-slate-200 p-2 bg-slate-900 rounded"
            onClick={() => {
              setFilter({
                ...filter,
                limit: PAGINATION_LIMIT,
                offset: 0,
              });

              refetch({
                input: filter,
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
                <td className="p-1">
                  {new Date(Date.parse(service.createdAt)).toUTCString()}
                </td>
                <td className="p-1">
                  {new Date(Date.parse(service.updatedAt)).toUTCString()}
                </td>
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
