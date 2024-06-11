import React from "react";

import TextField from "@mui/material/TextField";

interface INegativeKeywords {
  keywords: string[];
  onSetKeyword: (keyword: string[]) => void;
}

export const NegativeKeywords = ({
  keywords,
  onSetKeyword,
}: INegativeKeywords) => {
  const handleKeywordTypes = (event: React.ChangeEvent<HTMLInputElement>) => {
    let inputs = event.target.value;
    const lines = inputs?.split(",")?.map((keyword) => keyword);
    onSetKeyword(lines);
  };

  return (
    <>
      <TextField
        fullWidth
        multiline
        rows={5}
        value={keywords}
        helperText="i.e. 'used' or 'refurbished'"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          handleKeywordTypes(event)
        }
        sx={{ maxHeight: 300 }}
      />
    </>
  );
};
