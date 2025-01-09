import { useState } from "react";

import { LoadingTable } from "@/components/DataTable/LoadingTable";
import type { TShoppingPromotionRequest } from "@/types";
import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

import { StatusDot } from "../Shared/StatusDot";

interface PromotionTableProps {
  promo: TShoppingPromotionRequest[];
  isLoading: boolean;
}

const convertDate = (promoDate: string) => {
  const date = new Date(promoDate);
  return date.toLocaleString();
};
//google active shopping promotions table

const getPromoEndTime = (promotion: string) => {
  const date = new Date(promotion);
  return date.getTime();
};

//today
const date = new Date().getTime();
const PromotionsTable = ({ promo, isLoading }: PromotionTableProps) => {
  const [pages, setPages] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  //pagination
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

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Promotion title</TableCell>
              <TableCell>Promotion Id</TableCell>
              <TableCell>Offer Type</TableCell>
              <TableCell>Applies to</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Policy Status</TableCell>
              <TableCell>Destination Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {promo &&
              !isLoading &&
              promo
                ?.slice(indexOfFirstPage, indexOfLastPage)
                ?.map((promotion, i) => (
                  <TableRow key={promotion?.promotionId}>
                    <TableCell>{promotion?.longTitle}</TableCell>
                    <TableCell>{promotion?.promotionId}</TableCell>
                    <TableCell>{promotion?.offerType}</TableCell>
                    <TableCell>{promotion?.productApplicability}</TableCell>
                    <TableCell>
                      {convertDate(
                        promotion?.promotionEffectiveTimePeriod?.startTime
                      )}
                    </TableCell>
                    <TableCell>
                      {convertDate(
                        promotion?.promotionEffectiveTimePeriod?.endTime
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusDot
                        active={
                          date <
                          getPromoEndTime(
                            promotion?.promotionEffectiveTimePeriod?.endTime
                          )
                        }
                      />

                      {promotion?.promotionStatus?.promotionIssue?.map(
                        (issue, i) => (
                          <Stack key={i} spacing={2}>
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                            >
                              {issue.code}
                            </Typography>
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                            >
                              {issue.detail}
                            </Typography>
                          </Stack>
                        )
                      )}
                    </TableCell>
                    <TableCell>
                      {promotion?.promotionStatus?.destinationStatuses &&
                      promotion?.promotionStatus?.destinationStatuses?.length >
                        0 ? (
                        promotion?.promotionStatus?.destinationStatuses?.map(
                          (status, i) => (
                            <Stack key={i} spacing={2}>
                              <Tooltip title={status?.status}>
                                <Typography
                                  color="text.secondary"
                                  variant="subtitle2"
                                  sx={{
                                    "&:hover": {
                                      color: "black",
                                    },
                                    cursor: "pointer",
                                  }}
                                >
                                  {status?.destination}
                                </Typography>
                              </Tooltip>
                            </Stack>
                          )
                        )
                      ) : (
                        <StatusDot active={true} />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            {isLoading && <LoadingTable length={3} numCells={7} />}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={promo?.length ?? 0}
          rowsPerPage={rowsPerPage}
          page={pages}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsChange}
        />
      </TableContainer>
    </Paper>
  );
};

export default PromotionsTable;
