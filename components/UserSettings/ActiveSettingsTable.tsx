import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import { PlanTypes } from "./enums.plans";

interface ActiveSettingsProps {
  user: UserDataProps;
}

type UserDataProps = {
  userId?: string;
  lastBillingDate?: string;
  nextBillingDate?: string;
  name?: string;
  cleanUpService?: boolean;
  totalCampaignsCreated?: number;
  planType?: string;
  amountDue: number;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  accountActive: boolean;
  campaignQuota: number;
  totalCreatedCampaigns: number;
};

const ActiveSettingsTable = ({ user }: ActiveSettingsProps) => {
  const endDate =
    user?.planType === PlanTypes.PAY_AS_YOU_GO
      ? "No Billing"
      : user?.nextBillingDate?.split("T")[0];

  const checkDates = () => {
    if (user?.planType !== PlanTypes.PAY_AS_YOU_GO) {
      //set end date and current date (today)
      const currentEndDate = new Date(String(user?.nextBillingDate)).getTime();
      const todaysDate = new Date().getTime();

      if (currentEndDate > todaysDate) {
        //1000000000005000 <-> 100000000000005000
        // return true => this means that there is more time before the plan expires
        return true; //green
      }

      return false; //red
    }
    return true; // green
  };

  const planInGoodStanding = checkDates();

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Account Id</TableCell>
            <TableCell>Created Campaigns</TableCell>
            <TableCell>Plan</TableCell>
            <TableCell>Next Payment</TableCell>
            <TableCell>Last Billing Date</TableCell>
            <TableCell>Next Billing Date</TableCell>
            <TableCell>Account Active</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              <Typography>
                {!user?.stripeCustomerId
                  ? user?.userId?.substring(0, 10) + " ..."
                  : user?.stripeCustomerId}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography color="text.secondary" variant="h4">
                {user?.totalCampaignsCreated} /{" "}
                {user?.planType === "pro"
                  ? String.fromCodePoint(0x221e)
                  : user?.campaignQuota}
              </Typography>
            </TableCell>

            <TableCell>
              <Typography>{user?.planType}</Typography>
            </TableCell>

            <TableCell>
              <Typography>${user?.amountDue / 100}</Typography>
            </TableCell>

            <TableCell>
              <Typography>{user?.lastBillingDate?.split("T")[0]}</Typography>
            </TableCell>
            <TableCell>
              <Typography>{endDate}</Typography>
            </TableCell>
            <TableCell>
              {user?.accountActive ? (
                <Chip
                  label="True"
                  color={planInGoodStanding ? "success" : "warning"}
                />
              ) : (
                <Chip label="False" color="warning" />
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default ActiveSettingsTable;
