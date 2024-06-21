import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

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
  console.log(user, "user");
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
                {user?.totalCampaignsCreated} / {user?.campaignQuota}
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
              <Typography>{user?.nextBillingDate?.split("T")[0]}</Typography>
            </TableCell>
            <TableCell>
              {user?.accountActive ? (
                <Chip label="True" color="success" />
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
