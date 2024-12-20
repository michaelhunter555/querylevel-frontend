import React, { useState } from "react";

import { useAccountSettings } from "@/hooks/useAccountSettings";
import InfoIcon from "@mui/icons-material/Info";
import Link from "@mui/material/Link";
import Pagination from "@mui/material/Pagination";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import { useQuery } from "@tanstack/react-query";

//userSettings.charges.data []
interface BillingHistoryProps {
  stripeCustomerId: string;
  // charges: ChargeProps[];
  // currentChargePage: number;
  // totalChargesPages: number;
  // totalCharges: number;
  // onPageChange: (num: number) => void;
}

type ChargeProps = {
  stripeCustomerId: string;
  amountPaid: number;
  billingReason: string;
  chargeId: string;
  periodEnd: number;
  periodStart: number;
  invoiceUrl?: string;
  currency?: string;
};

const BillingHistoryTable = ({ stripeCustomerId }: BillingHistoryProps) => {
  const { getUserBillingDataTable } = useAccountSettings();
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  const { data: billingData, isLoading: billingDataIsLoading } = useQuery({
    queryKey: ["billingTable", page, limit],
    queryFn: () => getUserBillingDataTable(stripeCustomerId, page, limit),
    enabled: Boolean(stripeCustomerId),
    staleTime: Infinity,
  });

  const handlePageChange = (
    event: React.ChangeEvent<unknown> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const chargeCreatedDate = (charge: number) => {
    if (!charge) return "";
    const date = new Date(charge);
    return date.toLocaleString();
  };

  return (
    <TableContainer sx={{ marginTop: "1rem" }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <b>Action</b>
            </TableCell>
            <TableCell>
              <b>Amount</b>
            </TableCell>
            <TableCell>
              <b>Currency</b>
            </TableCell>
            <TableCell>
              <b>Date</b>
            </TableCell>

            <TableCell>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Stack>
                  <b>Invoice Link</b>
                </Stack>
                <Stack>
                  <Tooltip title="Invoice links are available for subscriptions only. Expires 30 days after creation.">
                    <span>
                      <InfoIcon fontSize="inherit" />
                    </span>
                  </Tooltip>
                </Stack>
              </Stack>
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {billingData &&
            !billingDataIsLoading &&
            billingData?.charges?.map((charge: ChargeProps, i: number) => (
              <TableRow key={charge.chargeId}>
                {/* fix here */}
                <TableCell>
                  {charge.billingReason ? charge.billingReason : "pay as go"}
                </TableCell>
                <TableCell>${(charge.amountPaid / 100).toFixed(2)}</TableCell>
                <TableCell>{charge.currency}</TableCell>

                <TableCell>
                  {charge.billingReason !== "subscription_cycle"
                    ? chargeCreatedDate(charge.periodStart)
                    : chargeCreatedDate(charge.periodEnd)}
                </TableCell>

                <TableCell>
                  {charge.invoiceUrl ? (
                    <Link href={charge.invoiceUrl} target="_blank">
                      View Invoice
                    </Link>
                  ) : (
                    "-"
                  )}
                </TableCell>
              </TableRow>
            ))}
          {billingDataIsLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton width="100%" />
                </TableCell>
                <TableCell>
                  <Skeleton width="100%" />
                </TableCell>
                <TableCell>
                  <Skeleton width="100%" />
                </TableCell>

                <TableCell>
                  <Skeleton width="100%" />
                </TableCell>
                <TableCell>
                  <Skeleton width="100%" />
                </TableCell>
                <TableCell>
                  <Skeleton width="100%" />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <Pagination
        count={Number(billingData?.totalChargesPages) || 0}
        page={Number(billingData?.currentChargePage) || 0}
        onChange={handlePageChange}
      />
    </TableContainer>
  );
};

export default BillingHistoryTable;
