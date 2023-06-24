import {
    DateTimeFilter,
    DateTimeFilterOperator,
  } from "lib/graphql/__generated__/graphql";
import DateTimeFilterOperatorSelector from "./DateTimeFilterOperatorSelector";
  
  type Props = {
    lable: string;
    defaultValue: DateTimeFilter;
    onChange: (value: DateTimeFilter) => void;
  };
  
  export default function DateTimeFilter(props: Props) {
    return (
      <div className="grid grid-cols-3 gap-4 place-content-center place-items-center">
        <div className="text-slate-200">{props.lable}</div>
        <DateTimeFilterOperatorSelector
          defaultValue={props.defaultValue.operator}
          onChange={(value) => {
            props.onChange({
              ...props.defaultValue,
              operator: value,
            });
          }}
        />
        {[
          DateTimeFilterOperator.IsAfterOrOn,
          DateTimeFilterOperator.IsBeforeOrOn,
          DateTimeFilterOperator.IsBetweenOrOn
        ].indexOf(props.defaultValue.operator) > -1 && (
          <input
            className="p-1 rounded-[4px] placeholder-slate-400 contrast-more:placeholder-slate-500"
            placeholder="Service name"
            type="date"
            onChange={(event) => {
              if (event.target.value === '') {
                props.onChange({
                  ...props.defaultValue,
                  value: null,
                });

                return;
              }

              const date = new Date(event.target.value);

              props.onChange({
                ...props.defaultValue,
                value: date.toISOString(),
              });

              
            }}
          />
        )}
      </div>
    );
  }
  