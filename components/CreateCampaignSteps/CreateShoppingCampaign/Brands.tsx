import React, { useState } from 'react';

import { StyledFadeIn } from '@/components/Shared/FadeInComponent';
import LightbulbTwoToneIcon from '@mui/icons-material/LightbulbTwoTone';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { StrategyModal } from './Modal';

interface BrandsProps {
  isLoading: boolean;
  brands: string[];
  selectedBrand: string | null;
  onBrandChange: (val: string) => void;
  // onGetProducts: (val: string) => void;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "end",
  gap: "10px",
  borderRadius: "15px",
  padding: "2rem",
}));

const Brands: React.FC<BrandsProps> = ({
  isLoading,
  brands,
  selectedBrand,
  onBrandChange,
  //onGetProducts,
}) => {
  const [open, setOpen] = useState(false);

  const handleInfoClick = () => {
    setOpen((prev) => !prev);
  };

  return (
    <StyledPaper elevation={0}>
      <Stack justifyContent="center">
        <Typography>1. Select available brand</Typography>
        {isLoading && <LinearProgress />}
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
          {!isLoading &&
            brands?.map((brand, i) => {
              return (
                <StyledFadeIn key={i} delay={i * 0.1} visible={!isLoading}>
                  <Chip
                    sx={{ marginBottom: { xs: "0.5rem", md: "0rem" } }}
                    label={brand}
                    clickable={true}
                    variant="outlined"
                    component={Button}
                    onClick={() => {
                      if (selectedBrand !== brand) {
                        onBrandChange(brand);
                        //onGetProducts(brand);
                      }
                    }}
                    color={selectedBrand === brand ? "primary" : "default"}
                  />
                </StyledFadeIn>
              );
            })}
        </Stack>
      </Stack>
      {!isLoading && (
        <>
          <Divider orientation="vertical" flexItem />
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            <Chip
              icon={<LightbulbTwoToneIcon color="warning" />}
              component={Button}
              clickable
              variant="outlined"
              label="Learn More"
              onClick={handleInfoClick}
            />

            <StrategyModal open={open} onClose={handleInfoClick} />
          </Stack>
        </>
      )}
    </StyledPaper>
  );
};

export default Brands;
