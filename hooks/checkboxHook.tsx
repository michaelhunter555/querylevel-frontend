import React, { useCallback, useState } from "react";

export const useCheckboxSelection = (conversionIds: number[]) => {
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>(
    {}
  );

  const handleCheckboxSelected = useCallback((id: number) => {
    setRowSelection((prev) => {
      // const selected = { ...prev, [id]: !prev[id] };

      const newState = { ...prev };

      if (newState[id]) {
        delete newState[id];
      } else {
        newState[id] = true;
      }
      return newState;
    });
  }, []);

  const handleSomeRowsSelectedCheck = useCallback(() => {
    return conversionIds?.some((id: number) => rowSelection[id]);
  }, [rowSelection, conversionIds]);

  const handleAllRowsSelected = useCallback(() => {
    return conversionIds?.every((id: number) => rowSelection[id]);
  }, [rowSelection, conversionIds]);

  const handleParentCheckboxSelection = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked;
      setRowSelection(
        conversionIds?.reduce(
          (acc, id) => ({
            ...acc,
            [id]: isChecked,
          }),
          {}
        )
      );
    },
    [conversionIds]
  );

  const handleUnselectAllRows = () => {
    setRowSelection({});
  };

  return {
    rowSelection,
    handleCheckboxSelected,
    handleSomeRowsSelectedCheck,
    handleAllRowsSelected,
    handleParentCheckboxSelection,
    handleUnselectAllRows,
  };
};
