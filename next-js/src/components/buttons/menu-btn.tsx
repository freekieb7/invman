import { Dispatch, SetStateAction } from "react";

type Props = {
  open: boolean;
  toggleSidebar: Dispatch<SetStateAction<boolean>>;
};

export default function MenuButton({ open, toggleSidebar }: Props) {
  return (
    <button
      className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
      onClick={() => {
        toggleSidebar(!open);
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        className="w-8 h-8"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      </svg>
    </button>
  );
}
