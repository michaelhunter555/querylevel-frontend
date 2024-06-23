import React, { useState } from "react";

import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

//userSettings.charges.data []
interface BillingHistoryProps {
  charges: ChargeProps[];
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

const BillingHistoryTable = ({ charges }: BillingHistoryProps) => {
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [pages, setPages] = useState<number>(0);

  const indexOfFirstPage = pages * rowsPerPage;
  const indexOfLastPage = indexOfFirstPage + rowsPerPage;
  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPages(newPage);
  };
  const handleRowsChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPages(0);
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
          {charges &&
            charges
              ?.slice(indexOfFirstPage, indexOfLastPage)
              ?.map((charge, i) => (
                <TableRow key={charge.chargeId}>
                  <TableCell>{charge.billingReason}</TableCell>
                  <TableCell>${(charge.amountPaid / 100).toFixed(2)}</TableCell>
                  <TableCell>{charge.currency}</TableCell>

                  <TableCell>{chargeCreatedDate(charge.periodStart)}</TableCell>
                  <TableCell>
                    <Link href={charge.invoiceUrl} target="_blank">
                      View Invoice
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
          <TableRow>
            <TableCell>
              <b>Total Spent</b>
            </TableCell>
            <TableCell>
              $
              {(
                charges?.reduce((acc, curr) => (acc += curr.amountPaid), 0) /
                100
              ).toFixed(2)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={charges?.length ?? 0}
        rowsPerPage={rowsPerPage}
        page={pages}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsChange}
      />
    </TableContainer>
  );
};

export default BillingHistoryTable;
