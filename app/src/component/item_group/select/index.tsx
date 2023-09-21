import { SelectProps, SelectWithSearch } from "@/component/core/select";
import { TextFilterOperator } from "@/lib/graphql/__generated__/graphql";
import { GET_ITEM_GROUPS } from "@/lib/graphql/query/item_group";
import { useQuery } from "@apollo/client";
import { MenuItem } from "@nextui-org/react";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import React, { ForwardedRef, useState } from "react";

const rowsPerPage = 10;

const SelectItemGroup = React.forwardRef((props: Omit<SelectProps, "children">, ref: ForwardedRef<HTMLSelectElement>) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
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

    const [, scrollerRef] = useInfiniteScroll({
        hasMore,
        shouldUseLoader: false, // Required for auto infinite scroll
        isEnabled: isOpen,
        onLoadMore: () => {
            const currentLength = data?.itemGroups.length ?? 0;
            fetchMore({
                variables: {
                    offset: currentLength,
                },
            }).then(fetchMoreResult => {
                setHasMore(fetchMoreResult.data.itemGroups.length >= rowsPerPage);
            });
        }
    });

    return (
        <SelectWithSearch
            {...props}
            showScrollIndicators={true}
            isDisabled={error ? true : false}
            errorMessage={error ? "Server error" : null}
            ref={ref}
            className="max-w-xs"
            isLoading={loading}
            label="Group"
            placeholder="Select a group"
            scrollRef={scrollerRef}
            selectionMode="single"
            onOpenChange={setIsOpen}
            scrollShadowProps={{
                isEnabled: false
            }}
            onSearchChange={(text) => {
                refetch({
                    offset: 0,
                    filter: {
                        name: {
                            operator: TextFilterOperator.Contains,
                            value: text,
                        }
                    }
                })
            }}
        >
            {(data?.itemGroups ?? []).map((itemGroup) => {
                return (
                    <MenuItem key={itemGroup.id}>
                        {itemGroup.name}
                    </MenuItem>
                );
            })}
        </SelectWithSearch>
    );
});

export default SelectItemGroup;