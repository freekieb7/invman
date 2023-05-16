import NextPageButton from "@/components/buttons/next-page-btn";
import PrevPageButton from "@/components/buttons/prev-page-btn";
import PagesizeDropdown from "@/components/dropdowns/pagesize-dropdown";

type Props = {
  tableInfo: TableInfo;
  loading: boolean;
  onSizeChange(size: number): void;
  onPageChange(page: number): void;
};

export type TableInfo = {
  pageSize: number;
  page: number;
  columns: string[];
  rows: Row[];
};

interface Row {
  id: number | string;
  values: any[];
}

export const PageSizeOptions = [1, 2, 5];

export default function Table({
  tableInfo,
  loading,
  onPageChange,
  onSizeChange,
}: Props) {
  return (
    <div className="flex flex-col justify-center">
      <table className="table bg-slate-800 text-white rounded-md">
        <thead>
          <tr className="border-b border-slate-600 text-left">
            {tableInfo.columns.map((value) => {
              return <th className="p-2">{value}</th>;
            })}
          </tr>
        </thead>

        <tbody className="bg-slate-700 w-full">
          {tableInfo.rows.map(function (row) {
            return (
              <tr key={row.id} className="border-b border-slate-600">
                {row.values.map((value) => {
                  return <td className="px-2 py-1">{value}</td>;
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
          {tableInfo.page * tableInfo.pageSize}
        </p>
        <div className="flex pl-2 items-center">
          <PrevPageButton />
          <NextPageButton />
        </div>
      </div>
    </div>
  );
}
