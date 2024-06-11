import React from "react";

import { ProductPerformanceData } from "@/types";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { LoadingTable } from "../DataTable/LoadingTable";
import { styledScroll } from "./AuthStyles";

interface ProductPerformance {
  productsData: ProductPerformanceData[];
  isLoading: boolean;
}

const ProductPerformance = ({
  productsData,
  isLoading,
}: ProductPerformance) => {
  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          padding: "1rem",
          maxHeight: isLoading ? "auto" : "400px",
          ...styledScroll,
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Clicks</TableCell>
              <TableCell>Impressions</TableCell>
              <TableCell>Cost</TableCell>
              <TableCell>CpC</TableCell>
              <TableCell>conversions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading &&
              productsData &&
              productsData?.map((product, i) => (
                <TableRow key={i}>
                  <TableCell>{product?.product_title}</TableCell>
                  <TableCell>{product?.clicks}</TableCell>
                  <TableCell>{product?.impressions}</TableCell>
                  <TableCell>{(product?.cost_micros).toFixed(2)}</TableCell>
                  <TableCell>{product?.average_cpc}</TableCell>
                  <TableCell>{product?.conversions}</TableCell>
                </TableRow>
              ))}
            {isLoading && <LoadingTable isHome={false} length={3} />}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ProductPerformance;
