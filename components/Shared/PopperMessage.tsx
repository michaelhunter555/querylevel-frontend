import React, { useState } from "react";

import { AdGroupCriterionResource } from "@/types";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Popper from "@mui/material/Popper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { CreateAdGroupForm } from "../CampaignsView/CreateAdGroupForm";
import { UpdateCostPerClick } from "../ProductPartitionTable/EditPartitionType/UpdateCpcMicros";

interface PopperMessage {
  open: boolean;
  id: string;
  anchorEl: null | HTMLElement;
  status: number;
  text?: string | React.JSX.Element;
  placement?: PopperPlacement;
  node?: AdGroupCriterionResource;
  negativeStatusLoading?: boolean;
  bidsAreUpdating?: boolean;
  campaignResource?: string;
  onConfirm?: () => void;
  onCancel: (event: React.MouseEvent<HTMLElement>) => void;
  updateNegativeStatus?: (
    node: AdGroupCriterionResource,
    cpc: number | null
  ) => Promise<void>;
  costPerClickAnchorHandler?: (
    event: React.MouseEvent<HTMLElement>,
    id: number | string
  ) => void;
  updateCostPerClick?: (
    node: AdGroupCriterionResource,
    cpc: number | null
  ) => Promise<void>;
  createAdGroup?: (adGroup: {
    [key: string]: string | number;
  }) => Promise<void>;
  createAdGroupIsLoading?: boolean;
}

type PopperPlacement =
  | "auto-start"
  | "auto"
  | "bottom-end"
  | "bottom-start"
  | "bottom"
  | "left-end"
  | "left-start"
  | "left"
  | "right-end"
  | "right-start"
  | "right"
  | "top-end"
  | "top-start"
  | "top";

export const PopperMessage = ({
  id,
  open,
  anchorEl,
  text,
  status,
  placement,
  node,
  negativeStatusLoading,
  bidsAreUpdating,
  onCancel,
  onConfirm,
  updateNegativeStatus,
  updateCostPerClick,
  campaignResource,
  createAdGroup,
  createAdGroupIsLoading,
}: PopperMessage) => {
  const [negativeStatus, setNegativeStatus] = useState<number>(status);
  const [shouldUpdateCpc, setShouldUpdateCpc] = useState<boolean>(false);

  const toggleCostPerClickForm = () => {
    setShouldUpdateCpc((prev) => !prev);
  };

  //console.log("currentNode Popper", node);
  /**
   * status 0 & 1 - Product Partitions - negative(status) = 0 -> false || negative(status) = 1 -> true
   * status 4 - update Cpc_micros
   * status 5 - create ad group popper
   * status === String - Pause(2) & Delete(3) Campaigns
   **/

  return (
    <>
      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        placement={placement ? placement : "bottom-start"}
      >
        <Card>
          {status === 4 ? (
            <UpdateCostPerClick
              node={node as AdGroupCriterionResource}
              updateCostPerClick={updateCostPerClick}
              isLoading={bidsAreUpdating}
              onCancel={onCancel}
            />
          ) : status === 0 || status === 1 ? (
            <>
              {shouldUpdateCpc && (
                <UpdateCostPerClick
                  updateCostPerClick={updateNegativeStatus}
                  node={node as AdGroupCriterionResource}
                  onCancel={(event: React.MouseEvent<HTMLElement>) => {
                    toggleCostPerClickForm();
                    //setNegativeStatus(status);
                    onCancel(event);
                  }}
                  isLoading={negativeStatusLoading}
                  setNegativeStatus={setNegativeStatus}
                />
              )}
              {!shouldUpdateCpc && (
                <>
                  <ListItemButton
                    onClick={() => {
                      //API call if !status === 0
                      //need a CPC value as well
                      //console.log("currentNode Popper", node);
                      if (status !== 0) {
                        //run function to open up cpc input
                        //put async call in form 'save' button
                        setShouldUpdateCpc((prev) => !prev);
                      }
                      setNegativeStatus(0);
                    }}
                    selected={negativeStatus === 0}
                  >
                    <ListItemText
                      primary={
                        bidsAreUpdating || negativeStatusLoading ? (
                          <Stack sx={{ width: "100%" }}>
                            <Skeleton sx={{ minWidth: 80 }} />
                          </Stack>
                        ) : (
                          `${status === 0 ? "Active*" : "Include"}`
                        )
                      }
                    />
                  </ListItemButton>

                  <ListItemButton
                    onClick={async (event: React.MouseEvent<HTMLElement>) => {
                      //API call if status === 1
                      // cpc should be null
                      if (status !== 1) {
                        await updateNegativeStatus?.(
                          node as AdGroupCriterionResource,
                          null
                        ).then(() => setNegativeStatus(1));
                      }
                      onCancel(event);
                    }}
                    selected={negativeStatus === 1}
                  >
                    <ListItemText
                      primary={
                        bidsAreUpdating || negativeStatusLoading ? (
                          <Stack sx={{ width: "100%" }}>
                            <Skeleton sx={{ minWidth: 80 }} />
                          </Stack>
                        ) : (
                          `Exclude${status === 1 ? "d" : ""}`
                        )
                      }
                    />
                  </ListItemButton>
                </>
              )}
            </>
          ) : status === 5 ? (
            <>
              <CreateAdGroupForm
                campaignResource={campaignResource as string}
                createAdGroup={createAdGroup}
                createAdGroupIsLoading={createAdGroupIsLoading as boolean}
                onCancel={onCancel}
              />
            </>
          ) : (
            <>
              <CardContent>
                <Typography variant="h6" color="text.secondary">
                  {id === "PauseCampaign" && status === 2 && "Pause Campaign ?"}
                  {id === "PauseCampaign" &&
                    status === 3 &&
                    "Enable Campaign ?"}
                  {id === "DeleteCampaign" && "Delete Campaign ?"}
                  {/* {id === "ExcludeOrTarget" && status === 0 && "Include?"}
              {id === "ExcludeOrTarget" && status === 1 && "Exclude?"} */}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {text}
                </Typography>
              </CardContent>
              <CardActions
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <>
                  <Button color="error" onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button variant="outlined" onClick={onConfirm}>
                    Confirm
                  </Button>
                </>
              </CardActions>
            </>
          )}
        </Card>
      </Popper>
    </>
  );
};
