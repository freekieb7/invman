import DefaultSelect from "@/component/core/select/select";
import { ItemGroupsFilterSubject, FilterOperator, ItemGroup } from "@/lib/graphql/__generated__/graphql";
import { GET_ITEM_GROUPS } from "@/lib/graphql/query/item_group";
import { useQuery } from "@apollo/client";
import { ListboxProps, SelectItem } from "@nextui-org/react";
import React, { ForwardedRef, useState } from "react";

const rowsPerPage = 30;

const SelectItemGroup = React.forwardRef((props: Omit<ListboxProps<ItemGroup>, "children">, ref: ForwardedRef<HTMLSelectElement>) => {
    const [hasMore, setHasMore] = useState<boolean>(false);

    const { loading, error, data, fetchMore, refetch } = useQuery(GET_ITEM_GROUPS, {
        variables: {
            limit: rowsPerPage,
            offset: 0,
        },
        onCompleted(data) {
            setHasMore(data.itemGroups.length >= rowsPerPage)
        },
    })

    const onLoadMore = () => {
        if (!hasMore) return;

        const currentLength = data?.itemGroups.length ?? 0;
        fetchMore({
            variables: {
                offset: currentLength,
            },
        }).then(fetchMoreResult => {
            setHasMore(fetchMoreResult.data.itemGroups.length >= rowsPerPage);
        });
    }

    return (
        <DefaultSelect<ItemGroup>
            {...props}
            // isDisabled={error ? true : false}
            // errorMessage={error ? "Server error" : null}
            ref={ref}
            label="Group"
            required={true}
            isLoading={loading}
            placeholder="Select a group"
            // selectionMode="single"
            onLoadMore={onLoadMore}
            items={data?.itemGroups ?? []}
            onSearchChange={(text) => {
                refetch({
                    offset: 0,
                    filters: text != "" ? {
                        subject: ItemGroupsFilterSubject.Name,
                        operator: FilterOperator.Contains,
                        value: text,
                    } : null
                })
            }}
        // renderLabel={(keys) => {
        //     return (
        //         <div className="flex flex-wrap gap-2">
        //             {keys.map((key) => {
        //                 return (
        //                     <Chip key={key}>
        //                         {key}
        //                     </Chip>
        //                 )
        //             })}
        //         </div>
        //     );
        // }}
        >
            {(itemGroup) => (
                <SelectItem key={itemGroup.id}>
                    {itemGroup.name}
                </SelectItem>
            )}
        </DefaultSelect>
    );
});

export default SelectItemGroup;