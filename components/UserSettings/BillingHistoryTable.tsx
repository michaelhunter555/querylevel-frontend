import React, { useState } from "react";

import { LoadingTable } from "@/components/DataTable/LoadingTable";
import { useAccountSettings } from "@/hooks/useAccountSettings";
import Link from "@mui/material/Link";
import Pagination from "@mui/material/Pagination";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
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
              <b>Invoice Link</b>
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {billingData &&
            !billingDataIsLoading &&
            billingData?.charges?.map((charge: ChargeProps, i: number) => (
              <TableRow key={charge.chargeId}>
                <TableCell>
                  {charge.billingReason ? charge.billingReason : "pay as go"}
                </TableCell>
                <TableCell>${(charge.amountPaid / 100).toFixed(2)}</TableCell>
                <TableCell>{charge.currency}</TableCell>

                <TableCell>{chargeCreatedDate(charge.periodStart)}</TableCell>
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
          {billingDataIsLoading && <LoadingTable length={4} numCells={5} />}
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
