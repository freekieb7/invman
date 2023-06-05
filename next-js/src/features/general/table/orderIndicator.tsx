import {
  ArrowSmallDownIcon,
  ArrowSmallUpIcon,
} from "@heroicons/react/24/solid";

export enum ColumnOrder {
  Asc,
  Desc,
}

interface Props {
  order?: ColumnOrder;
  onOrderChange: (order: ColumnOrder) => void;
}

export default function OrderIndicator(props: Props) {
  if (props.order === ColumnOrder.Asc)
    return (
      <div
        className="hover:bg-slate-700 rounded p-2 border-b"
        onClick={() => props.onOrderChange(ColumnOrder.Desc)}
      >
        <ArrowSmallUpIcon className="h-4 w-4 fill-slate-50" />
      </div>
    );

  if (props.order === ColumnOrder.Desc)
    return (
      <div
        className="hover:bg-slate-700 rounded p-2 border-b"
        onClick={() => props.onOrderChange(ColumnOrder.Asc)}
      >
        <ArrowSmallDownIcon className="h-4 w-4 fill-slate-50" />
      </div>
    );

  return (
    <div
      className="hover:bg-slate-700 rounded p-2"
      onClick={() => props.onOrderChange(ColumnOrder.Asc)}
    >
      <ArrowSmallUpIcon className="h-4 w-4 fill-slate-50/40" />
    </div>
  );
}
