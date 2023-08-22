import { PlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

type Props = {
  href: string;
};

export default function CreateButton(props: Props) {
  return (
    <button className="bg-slate-700/70 rounded">
      <Link href={props.href}>
        <PlusIcon height={32} color="white" />
      </Link>
    </button>
  );
}
