import React, { useMemo, useState } from "react";

import { useCheckboxSelection } from "@/hooks/checkboxHook";
import { useGetConversionData } from "@/hooks/create-conversion-hook";
import { useInvalidateQuery } from "@/hooks/invalidateQueries";
import { TConversionTable } from "@/types";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Collapse from "@mui/material/Collapse";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import { LoadingTable } from "../DataTable/LoadingTable";
import { conversionTypeMapping } from "./conversionAction.enums";
import { ConversionCode } from "./ConversionCodeSnippet";
import { ConversionLoadingSkeleton } from "./ConversionLoadingSkeleton";
import { ConversionActionsSettings } from "./CoversionActionSettings";

interface ConversionTableData {
  conversionData: TConversionTable[];
  tableIsLoading: boolean;
}

const ConversionsTable = ({
  conversionData,
  tableIsLoading,
}: ConversionTableData) => {
  const { removeWebConversion, isPostLoading: isRemovingConversion } =
    useGetConversionData();
  const [openRowId, setOpenRowId] = useState<number | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [pages, setPages] = useState<number>(0);
  const conversionIds = useMemo(
    () => conversionData?.map((data) => data?.id),
    [conversionData]
  );
  const {
    rowSelection,
    handleCheckboxSelected,
    handleSomeRowsSelectedCheck,
    handleAllRowsSelected,
    handleParentCheckboxSelection,
    handleUnselectAllRows,
  } = useCheckboxSelection(conversionIds);
  const { invalidateQuery } = useInvalidateQuery();

  const handleRowOpen = (id: number) => {
    setOpenRowId((prev) => (prev !== id ? id : null));
  };

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

  const keys = Object.keys(rowSelection);

  const shouldDisable =
    keys.length === 0 ||
    !Object.values(rowSelection).some((value) => value === true);

  const handleRemoveWebConversion = async () => {
    if (keys.length > 0) {
      await removeWebConversion(keys).then(() => {
        invalidateQuery("conversionData");
      });
    }
  };

  return (
    <TableContainer component={Paper} sx={{ marginTop: "1rem" }}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{ padding: "0.5rem" }}
      >
        <Button
          onClick={() => {
            handleRemoveWebConversion();
            handleUnselectAllRows();
          }}
          disabled={shouldDisable}
          variant="outlined"
          color="error"
          size="small"
        >
          remove Selected
        </Button>
      </Stack>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>
              <Checkbox
                onChange={handleParentCheckboxSelection}
                checked={handleAllRowsSelected() ?? false}
                indeterminate={
                  !handleAllRowsSelected() && handleSomeRowsSelectedCheck()
                }
                size="small"
                value={handleAllRowsSelected()}
              />
            </TableCell>

            <TableCell>Conversion Action</TableCell>
            <TableCell>Action Optimization</TableCell>
            <TableCell>Conversion Source</TableCell>
            <TableCell>All Conv.</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!tableIsLoading &&
            !isRemovingConversion &&
            conversionData &&
            conversionData
              ?.slice(indexOfFirstPage, indexOfLastPage)
              ?.map((resource, i) => (
                <Row
                  key={resource?.id}
                  conversionData={resource}
                  isOpen={openRowId === resource?.id}
                  onOpenRow={() => handleRowOpen(resource?.id)}
                  handleCheckbox={() => handleCheckboxSelected(resource?.id)}
                  isChecked={rowSelection[resource?.id] ?? false}
                />
              ))}
          {tableIsLoading && <LoadingTable length={6} numCells={7} />}
          {isRemovingConversion && <LoadingTable length={6} numCells={7} />}
        </TableBody>
      </Table>
      {!tableIsLoading && conversionData && (
        <TablePagination
          component="div"
          count={conversionData?.length ?? 0}
          rowsPerPage={rowsPerPage}
          page={pages}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsChange}
        />
      )}
    </TableContainer>
  );
};

interface ConversionRows {
  conversionData: TConversionTable;
  isOpen: boolean;
  onOpenRow: () => void;
  handleCheckbox: () => void;
  isChecked: boolean;
}
const Row = ({
  conversionData,
  isOpen,
  onOpenRow,
  handleCheckbox,
  isChecked,
}: ConversionRows) => {
  const { updateWebsiteConversion, isPostLoading } = useGetConversionData();
  const statusIsActive: boolean = conversionData?.status === 2;

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton onClick={onOpenRow}>
            {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Checkbox
            size="small"
            onChange={handleCheckbox}
            checked={isChecked}
            value={isChecked}
          />
        </TableCell>

        <TableCell sx={{ minWidth: 300 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box>{conversionData?.name}</Box>
          </Stack>
        </TableCell>
        <TableCell>
          {conversionData?.primary_for_goal ? "Primary" : "Secondary"}
        </TableCell>
        <TableCell>
          {
            conversionTypeMapping[
              conversionData?.type as keyof typeof conversionTypeMapping
            ]
          }
        </TableCell>
        <TableCell>{conversionData?.allConversions}</TableCell>
        <TableCell>
          <span
            style={{
              backgroundColor: statusIsActive ? "#5bb75b21" : "#b76f5b21",
              color: "inherit",
              padding: "0.2rem 0.5rem",
            }}
          >
            {conversionData?.status === 2 ? "Active" : "Inactive"}
          </span>
        </TableCell>
      </TableRow>
      <TableRow sx={{ marginBottom: 2, marginTop: 2 }}>
        <TableCell
          style={{
            paddingBottom: 0,
            paddingTop: 0,
            width: "100%",
          }}
          colSpan={9}
        >
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Grid container direction="row" spacing={3}>
                <Grid item xs={12} md={6} sx={{ marginTop: 2 }}>
                  <Typography variant="h5" color="text.secondary">
                    Conversion Details
                  </Typography>
                  {!isPostLoading ? (
                    <ConversionActionsSettings
                      onWebConversionUpdate={updateWebsiteConversion}
                      data={conversionData}
                    />
                  ) : (
                    <ConversionLoadingSkeleton />
                  )}
                </Grid>

                <Grid item xs={12} md={5}>
                  <Typography variant="h5" color="text.secondary">
                    Conversion Snippets
                  </Typography>

                  <ConversionCode data={conversionData} />
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default ConversionsTable;
