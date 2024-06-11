import { useState } from "react";

export const useAnchorElement = () => {
  const [anchorEl, setAnchorEl] = useState<{
    [key: string]: null | HTMLElement;
  }>({});
  const anchorElementHandler = (
    event: React.MouseEvent<HTMLElement>,
    id: number | string
  ) => {
    setAnchorEl((prev) => ({
      ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: null }), {}),
      [id]: prev[id] ? null : event.currentTarget,
    }));
  };

  const clearAnchorElement = () => {
    setAnchorEl((prev) => ({
      ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: null }), {}),
    }));
  };
  return {
    anchorEl,
    anchorElementHandler,
    clearAnchorElement,
  };
};
