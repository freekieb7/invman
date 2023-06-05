import { ArrowDownIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import OrderIndicator, { ColumnOrder } from "./orderIndicator";

export enum ColumnType {
  Text,
  Number,
  DateTime,
}

export interface Column {
  field: string; // Must match with row value key
  label: string;
  description?: string;
  order?: ColumnOrder;
  orderId?: String;
  type?: ColumnType;
}

export type Row = { [key: string]: any };

interface Props {
  columns: Column[];
  rows: Row[];
  hasMore: boolean;
  onShowMore: () => void;
  onOrderBy: (column: Column) => void;
  onRemove?: (rowIndex: number) => void;
}

export default function Table(props: Props) {
  const [columns, setColumns] = useState<Column[]>(props.columns);

  return (
    <div className="flex flex-col justify-center">
      <table className="table-auto bg-slate-800 text-white rounded-md">
        <thead>
          <tr className="border-b border-slate-600 text-left">
            {props.onRemove != null && <th className="p-2"></th>}
            {columns.map((column, index) => {
              return (
                <th key={index} className="p-2">
                  <div className="flex items-center place-content-between gap-2">
                    <div className="flex items-center gap-2">
                      {column.label}
                      <OrderIndicator
                        order={column.order}
                        onOrderChange={(order) => {
                          setColumns(
                            columns.map((oldColumn) => {
                              if (column === oldColumn) {
                                oldColumn.order = order;
                                return oldColumn;
                              }

                              oldColumn.order = undefined;
                              return oldColumn;
                            })
                          );

                          props.onOrderBy(columns[index]);
                        }}
                      />
                    </div>

                    {/* <div className="hover:bg-slate-700 rounded p-2">
                      <FunnelIcon className="w-4 h-4 fill-slate-50/40" />
                    </div> */}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody className="bg-slate-700 w-full">
          {props.rows.map(function (row, index) {
            return (
              <tr key={index} className="border-b border-slate-600">
                {props.onRemove != null && (
                  <td className="px-2 py-1">
                    <TrashIcon
                      className="h-6 w-6 cursor-pointer"
                      onClick={() => props.onRemove!(index)}
                    />
                  </td>
                )}
                {columns.map((column, columnIndex) => {
                  return (
                    <td key={columnIndex} className="px-2 py-1">
                      {String(row[column.field])}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {props.hasMore && (
        <button
          type="button"
          className="p-1 bg-slate-500 text-slate-100 rounded-sm flex items-center justify-center min-h-8 h-full"
          onClick={props.onShowMore}
        >
          <>
            <ArrowDownIcon className="h-4 w-4" />
            <div className="pl-2">More</div>
          </>
        </button>
      )}
    </div>
  );
}
