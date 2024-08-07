import React from 'react';

import { LoadingTable } from '@/components/DataTable/LoadingTable';
import { StyledBoxContainer } from '@/components/Modal/ModalStyles';
import { State } from '@/types';
import EditIcon from '@mui/icons-material/Edit';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Modal from '@mui/material/Modal';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

interface EditBudgetType {
  formState: State;
  inputHandler: (id: string, val: boolean | string, isValid: boolean) => void;
  openSharedBudgets: boolean;
  onSelectNewSharedResource: (name: string, resource: string) => void;
  onGetSharedBudgetList: () => void;
  isLoading: boolean;
  availableBudgets: SharedBudgetResources[];
  isSharedBudget: boolean;
  onSetSharedBudget: () => void;
  currentResource: string;
}

type SharedBudgetResources = {
  campaign_budget: {
    resource_name: string;
    name: string;
    reference_count: number;
    amount_micros: number;
  };
};

const BudgetType = ({
  onGetSharedBudgetList,
  openSharedBudgets,
  formState,
  inputHandler,
  onSelectNewSharedResource,
  availableBudgets,
  isSharedBudget,
  onSetSharedBudget,
  isLoading,
  currentResource,
}: EditBudgetType) => {
  return (
    <>
      <Modal open={openSharedBudgets} onClose={onGetSharedBudgetList}>
        <StyledBoxContainer width="50vw" height="70vh">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Budget Name</TableCell>
                  <TableCell>Total Campaigns</TableCell>
                  <TableCell>Budget Amount</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* customers/cId/campaigns/id */}
                {availableBudgets &&
                  !isLoading &&
                  availableBudgets?.map((val: SharedBudgetResources, i) => (
                    <TableRow
                      key={val?.campaign_budget?.resource_name.split("/")[3]}
                    >
                      <TableCell>{val?.campaign_budget?.name}</TableCell>
                      <TableCell>
                        {val?.campaign_budget?.reference_count}
                      </TableCell>
                      <TableCell>
                        ${val?.campaign_budget?.amount_micros / 1000000}
                      </TableCell>
                      <TableCell>
                        <Button
                          id="campaignBudget"
                          name="campaignBudget"
                          variant="contained"
                          onClick={() => {
                            onSelectNewSharedResource(
                              val?.campaign_budget?.name,
                              val?.campaign_budget?.resource_name
                            );
                            inputHandler(
                              "campaignBudget",
                              val.campaign_budget?.resource_name,
                              true
                            );
                          }}
                        >
                          Select
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                {isLoading && <LoadingTable length={3} numCells={4} />}
              </TableBody>
            </Table>
          </TableContainer>
        </StyledBoxContainer>
      </Modal>
      <FormControl>
        {formState?.inputs?.campaignBudget?.value !== currentResource && (
          <Alert severity="warning">
            Warning: The best practice is to update your existing budget. All
            the spend you had on an existing campaign will be ignored if you
            choose a new campaign budget on an existing campaign.
          </Alert>
        )}
        <FormLabel>Budget Type</FormLabel>
        <RadioGroup
          id="campaignBudgetShared"
          name="campaignBudgetShared"
          value={formState?.inputs?.campaignBudgetShared?.value}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value === "true";
            inputHandler("campaignBudgetShared", value, true);
          }}
        >
          <FormControlLabel
            value={false}
            control={<Radio />}
            label="Individual Campaign"
            onChange={onSetSharedBudget}
          />
          <FormControlLabel
            value={true}
            control={<Radio />}
            label={"Shared Budget"}
            onChange={onSetSharedBudget}
          />
        </RadioGroup>
      </FormControl>

      {isSharedBudget && (
        <Stack direction="row" alignItems="center" spacing={2}>
          <Stack>
            <Typography>Budget Name:</Typography>
          </Stack>
          <Stack>
            <Button onClick={onGetSharedBudgetList} endIcon={<EditIcon />}>
              {formState?.inputs?.campaignBudgetName?.value as string}
            </Button>
          </Stack>
        </Stack>
      )}
    </>
  );
};

export default BudgetType;
