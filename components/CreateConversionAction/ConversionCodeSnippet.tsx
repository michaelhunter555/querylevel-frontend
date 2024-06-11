import React from "react";

import { TConversionTable } from "@/types";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { styledScroll } from "../GoogleAuthButton/AuthStyles";

interface IConversionSnippet {
  data: TConversionTable;
}

export const ConversionCode = ({ data }: IConversionSnippet) => {
  console.log("CONVERSION DATA", data);
  return (
    <Stack spacing={2}>
      {data?.tag_snippets?.length && (
        <>
          <Typography color="text.secondary" variant="subtitle2">
            There are no available code snippets for this conversion segment.
          </Typography>
        </>
      )}
      {data?.tag_snippets &&
        data?.tag_snippets
          ?.filter(({ page_format, type }) => type === 2 && page_format === 2)
          ?.map(({ global_site_tag, event_snippet }, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <TextField
                sx={{ ...styledScroll }}
                disabled={true}
                multiline
                rows={6}
                defaultValue={global_site_tag}
                helperText="Your global tag"
              />

              <TextField
                sx={{ ...styledScroll }}
                disabled={true}
                multiline
                rows={5}
                defaultValue={event_snippet}
                helperText="Your event snippet"
              />
            </Box>
          ))}
    </Stack>
  );
};
