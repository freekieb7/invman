"use client";

import ServicesTable from "@/features/services/components/ServicesTable";
import CreateButton from "@/features/general/btn/CreateBtn";

export default function Page() {
  return (
    <div className="flex flex-col">
      <div className="pb-1">
        <CreateButton href={"/services/new"} />
      </div>
      <ServicesTable />
    </div>
  );
}
