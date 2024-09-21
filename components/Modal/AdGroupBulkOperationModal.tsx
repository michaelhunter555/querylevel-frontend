import React, { useState } from 'react';

import { useUpdateAdGroups } from '@/hooks/adGroups-hook';
import { useInvalidateQuery } from '@/hooks/invalidateQueries';
import { useForm } from '@/hooks/useForm';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import {
  TextFieldInput,
} from '../CreateCampaignSteps/CreateShoppingCampaign/TextFieldInputs';
import {
  Content,
  PageContainer,
} from '../Footer/FooterStyles';
import { StyledBoxContainer } from './ModalStyles';

interface BulkAdGroupOperationProps {
  open: boolean;
  onClose: () => void;
  operationType?: number | null;
  selectedAdGroups: string[];
  onRowSelection: (
    row: React.SetStateAction<{ [key: string]: boolean }>
  ) => void;
  onOperation: (operation: React.SetStateAction<number | null>) => void;
  //bulk cpc update
  handleBulkCpcOperation: () => void;
}

export const BulkAdGroupOperationModal = ({
  open,
  onClose,
  operationType,
  handleBulkCpcOperation,
  selectedAdGroups,
  onRowSelection,
  onOperation,
}: BulkAdGroupOperationProps) => {
  const handleModal = () => {
    onClose();
  };

  //check operationType
  return (
    <Modal open={open} onClose={handleModal}>
      <StyledBoxContainer sx={{ maxHeight: 150, maxWidth: 300 }}>
        {operationType === 0 && (
          <BulkUpdateAdGroupBids
            onClose={onClose}
            selectedAdGroups={selectedAdGroups}
            onRowSelection={onRowSelection}
            onOperation={onOperation}
          />
        )}

        {operationType === 1 && (
          <BulkUpdateAdGroupStatus
            onClose={onClose}
            selectedAdGroups={selectedAdGroups}
            onRowSelection={onRowSelection}
            onOperation={onOperation}
          />
        )}

        {operationType === 2 && (
          <BulkDeleteAdGroups
            onClose={onClose}
            selectedAdGroups={selectedAdGroups}
            onRowSelection={onRowSelection}
            onOperation={onOperation}
          />
        )}
      </StyledBoxContainer>
    </Modal>
  );
};

type BulkAdGroupBids = {
  onClose: () => void;
  selectedAdGroups: string[];
  onRowSelection: (
    row: React.SetStateAction<{ [key: string]: boolean }>
  ) => void;
  onOperation: (operation: React.SetStateAction<number | null>) => void;
};

const BulkUpdateAdGroupBids = ({
  onClose,
  selectedAdGroups,
  onRowSelection,
  onOperation,
}: BulkAdGroupBids) => {
  const { invalidateQuery } = useInvalidateQuery();
  const { updateAdGroupBids, updateBidsAreLoading } = useUpdateAdGroups();

  const [formState, inputHandler, setFormData] = useForm(
    {
      cpc: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const bulkUpdateCostPerClick = async () => {
    await updateAdGroupBids(
      selectedAdGroups,
      formState?.inputs?.cpc?.value as number
    ).then(async () => {
      await invalidateQuery("adGroups");
      onRowSelection({});
      onOperation(null);
      onClose();
    });
  };

  return (
    <PageContainer minHeight="90%">
      <Content>
        {!updateBidsAreLoading ? (
          <TextFieldInput
            id="cpc"
            name="cpc"
            type="number"
            title="Set cpc for multiple ad groups"
            hasAdornment={true}
            defaultValue={formState?.inputs?.cpc?.value}
            inputHandler={inputHandler}
          />
        ) : (
          <>
            <Skeleton sx={{ width: "100%" }} />
            <Skeleton sx={{ width: "80%" }} />
            <Skeleton sx={{ width: "80%" }} />
          </>
        )}
      </Content>
      <Divider />
      <Stack
        justifyContent="flex-end"
        direction="row"
        alignItems="center"
        spacing={2}
      >
        <Button onClick={onClose}>Cancel</Button>
        <Button disabled={!formState?.isValid} onClick={bulkUpdateCostPerClick}>
          Confirm
        </Button>
      </Stack>
    </PageContainer>
  );
};

//Status
interface BulkAdGroupStatus {
  onClose: () => void;
  selectedAdGroups: string[];
  onRowSelection: (
    row: React.SetStateAction<{ [key: string]: boolean }>
  ) => void;
  onOperation: (operation: React.SetStateAction<number | null>) => void;
}

const BulkUpdateAdGroupStatus = ({
  onClose,
  selectedAdGroups,
  onRowSelection,
  onOperation,
}: BulkAdGroupStatus) => {
  const { invalidateQuery } = useInvalidateQuery();
  const { updateAdGroupStatus, adGroupStatusUpdating } = useUpdateAdGroups();
  const [selectStatus, setSelectStatus] = useState<string>("2");

  const status = {
    2: "ENABLED",
    3: "PAUSED",
  };

  const handleSelectStatusChange = (event: SelectChangeEvent<string>) => {
    setSelectStatus(event.target.value);
  };

  const bulkStatusUpdateHandler = async () => {
    if (selectStatus) {
      await updateAdGroupStatus(selectedAdGroups, Number(selectStatus)).then(
        async () => {
          await invalidateQuery("adGroups");
          onClose();
          onRowSelection({});
          onOperation(null);
        }
      );
      // console.log(selectedAdGroups, Number(selectStatus));
    }
  };

  return (
    <PageContainer minHeight="90%">
      <Content>
        {!adGroupStatusUpdating ? (
          <Select
            fullWidth
            value={selectStatus}
            onChange={(event: SelectChangeEvent<string>) =>
              handleSelectStatusChange(event)
            }
          >
            {Object.entries(status)?.map(([key, value]) => (
              <MenuItem key={key} value={key}>
                {value}
              </MenuItem>
            ))}
          </Select>
        ) : (
          <>
            <Skeleton sx={{ width: "100%" }} />
            <Skeleton sx={{ width: "80%" }} />
            <Skeleton sx={{ width: "80%" }} />
          </>
        )}
      </Content>
      <Divider />
      <Stack
        justifyContent="flex-end"
        direction="row"
        alignItems="center"
        spacing={2}
      >
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={bulkStatusUpdateHandler}>Confirm</Button>
      </Stack>
    </PageContainer>
  );
};

interface BulkDeleteAdGroups {
  onClose: () => void;
  selectedAdGroups: string[];
  onRowSelection: (
    row: React.SetStateAction<{ [key: string]: boolean }>
  ) => void;
  onOperation: (operation: React.SetStateAction<number | null>) => void;
}
//maybe no modal for
const BulkDeleteAdGroups = ({
  onClose,
  selectedAdGroups,
  onRowSelection,
  onOperation,
}: BulkDeleteAdGroups) => {
  const { removeAdGroups, removingAdGroups } = useUpdateAdGroups();
  const { invalidateQuery } = useInvalidateQuery();

  const handleBulkDeleteAdGroups = async () => {
    if (selectedAdGroups.length > 0) {
      await removeAdGroups(selectedAdGroups).then(async () => {
        await invalidateQuery("adGroups");
        onClose();
        onRowSelection({});
        onOperation(null);
      });
    }
  };

  return (
    <PageContainer minHeight="90%">
      <Content>
        {!removingAdGroups ? (
          <Typography color="text.secondary">
            You are about to delete {selectedAdGroups.length} ad group{selectedAdGroups.length > 1 ? 's' : ""}. Please
            confirm
          </Typography>
        ) : (
          <>
            <Skeleton sx={{ width: "100%" }} />
            <Skeleton sx={{ width: "80%" }} />
            <Skeleton sx={{ width: "80%" }} />
          </>
        )}
      </Content>
      <Divider />
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        justifyContent="flex-end"
      >
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleBulkDeleteAdGroups}>Confirm</Button>
      </Stack>
    </PageContainer>
  );
};
