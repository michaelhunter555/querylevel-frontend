import React from "react";

import { TConversionTable } from "@/types";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { styledScroll } from "../GoogleAuthButton/AuthStyles";
import CopyToClipBoard from "../Shared/CopyToClipboards";

interface IConversionSnippet {
  data: TConversionTable;
}

export const ConversionCode = ({ data }: IConversionSnippet) => {
  return (
    <Stack spacing={2}>
      {data?.tag_snippets?.filter(
        ({ page_format, type }) => type === 2 && page_format === 2
      ).length === 0 && (
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
                InputProps={{
                  startAdornment: <CopyToClipBoard text={global_site_tag} />,
                }}
              />

              <TextField
                sx={{ ...styledScroll }}
                disabled={true}
                multiline
                rows={5}
                defaultValue={event_snippet}
                helperText="Your event snippet"
                InputProps={{
                  startAdornment: <CopyToClipBoard text={event_snippet} />,
                }}
              />
            </Box>
          ))}
    </Stack>
  );
};
