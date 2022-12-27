import { Dispatch, SetStateAction } from "react";

type Props = {
  isOpen: boolean;
  toggleSidebar: Dispatch<SetStateAction<boolean>>;
};

export default function MenuButton({ isOpen, toggleSidebar }: Props) {
  return (
    <button
      className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
      onClick={() => toggleSidebar(isOpen ? false : true)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-8 h-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      </svg>
    </button>
  );
}
