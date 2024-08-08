import React from "react";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface DemoProductStepTwo {
  countIsLoading: boolean;
  selectedBrand: string;
  activeProducts: number;
}

const DemoProductData: React.FC<DemoProductStepTwo> = ({
  countIsLoading,
  selectedBrand,
  activeProducts,
}) => {
  return (
    <>
      <Stack direction="column" spacing={1}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-start"
          spacing={1}
        >
          <Typography variant="subtitle2" color="text.secondary">
            Available Products for {selectedBrand}:
          </Typography>
          {!countIsLoading && (
            <Typography variant="h5" color="text.secondary">
              {activeProducts === 0 && selectedBrand === ""
                ? "select brand"
                : activeProducts}{" "}
              products
            </Typography>
          )}
        </Stack>
        {/* {countIsLoading && <ShoppingInputsLoading />} */}

        {/* {countIsLoading && <CircularProgress sx={{ fontSize: 8 }} />} */}
      </Stack>
    </>
  );
};

export default DemoProductData;
