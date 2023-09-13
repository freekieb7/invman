import React from "react";

const ListboxWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="w-full shadow-medium bg-default-100 max-w-xs px-1 py-2 rounded-small">
        {children}
    </div>
);

export default ListboxWrapper;