import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import {
  NestedProps,
  UserCampaign,
} from '@/types';
import { campaignView } from '@/util/helpers/campaignView';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';

import CampaignOptionsBar from '../CampaignOptionsBar/CampaignOptionsBar';
import { StyledFadeIn } from '../Shared/FadeInComponent';
//import CampaignViewCards from "../CampaignViewCards/CampaignViewCards";
//import DynamicCampaignTable from "../DataTable/DynamicCampaignTable";
import { StatusSelector } from '../StatusSelector/StatusSelector';
//import CreateNewCampaign from "./CreateCampaignForm";
import SelectDate from './SelectDate';

const DynamicCampaignTable = dynamic(
  () => import("../DataTable/DynamicCampaignTable"),
  { ssr: false, loading: () => <LinearProgress /> }
);
const CampaignViewCards = dynamic(
  () => import("../CampaignViewCards/CampaignViewCards"),
  { ssr: false }
);

interface CampaignView {
  setCampaignTypeModal: (val: string) => void;
  campaignTypeModal: string | null;
}

const CampaignView = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [segment, setSegment] = useState("LAST_7_DAYS");
  const [status, setStatus] = useState<string>("ENABLED");
  const [updatedCampaign, setUpdateCampaign] = useState(0);
  const [isNewCampaign, setIsNewCampaign] = useState(false);
  const sessionIsValid = session?.user?._id && session?.user?.googleAccountId;

  useEffect(() => {
    if (!sessionIsValid) {
      router.push("/user-dashboard");
    }
  }, [sessionIsValid]);

  const getCampaignData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_SERVER}/api/getUserCampaigns?userId=${session?.user?._id}&segment=${segment}&status=${status}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: response: ${response.status}`);
      }
      const data = await response.json();

      let flattendCampaigns: NestedProps[] = data.campaigns.map(
        (campaign: NestedProps) => {
          return {
            ...campaign.campaign,
            ...campaign.metrics,
            ...campaign.segments,
          };
        }
      );

      return flattendCampaigns;
    } catch (error) {
      console.log(error);
    }
  };

  const {
    data: campaign,
    isLoading: campaignIsLoading,
    refetch: refetchCampaigns,
  } = useQuery({
    queryKey: ["campaignData", segment, status, updatedCampaign],
    queryFn: () => getCampaignData(),
  });

  const segmentsHandler = (event: SelectChangeEvent<string>) => {
    setSegment(event.target.value as string);
  };

  const updatedCampaignHandler = () => {
    setUpdateCampaign((prev) => prev + 1);
  };
  const campaignData = useMemo(() => {
    //aggregate returned data
    let campaignMap = campaignView(campaign);
    return Array.from(campaignMap, ([id, data]) => ({ id, ...data }));
  }, [campaign]);

  const handleStatusChange = (val: string) => {
    setStatus(val);
  };

  return (
    <>
      <Typography color="text.secondary" variant="h5">
        {status === "ENABLED" ? "Enabled" : "Paused"} Campaigns
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center">
        {status !== "PAUSED" && (
          <SelectDate
            segment={segment}
            onSegmentChange={segmentsHandler}
            isLoading={campaignIsLoading}
          />
        )}
        <StatusSelector
          status={status}
          onStatusChange={handleStatusChange}
          isLoading={campaignIsLoading}
        />

        <CampaignViewCards
          isLoading={campaignIsLoading}
          campaignData={campaign as UserCampaign[]}
        />
      </Stack>

      <Stack
        spacing={2}
        direction="row"
        alignItems="center"
        justifyContent={isNewCampaign ? "flex-end" : "space-between"}
        sx={{ margin: "1rem 0" }}
      >
        {status === "PAUSED" && !isNewCampaign && (
          <Alert color="info">
            When Enabling campaigns, please note that active campaign segments
            need a least 1 impression to be viewable.
          </Alert>
        )}

        {status === "ENABLED" && !isNewCampaign && (
          <Alert color="info">
            Campaigns, Ad groups and Product Groups (products) must have at
            least 1 impression to be viewable during date segments.
          </Alert>
        )}

        <CampaignOptionsBar />
      </Stack>
      <StyledFadeIn delay={0.3} visible={true}>
        <DynamicCampaignTable
          isLoading={campaignIsLoading}
          data={campaignData}
          chartData={campaign as UserCampaign[]}
          updatedCampaign={updatedCampaignHandler}
          segment={segment}
          status={status}
          refetchCampaigns={refetchCampaigns}
        />
      </StyledFadeIn>
    </>
  );
};

export default CampaignView;
