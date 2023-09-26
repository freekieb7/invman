import { Select, SelectProps } from "@/component/core/select";
import { ItemGroupsFilterSubject, FilterOperator, ItemGroup } from "@/lib/graphql/__generated__/graphql";
import { GET_ITEM_GROUP, GET_ITEM_GROUPS } from "@/lib/graphql/query/item_group";
import { useLazyQuery, useQuery } from "@apollo/client";
import { SelectItem, Spinner } from "@nextui-org/react";
import React, { ForwardedRef, Key, useState } from "react";

const rowsPerPage = 20;

const SelectItemGroup = React.forwardRef((props: Omit<SelectProps<ItemGroup>, "children">, ref: ForwardedRef<HTMLSelectElement>) => {
    const [hasMore, setHasMore] = useState<boolean>(false);

    const [fetchItemGroups, { loading, error, data, fetchMore, refetch }] = useLazyQuery(GET_ITEM_GROUPS, {
        variables: {
            limit: rowsPerPage,
            offset: 0,
        },
        onCompleted(data) {
            setHasMore(data.itemGroups.length >= rowsPerPage)
        },
    });

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
    };

    return (
        <Select<ItemGroup>
            {...props}
            isDisabled={error ? true : false}
            errorMessage={error ? "Server error" : null}
            ref={ref}
            label="Group"
            required={true}
            isLoading={loading}
            placeholder="Select a group"
            selectionMode="single"
            onLoadMore={onLoadMore}
            items={data?.itemGroups ?? []}
            onOpenChange={(isOpen) => {
                // Only fetch on first time opening
                if (isOpen === true && data === undefined) {
                    fetchItemGroups();
                }
            }}
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
            renderLabel={(keys) => <Label keys={keys} />}
        >
            {(itemGroup) => (
                <SelectItem key={itemGroup.id}>
                    {itemGroup.name}
                </SelectItem>
            )}
        </Select>
    );
});

const Label = ({ keys }: { keys: Key[] }) => {

    const { data, error, loading } = useQuery(GET_ITEM_GROUP, {
        variables: {
            id: keys[0].toString(),
        }
    });

    if (error) return <span className="text-danger">Error occurred</span>
    if (loading) return <Spinner />

    return (
        <span>
            {data?.itemGroup?.name}
        </span>
    )
}

export default SelectItemGroup;