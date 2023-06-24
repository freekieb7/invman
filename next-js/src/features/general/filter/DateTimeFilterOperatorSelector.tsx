import { DateTimeFilterOperator } from "lib/graphql/__generated__/graphql";

type Props = {
  defaultValue: DateTimeFilterOperator;
  onChange: (value: DateTimeFilterOperator) => void;
};

export default function DateTimeFilterOperatorSelector(props: Props) {
  return (
    <select
      className="cursor-pointer p-1 bg-slate-700 rounded text-slate-200"
      value={props.defaultValue}
      onChange={(event) => {
        props.onChange(event.target.value as DateTimeFilterOperator);
      }}
    >
      <option className="cursor-pointer" value={DateTimeFilterOperator.IsAfterOrOn}>
        After or on
      </option>
      <option className="cursor-pointer" value={DateTimeFilterOperator.IsBeforeOrOn}>
        Before or on
      </option>
      <option className="cursor-pointer" value={DateTimeFilterOperator.IsBetweenOrOn}>
        Between or on
      </option>
      <option className="cursor-pointer" value={DateTimeFilterOperator.IsEmpty}>
        Is empty
      </option>
      <option className="cursor-pointer" value={DateTimeFilterOperator.IsNotEmpty}>
        Is not empty
      </option>
    </select>
  );
}
