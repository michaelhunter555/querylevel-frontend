import React, { useState } from "react";

import { useKeywordCleanUpService } from "@/hooks/customer-hooks";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

interface KeywordCleanUpProps {
  segment: string;
  campaignId: string | number;
  brand: string;
  operationLevel: string;
}

const KeywordServiceButton = ({
  segment,
  campaignId,
  brand,
  operationLevel,
}: KeywordCleanUpProps) => {
  const {
    operationResult,
    runKeywordCleanUpCheckAndService: cleanUpKeywords,
    isPostLoading,
  } = useKeywordCleanUpService();
  const [buttonText, setButtonText] = useState<string>("Run Keyword Cleanse");

  const handleKeywordCleanUp = async () => {
    await cleanUpKeywords(segment, campaignId, brand, operationLevel);
    setButtonText(operationResult);
  };

  return (
    <Button onClick={handleKeywordCleanUp}>
      {isPostLoading ? <CircularProgress /> : buttonText}
    </Button>
  );
};

export default KeywordServiceButton;
