import React, { useState } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

interface PaymentIntentsProps {
  paymentIntents: PaymentIntents[];
}

type PaymentIntents = {
  id: string;
  amount: number;
  amount_received: number;
  canceled_at: null | number;
  description: string;
  invoice: string;
  status: string;
  created: number;
};

const PaymentIntentsHistoryTable = ({
  paymentIntents,
}: PaymentIntentsProps) => {
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
    const date = new Date(charge * 1000);
    return date.toLocaleString();
  };

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>desc.</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Recieved</TableCell>
            <TableCell>Invoice Id</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Status</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paymentIntents &&
            paymentIntents
              ?.slice(indexOfFirstPage, indexOfLastPage)
              ?.map((charge, i) => (
                <TableRow key={charge.id}>
                  <TableCell>{charge.description}</TableCell>
                  <TableCell>${(charge.amount / 100).toFixed(2)}</TableCell>
                  <TableCell>
                    ${(charge.amount_received / 100).toFixed(2)}
                  </TableCell>
                  <TableCell>{charge?.invoice}</TableCell>
                  <TableCell>{chargeCreatedDate(charge?.created)}</TableCell>
                  <TableCell>{charge?.status}</TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={paymentIntents?.length ?? 0}
        rowsPerPage={rowsPerPage}
        page={pages}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsChange}
      />
    </TableContainer>
  );
};

export default PaymentIntentsHistoryTable;
