import React, { useEffect, useState } from "react";

import { useInventoryFilter } from "@/hooks/campaign-hooks";
import { useInvalidateQuery } from "@/hooks/invalidateQueries";
import { useForm } from "@/hooks/useForm";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Modal from "@mui/material/Modal";
import { SelectChangeEvent } from "@mui/material/Select";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";

import { Content, PageContainer } from "../Footer/FooterStyles";
import {
  AvailableProducts,
  InventoryFilter,
} from "../InventoryFilter/InventoryFilter";
import { StyledBoxContainer } from "./ModalStyles";

interface InventoryFilterModalProps {
  open: boolean;
  onClose: () => void;
  campaignId: string | number;
  campaignName: string;
  loadingListingScope: boolean;
  listingScopeData: any;
}

export const InventoryFilterModal = ({
  open,
  onClose,
  campaignId,
  campaignName,
  loadingListingScope,
  listingScopeData,
}: InventoryFilterModalProps) => {
  const {
    getFilteredData,
    updateCampaignCriterionListingScope,
    isPostLoading,
  } = useInventoryFilter();
  const [selectedInventoryFilter, setSelectedInventoryFilter] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [openInventoryFilter, setOpenInventoryFilter] =
    useState<boolean>(false);
  const [resetFilterData, setResetFilterData] = useState<number>(0);
  const { invalidateQuery } = useInvalidateQuery();
  const [formState, inputHandler, setformData] = useForm(
    {
      inventoryFilters: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  //console.log("listingScopeData", listingScopeData, listingScopeData?.length);

  useEffect(() => {
    if (open && listingScopeData?.length > 0) {
      // const { dimensions } = ;
      const scopeData = listingScopeData?.[0]?.listing_scope?.dimensions?.map(
        (val: { [key: string]: { [key: string]: any } }) => {
          const [key, filter] = Object.entries(val)[0];
          return {
            scopeKey: key,
            scopeValue: filter?.value,
          };
        }
      );
      setSelectedFilter(scopeData?.[0]?.scopeKey);
      setSelectedInventoryFilter(scopeData?.[0]?.scopeValue);
      setOpenInventoryFilter(
        Boolean(selectedFilter && selectedInventoryFilter)
      );
    } else {
      setOpenInventoryFilter(
        Boolean(selectedFilter && selectedInventoryFilter)
      );
    }
  }, [listingScopeData, open, resetFilterData]);

  //console.log("filters", selectedFilter, selectedInventoryFilter);

  useEffect(() => {
    if (selectedFilter && selectedInventoryFilter) {
      setformData(
        {
          inventorFilters: {
            value: `${selectedFilter}=${selectedInventoryFilter}` || "",
            isValid: true,
          },
        },
        true
      );
    }
  }, [selectedFilter, selectedInventoryFilter]);

  //   console.log(formState, "open filter:", openInventoryFilter);

  const { data: filteredData, isLoading: inventoryFilterIsLoading } = useQuery({
    queryKey: ["inventoryFilter", selectedFilter],
    queryFn: () => getFilteredData(selectedFilter),
    enabled: Boolean(openInventoryFilter && selectedFilter),
  });

  const handleSelectedFilterChange = (event: SelectChangeEvent<string>) => {
    setSelectedFilter(event.target.value);
  };

  const handleInventoryFilterChange = (val: string) => {
    setSelectedInventoryFilter(val);
  };

  const handleUpdateListingScope = async () => {
    const scope = `${selectedFilter}=${selectedInventoryFilter}`;
    await updateCampaignCriterionListingScope(
      campaignId as number,
      scope,
      listingScopeData?.[0]?.criterion_id,
      openInventoryFilter
    );
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        setResetFilterData((prev) => prev + 1);
      }}
    >
      <StyledBoxContainer height="auto" width="auto" sx={{ padding: "2rem" }}>
        <PageContainer minHeight="90%">
          <Content>
            <Stack>
              <Typography color="text.secondary">
                Listing Scope: {campaignName}
              </Typography>
              <Alert severity="info">
                It is recommended to use <code>All Products</code> as you can
                always subdivide product groups
              </Alert>
            </Stack>
            {!loadingListingScope && !isPostLoading && (
              <InventoryFilter
                formState={formState}
                inputHandler={inputHandler}
                onFilterSelect={(event: SelectChangeEvent<string>) =>
                  handleSelectedFilterChange(event)
                }
                selectedFilter={selectedFilter}
                openInventoryFilter={openInventoryFilter}
                onOpenInventoryFilter={setOpenInventoryFilter}
                selectedInventoryFilter={selectedInventoryFilter}
                onInventoryFilterChange={(val: string) =>
                  handleInventoryFilterChange(val)
                }
                filteredData={filteredData as AvailableProducts[]}
                inventoryFilterIsLoading={inventoryFilterIsLoading}
              />
            )}
            {loadingListingScope && (
              <>
                <Skeleton width="100%" />
                <Skeleton width="80%" />
                <Skeleton width="80%" />
              </>
            )}

            {isPostLoading && (
              <>
                <Skeleton width="100%" />
                <Skeleton width="80%" />
                <Skeleton width="80%" />
              </>
            )}
          </Content>
          <Divider sx={{ margin: "1rem 0" }} />
          <Stack direction="row" alignItems="center" spacing={2}>
            <Button
              onClick={() => {
                onClose();
                setResetFilterData((prev) => prev + 1);
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={
                openInventoryFilter &&
                !selectedFilter &&
                !selectedInventoryFilter
              }
              onClick={async () => {
                await handleUpdateListingScope().then(() => {
                  invalidateQuery("listingScopeData");
                  onClose();
                });
              }}
            >
              Save
            </Button>
          </Stack>
        </PageContainer>
      </StyledBoxContainer>
    </Modal>
  );
};
