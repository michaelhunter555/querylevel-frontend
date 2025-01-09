import React, { useCallback, useState } from "react";

export const useCheckboxSelection = (conversionIds: number[] | string[]) => {
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>(
    {}
  );

  const handleCheckboxSelected = useCallback((id: number | string) => {
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
    return conversionIds?.some((id: number | string) => rowSelection[id]);
  }, [rowSelection, conversionIds]);

  const handleAllRowsSelected = useCallback(() => {
    return conversionIds?.every((id: number | string) => rowSelection[id]);
  }, [rowSelection, conversionIds]);

  const handleParentCheckboxSelection = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked;
      if (isChecked) {
        setRowSelection(
          conversionIds?.reduce(
            (acc, id) => ({
              ...acc,
              [id]: true,
            }),
            {}
          )
        );
      } else {
        setRowSelection({});
      }
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
