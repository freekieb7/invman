import PagesizeDropdown from "@/features/general/table/tablePagesizeDropdown";
import {
  ArrowSmallDownIcon,
  ArrowSmallUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { Order_By } from "lib/graphql/__generated__/graphql";

interface Props<T> {
  meta: TableMeta<T>;
  onSizeChange: (size: number) => void;
  onPageChange: (page: number) => void;
  onClickRemoveBtn?: (rowIndex: number) => void;
}

export type TableMeta<T> = {
  page: number;
  pageSize: number;
  columns: Column[];
  rows: Row<T>[];
  hasNext: boolean;
  hasPrev: boolean;
};

interface Column {
  name: string;
  orderBy?: Order_By;
  onOrderBy: (order: Order_By) => void;
}

interface Row<T> {
  meta: T;
  values: any[];
}

export const PageSizeOptions = [5, 10, 50];

export default function Table<T>({
  meta,
  onPageChange,
  onSizeChange,
  onClickRemoveBtn,
}: Props<T>) {
  return (
    <div className="flex flex-col justify-center">
      <table className="table-auto bg-slate-800 text-white rounded-md">
        <thead>
          <tr className="border-b border-slate-600 text-left">
            {onClickRemoveBtn != null && <th className="p-2"></th>}
            {meta.columns.map((column, index) => {
              return (
                <th key={index} className="p-2">
                  <div className="flex items-center place-content-between gap-2">
                    <div className="flex items-center gap-2">
                      {column.name}
                      {column.orderBy === undefined && (
                        <div
                          className="hover:bg-slate-700 rounded p-2"
                          onClick={() => column.onOrderBy(Order_By.Asc)}
                        >
                          <ArrowSmallUpIcon className="h-4 w-4 fill-slate-50/40" />
                        </div>
                      )}
                      {column.orderBy === Order_By.Asc && (
                        <div
                          className="hover:bg-slate-700 rounded p-2 border-b"
                          onClick={() => column.onOrderBy(Order_By.Desc)}
                        >
                          <ArrowSmallUpIcon className="h-4 w-4 bold" />
                        </div>
                      )}
                      {column.orderBy === Order_By.Desc && (
                        <div
                          className="hover:bg-slate-700 rounded p-2  border-b"
                          onClick={() => column.onOrderBy(Order_By.Asc)}
                        >
                          <ArrowSmallDownIcon className="h-4 w-4" />
                        </div>
                      )}
                    </div>

                    <div className="hover:bg-slate-700 rounded p-2">
                      <FunnelIcon className="w-4 h-4 fill-slate-50/40" />
                    </div>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody className="bg-slate-700 w-full">
          {meta.rows.map(function (row, index) {
            return (
              <tr key={index} className="border-b border-slate-600">
                {onClickRemoveBtn != null && (
                  <td className="px-2 py-1">
                    <TrashIcon
                      className="h-6 w-6 cursor-pointer"
                      onClick={() => onClickRemoveBtn(index)}
                    />
                  </td>
                )}

                {row.values.map((value, index) => {
                  return (
                    <td key={index} className="px-2 py-1">
                      {String(value)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex pt-2 text-white rounded-md items-center justify-center">
        <p>Rows per page:</p>
        <div className="pl-2">
          <PagesizeDropdown
            options={PageSizeOptions}
            onChange={onSizeChange}
          ></PagesizeDropdown>
        </div>

        <p className="pl-2">
          {meta.page * meta.pageSize - meta.pageSize + 1}-
          {meta.page * meta.pageSize - meta.pageSize + meta.rows.length}
        </p>
        <div className="pl-2 flex">
          <div
            className={meta.hasPrev || meta.page > 1 ? "visible" : "invisible"}
          >
            <ChevronLeftIcon
              className="h-6 w-6 hover:bg-slate-800 rounded"
              onClick={() => onPageChange(meta.page - 1)}
            />
          </div>
          {/* If cursor exists, show else hide */}
          <div className={meta.hasNext ? "visible" : "invisible"}>
            <ChevronRightIcon
              className="h-6 w-6 hover:bg-slate-800 rounded"
              onClick={() => onPageChange(meta.page + 1)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
