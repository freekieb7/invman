import { useState } from "react";

export enum PageSize {
  Five = 5,
  Ten = 10,
  Twenty = 20,
}

interface Props {
  initial: PageSize;
  onChange: (size: PageSize) => void;
}

export default function PagesizeDropdown(props: Props) {
  return (
    <button>
      <select
        className="cursor-pointer p-1 bg-slate-700 rounded"
        name="number-of-rows"
        id="number-of-rows"
        value={props.initial}
        onChange={(e) => {
          let pageSize = parseInt(e.target.value);
          props.onChange(pageSize);
        }}
      >
        <option className="cursor-pointer" value={PageSize.Five}>
          {PageSize.Five}
        </option>
        <option className="cursor-pointer" value={PageSize.Ten}>
          {PageSize.Ten}
        </option>
        <option className="cursor-pointer" value={PageSize.Twenty}>
          {PageSize.Twenty}
        </option>
      </select>
    </button>
  );
}
