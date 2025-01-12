import { useState } from "react";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Box, IconButton, Tooltip } from "@mui/material";

const CopyToClipBoard = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyToClipBoard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.log("failed to copy text" + err);
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <Tooltip title={copied ? "copied!" : "copy to clipboard"}>
        <IconButton onClick={handleCopyToClipBoard}>
          {copied ? <CheckCircleIcon /> : <ContentCopyIcon />}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default CopyToClipBoard;
