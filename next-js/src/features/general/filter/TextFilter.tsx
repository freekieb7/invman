import {
  TextFilter,
  TextFilterOperator,
} from "lib/graphql/__generated__/graphql";
import TextFilterOperatorSelector from "./TextFilterOperatorSelector";

type Props = {
  lable: string;
  defaultValue: TextFilter;
  onChange: (value: TextFilter) => void;
};

export default function TextFilter(props: Props) {
  return (
    <div className="grid grid-cols-3 gap-4 place-content-center place-items-center">
      <div className="text-slate-200">{props.lable}</div>
      <TextFilterOperatorSelector
        defaultValue={props.defaultValue.operator}
        onChange={(value) => {
          props.onChange({
            ...props.defaultValue,
            operator: value,
          });
        }}
      />
      {[
        TextFilterOperator.Contains,
        TextFilterOperator.StartsWith,
        TextFilterOperator.EndsWith,
        TextFilterOperator.Equals,
      ].indexOf(props.defaultValue.operator) > -1 && (
        <input
          className="p-1 rounded-[4px] placeholder-slate-400 contrast-more:placeholder-slate-500"
          placeholder="Service name"
          onChange={(event) => {
            if (event.target.value === '') {
              props.onChange({
                ...props.defaultValue,
                value: null,
              });

              return;
            }

            props.onChange({
              ...props.defaultValue,
              value: event.target.value,
            });
          }}
        />
      )}
    </div>
  );
}
