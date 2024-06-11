import React, { useEffect, useState } from "react";

import { StateCodes, USStates } from "@/data/countries";
import { useInvalidateQuery } from "@/hooks/invalidateQueries";
import { useGeoTargetConstants } from "@/hooks/location-hook";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import { SelectChangeEvent } from "@mui/material/Select";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";

import { LocationSelect } from "../CreateCampaignSteps/CreateShoppingCampaign/LocationSelect";
import { Content, PageContainer } from "../Footer/FooterStyles";
import { StyledBoxContainer } from "./ModalStyles";

interface GeoLocationModalProps {
  open: boolean;
  onClose: () => void;
  campaignId: string | number;
  campaignName: string;
}

type GeoLocationInfo = {
  campaignId: number;
  location: {
    geo_target_constant: string;
  };
  criterion_id: number;
  negative: boolean;
};

export const GeoLocationModal = ({
  open,
  onClose,
  campaignId,
  campaignName,
}: GeoLocationModalProps) => {
  const { getGeoTargetConstants, updateGeoLocation, isUpdating } =
    useGeoTargetConstants();
  const { invalidateQuery } = useInvalidateQuery();
  const [targetedLocation, setTargetedLocation] = useState<string[]>([]);
  const [excludedLocation, setExcludedLocation] = useState<string[]>([]);
  const [isChanged, setIsChanged] = useState<boolean>(false);

  const { data: targetLocations, isLoading: geoIsLoading } = useQuery({
    queryKey: ["geoLocationConstant", campaignId],
    queryFn: () => getGeoTargetConstants(campaignId),
    enabled: Boolean(open),
    staleTime: Infinity,
  });

  useEffect(() => {
    if (targetLocations && !geoIsLoading) {
      findTargetedLocations(USStates, false);
      findTargetedLocations(USStates, true);
    }
  }, [targetLocations]);

  const findTargetedLocations = (
    locations: StateCodes[],
    isNegative: boolean
  ) => {
    const currentLocations = targetLocations
      .filter(
        (location: GeoLocationInfo) =>
          location.location && location.negative === isNegative
      )
      .map((location: GeoLocationInfo) =>
        location.location.geo_target_constant.split("/").pop()
      );

    const matchLocations = locations
      .filter((state) =>
        currentLocations.includes(state.geo_target_constant.id.toString())
      )
      .map(
        (match) =>
          `${match.geo_target_constant.name}:${match.geo_target_constant.id}`
      );

    if (!isNegative) {
      setTargetedLocation(matchLocations);
    } else {
      setExcludedLocation(matchLocations);
    }
  };

  const excludeLocationHandler = (
    event: SelectChangeEvent<typeof excludedLocation>
  ) => {
    const {
      target: { value },
    } = event;
    setExcludedLocation(typeof value === "string" ? value.split(",") : value);
    setIsChanged(true);
  };

  const targetLocationHandler = (
    event: SelectChangeEvent<typeof targetedLocation>
  ) => {
    const {
      target: { value },
    } = event;
    setTargetedLocation(typeof value === "string" ? value.split(",") : value);
    setIsChanged(true);
  };

  const handleModalCancel = () => {
    onClose();
    findTargetedLocations(USStates, true);
    findTargetedLocations(USStates, false);
    setIsChanged(false);
  };

  const handleUpdateGeoLocation = async () => {
    const currentLocations = targetLocations
      .filter((location: GeoLocationInfo) => location.location)
      .map(
        (location: GeoLocationInfo) => location.location.geo_target_constant
      );

    await updateGeoLocation(
      currentLocations,
      targetedLocation,
      excludedLocation,
      campaignId as number
    ).then(() => {
      if (!isUpdating) {
        onClose();
        invalidateQuery("geoLocationConstant");
        findTargetedLocations(USStates, true);
        findTargetedLocations(USStates, false);
        setIsChanged(false);
      }
    });
  };

  return (
    <Modal open={open} onClose={handleModalCancel}>
      <StyledBoxContainer height="auto" width="50%">
        <PageContainer minHeight="90%">
          <Content>
            <Box>
              <Typography sx={{ margin: "1rem 0" }} color="text.secondary">
                Geo-Location settings: {campaignName}
              </Typography>
              <Grid container direction="row" spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  {!geoIsLoading && !isUpdating ? (
                    <LocationSelect
                      targetLocation={targetedLocation}
                      onTargetLocation={targetLocationHandler}
                      inputLabel={"targeted Location(s)"}
                      id={"targeted-locations"}
                      outlinedInputId={"outline-inputs"}
                    />
                  ) : (
                    <Skeleton width="100%" height={50} />
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {!geoIsLoading && !isUpdating ? (
                    <LocationSelect
                      targetLocation={excludedLocation}
                      onTargetLocation={excludeLocationHandler}
                      inputLabel={"excluded Location(s)"}
                      id={"excluded-locations"}
                      outlinedInputId={"outline-inputs"}
                      isExcluded={true}
                    />
                  ) : (
                    <Skeleton width="100%" height={50} />
                  )}
                </Grid>
              </Grid>
            </Box>
          </Content>
          <Divider sx={{ margin: "1rem 0" }} />
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            justifyContent="flex-end"
          >
            <Button onClick={handleModalCancel}>Close</Button>
            <Button
              disabled={!isChanged}
              variant="contained"
              onClick={handleUpdateGeoLocation}
            >
              Confirm
            </Button>
          </Stack>
        </PageContainer>
      </StyledBoxContainer>
    </Modal>
  );
};
