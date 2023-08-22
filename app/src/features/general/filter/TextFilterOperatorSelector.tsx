import { TextFilterOperator } from "lib/graphql/__generated__/graphql";

type Props = {
  defaultValue: TextFilterOperator;
  onChange: (value: TextFilterOperator) => void;
};

export default function TextFilterOperatorSelector(props: Props) {
  return (
    <select
      className="cursor-pointer p-1 bg-slate-700 rounded text-slate-200"
      value={props.defaultValue}
      onChange={(event) => {
        props.onChange(event.target.value as TextFilterOperator);
      }}
    >
      <option className="cursor-pointer" value={TextFilterOperator.Contains}>
        Contains
      </option>
      <option className="cursor-pointer" value={TextFilterOperator.StartsWith}>
        Starts with
      </option>
      <option className="cursor-pointer" value={TextFilterOperator.EndsWith}>
        Ends with
      </option>
      <option className="cursor-pointer" value={TextFilterOperator.Equals}>
        Equals
      </option>
      <option className="cursor-pointer" value={TextFilterOperator.IsEmpty}>
        Is empty
      </option>
      <option className="cursor-pointer" value={TextFilterOperator.IsNotEmpty}>
        Is not empty
      </option>
    </select>
  );
}
