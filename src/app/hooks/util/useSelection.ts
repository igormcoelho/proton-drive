import { useState, useEffect } from 'react';
import isTruthy from 'proton-shared/lib/helpers/isTruthy';

type ItemId = string | number;

export interface Item<T> {
    id: string | number;
    data: T;
    disabled?: boolean;
}

const useSelection = <T>(items: Item<T>[]) => {
    const [selectedItemIds, setSelectedItems] = useState<ItemId[]>([]);
    const [multiSelectStartId, setMultiSelectStartId] = useState<ItemId>();

    useEffect(() => {
        const isItemInFolder = (itemId: ItemId) => items.some((item) => item.id === itemId);
        const selected = selectedItemIds.filter(isItemInFolder);
        // If selected items were removed from children, remove them from selected as well
        if (selectedItemIds.length !== selected.length) {
            setSelectedItems(selected);
        }
    }, [items]);

    const toggleSelectItem = (id: ItemId) => {
        setSelectedItems((selectedItemIds) => {
            const previousExcludingSelected = selectedItemIds.filter((itemId) => itemId !== id);
            const isPreviouslySelected = previousExcludingSelected.length !== selectedItemIds.length;

            if (!isPreviouslySelected || previousExcludingSelected.length) {
                setMultiSelectStartId(id);
            } else {
                setMultiSelectStartId(undefined);
            }

            return isPreviouslySelected ? previousExcludingSelected : [...selectedItemIds, id];
        });
    };

    const toggleAllSelected = () => {
        setSelectedItems((ids) => (ids.length === items.length ? [] : items.map(({ id }) => id)));
    };

    const toggleRange = (selectedItemId: ItemId) => {
        // range between item matching selectedItemId and multiSelectStartId

        if (!multiSelectStartId) {
            setMultiSelectStartId(selectedItemId);
            setSelectedItems([selectedItemId]);
            return;
        }

        const selected: ItemId[] = [];
        let i = 0;
        let matchConditions = [multiSelectStartId, selectedItemId];
        while (matchConditions.length) {
            const { id } = items[i];
            if (matchConditions.includes(id)) {
                matchConditions = matchConditions.filter((itemId) => itemId !== id);
                selected.push(id);
            } else if (selected.length) {
                selected.push(id);
            }
            i++;
        }

        setSelectedItems(selected);
    };

    const selectItem = (id: ItemId) => setSelectedItems([id]);
    const clearSelections = () => {
        setSelectedItems([]);
        setMultiSelectStartId(undefined);
    };

    const selectedItems = items
        ? selectedItemIds
              .map((selectedId) => items.find(({ id, disabled }) => !disabled && selectedId === id))
              .filter(isTruthy)
        : [];

    return {
        toggleSelectItem,
        toggleAllSelected,
        selectItem,
        selectedItems,
        clearSelections,
        toggleRange,
    };
};

export default useSelection;
