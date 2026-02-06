import React, { useState } from "react";

import { useSession } from "next-auth/react";

import { useKeywordCleanUpService } from "@/hooks/customer-hooks";
import { useInvalidateQuery } from "@/hooks/invalidateQueries";
import { useCheckDevice } from "@/hooks/use-device-hook";
import { useShoppingCampaign } from "@/hooks/useShoppingCampaign";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";

import { StyledBoxContainer } from "./ModalStyles";

interface KeywordServiceModalProps {
  open: boolean;
  onClose: () => void;
  segment: string;
  campaignId: string;
}

const KeywordServiceModal = ({
  open,
  onClose,
  segment,
  campaignId,
}: KeywordServiceModalProps) => {
  const { isMobile } = useCheckDevice();
  const [operationLevel, setOperationLevel] = useState<string>("campaign");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const { getMerchantsData: getBrands } = useShoppingCampaign();
  const { data: session } = useSession();
  const {
    operationResult,
    runKeywordCleanUpCheckAndService: cleanUpKeywords,
    isPostLoading,
  } = useKeywordCleanUpService();
  const { invalidateQuery } = useInvalidateQuery();

  const { data: brands, isLoading: brandsIsLoading } = useQuery({
    queryKey: ["keyword_service_brands"],
    queryFn: () => getBrands(),
    enabled: Boolean(open && session?.user?._id),
  });

  const handleKeywordCleanUp = async () => {
    if (segment && campaignId && campaignId && operationLevel) {
      await cleanUpKeywords(segment, campaignId, selectedBrand, operationLevel);
      invalidateQuery("searchTermView");
    }
  };

  const handleBrandInput = (event: SelectChangeEvent<string>) => {
    setSelectedBrand(event.target.value);
  };

  const handleSelectOperationLevel = (event: SelectChangeEvent<string>) => {
    setOperationLevel(event.target.value);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <StyledBoxContainer height="auto" width={isMobile ? "100%" : 300}>
        <Alert severity="info">
          {isPostLoading
            ? "Performing Keyword Clean up..."
            : "Campaign titles may differ from the actual brand name, so it is necessary to manually select the brand."}
        </Alert>
        {!isPostLoading && (
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="subtitle2">
              Select Merchant Center brand
            </Typography>
            <Select
              id="brand"
              name="brand"
              value={selectedBrand}
              onChange={handleBrandInput}
            >
              {brandsIsLoading && <LinearProgress />}
              {brands &&
                !brandsIsLoading &&
                brands?.map((brand: string, i: number) => (
                  <MenuItem key={`${brand}--${i}`} value={brand}>
                    {brand}
                  </MenuItem>
                ))}
            </Select>
            <Typography color="text.secondary" variant="subtitle2">
              Select level (campaign Recommended)
            </Typography>
            <Select
              id="operationLevel"
              name="operationLevel"
              value={operationLevel}
              onChange={(event: SelectChangeEvent<string>) =>
                handleSelectOperationLevel(event)
              }
            >
              {["campaign"].map((value, i) => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
            {!operationResult ? (
              <Stack direction="row" spacing={2} alignItems="center">
                <Button color="error" variant="outlined" onClick={onClose}>
                  Close
                </Button>
                <Button
                  variant="contained"
                  onClick={handleKeywordCleanUp}
                  disabled={
                    !segment || !selectedBrand || !campaignId || !operationLevel
                  }
                >
                  Run Keyword Clean Up
                </Button>
              </Stack>
            ) : (
              <Typography variant="subtitle2" color="text.secondary">
                {operationResult}
              </Typography>
            )}
          </Stack>
        )}
        {isPostLoading && (
          <>
            <Skeleton width="100%" />
            <Skeleton width="80%" />
            <Skeleton width="80%" />
          </>
        )}
      </StyledBoxContainer>
    </Modal>
  );
};

export default KeywordServiceModal;
