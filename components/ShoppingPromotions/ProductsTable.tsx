import { useEffect } from "react";

import { useCheckboxSelection } from "@/hooks/checkboxHook";
import PreviewIcon from "@mui/icons-material/Preview";
import {
  Avatar,
  Checkbox,
  Chip,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { LoadingTable } from "../DataTable/LoadingTable";

interface IProductsTable {
  products: AllProducts[];
  isLoading: boolean;
  page: { page: number; limit: number };
  handlePageForward: () => void;
  handlePageBack: () => void;
  onProductIdChange: (id: { [key: string]: boolean }) => void;
  nextPageToken: string | undefined;
}

type AllProducts = {
  title: string;
  id: string;
  imageLink: string;
  brand: string;
  salePrice: { value: string };
  link: string;
};

const AllProductsTable = ({
  page,
  products,
  isLoading,
  handlePageBack,
  handlePageForward,
  onProductIdChange,
  nextPageToken,
}: IProductsTable) => {
  const productIds = products?.map((product) => product?.id);
  const {
    rowSelection,
    handleCheckboxSelected,
    handleSomeRowsSelectedCheck,
    handleAllRowsSelected,
    handleParentCheckboxSelection,
    handleUnselectAllRows,
  } = useCheckboxSelection(productIds);

  useEffect(() => {
    onProductIdChange(rowSelection);
    console.log("row selection", rowSelection);
  }, [rowSelection]);

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  onChange={handleParentCheckboxSelection}
                  checked={handleAllRowsSelected() ?? false}
                  indeterminate={
                    !handleAllRowsSelected() && handleSomeRowsSelectedCheck()
                  }
                  value={handleAllRowsSelected()}
                  size="small"
                />
              </TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Product Id</TableCell>
              <TableCell>brand</TableCell>
              <TableCell>Sale Price</TableCell>
              <TableCell>Site Link</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products &&
              !isLoading &&
              products?.map((p, i) => (
                <TableRow key={p.title}>
                  <TableCell>
                    <Checkbox
                      onChange={() => {
                        handleCheckboxSelected(p?.id);
                      }}
                      checked={rowSelection[p?.id] ?? false}
                      value={rowSelection[p?.id] ?? false}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Stack>
                        <Avatar
                          variant="rounded"
                          alt={`${p.title}__${i}`}
                          src={p?.imageLink}
                        />
                      </Stack>
                      <Stack>{p.title}</Stack>
                    </Stack>
                  </TableCell>
                  <TableCell>{p?.id?.split(":")[3]}</TableCell>
                  <TableCell>{p?.brand}</TableCell>
                  <TableCell>${p?.salePrice?.value}</TableCell>
                  <TableCell>
                    <IconButton LinkComponent="a" href={p?.link.split("?")[0]}>
                      <PreviewIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            {isLoading && <LoadingTable length={3} numCells={6} />}
          </TableBody>
        </Table>
        <Stack direction="row" sx={{ padding: 1 }} spacing={2}>
          <Chip
            disabled={page.page === 0}
            label="previous"
            clickable
            component="button"
            onClick={handlePageBack}
          />
          <Chip
            disabled={page.page !== 0 && nextPageToken === undefined}
            label="next"
            clickable
            component="button"
            onClick={handlePageForward}
          />
        </Stack>
      </TableContainer>
    </Paper>
  );
};

export default AllProductsTable;
