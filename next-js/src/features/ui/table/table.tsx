import PagesizeDropdown from "features/ui/table/table-pagesize-dropdown";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

interface Props<T> {
  tableInfo: TableInfo<T>;
  loading: boolean;
  onSizeChange: (size: number) => void;
  onPageChange: (page: number) => void;
  onClickRemoveBtn?: (rowIndex: number) => void;
}

export type TableInfo<T> = {
  pageSize: number;
  page: number;
  columns: string[];
  rows: Row<T>[];
};

interface Row<T> {
  meta: T;
  values: any[];
}

export const PageSizeOptions = [10, 20, 50];

export default function Table<T>({
  tableInfo,
  onPageChange,
  onSizeChange,
  onClickRemoveBtn,
}: Props<T>) {
  return (
    <div className="flex flex-col justify-center">
      <table className="table-auto bg-slate-800 text-white rounded-md">
        <thead>
          <tr className="border-b border-slate-600 text-left">
            <th className="p-2"></th>
            {tableInfo.columns.map((value, index) => {
              return (
                <th key={index} className="p-2">
                  {value}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody className="bg-slate-700 w-full">
          {tableInfo.rows.map(function (row, index) {
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
          {tableInfo.page * tableInfo.pageSize - tableInfo.pageSize + 1}-
          {tableInfo.page * tableInfo.pageSize -
            tableInfo.pageSize +
            tableInfo.rows.length}
        </p>
        <div className="pl-2 flex">
          <ChevronLeftIcon
            className="bg-slate-50 h-6 w-6 hover:bg-slate-800 rounded"
            onClick={() => onPageChange(tableInfo.page - 1)}
          />
          <ChevronRightIcon
            className="bg-slate-50 h-6 w-6 hover:bg-slate-800 rounded"
            onClick={() => onPageChange(tableInfo.page + 1)}
          />
        </div>
      </div>
    </div>
  );
}
