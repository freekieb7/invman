import { useState } from "react";

interface Props {
  options: number[];
  onChange(pageSize: number): void;
}

export default function PagesizeDropdown(props: Props) {
  const [selectedOption, setSelectedOption] = useState(props.options[0]);

  return (
    <button>
      <select
        className="cursor-pointer p-1 bg-slate-700 rounded"
        name="number-of-rows"
        id="number-of-rows"
        value={String(selectedOption)}
        onChange={(e) => {
          let pageSize = parseInt(e.target.value);

          setSelectedOption(pageSize);
          props.onChange(pageSize);
        }}
      >
        {props.options.map((o) => (
          <option className="cursor-pointer" key={String(o)} value={String(o)}>
            {String(o)}
          </option>
        ))}
      </select>
    </button>
  );
}
