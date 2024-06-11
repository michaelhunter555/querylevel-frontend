import React, { useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import { useShoppingCampaign } from "@/hooks/useShoppingCampaign";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";

const Brands = dynamic(() => import("./Brands"), { ssr: false });
const DemoProductData = dynamic(() => import("./DemoProduct"), {
  ssr: false,
  loading: () => <LinearProgress />,
});
const ShoppingProductPreview = dynamic(() => import("./ShoppingPreviewCard"), {
  ssr: false,
  loading: () => <LinearProgress />,
});

const CreateShoppingCampaign = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const sessionIsValid = session?.user._id && session?.user?.googleAccountId;
  const { getMerchantsData, getProductsData } = useShoppingCampaign();

  useEffect(() => {
    if (!sessionIsValid) {
      router.push("/user-dashboard");
    }
  }, [sessionIsValid]);

  //get all available brands from Google Merchant Center
  const { data: brands, isLoading: brandsIsLoading } = useQuery({
    queryKey: ["merchantsBrandsData"],
    queryFn: () => getMerchantsData(),
    enabled: Boolean(session?.user?._id),
  });

  useEffect(() => {
    const storedData = localStorage.getItem("brand");
    if (storedData && !brandsIsLoading) {
      setSelectedBrand(storedData);
    }
  }, [brandsIsLoading]);

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    localStorage.setItem("brand", brand);
  };

  //keywords, preview, productCount
  //only run if we select a brand
  const { data: productData, isLoading: productDataIsLoading } = useQuery({
    queryKey: ["merchantsData", selectedBrand],
    queryFn: () => getProductsData(selectedBrand as string),
    enabled: Boolean(selectedBrand && session?.user?._id),
  });

  return (
    <Grid container direction="column" spacing={2} sx={{ marginBottom: 3 }}>
      <Grid item>
        <Typography variant="subtitle1" color="text.secondary">
          Create Tiered Campaigns
        </Typography>
      </Grid>

      <Grid item>
        <Brands
          isLoading={brandsIsLoading}
          brands={brands && brands}
          selectedBrand={selectedBrand}
          onBrandChange={handleBrandChange}
        />
      </Grid>

      {selectedBrand ? (
        <Grid item sx={{ marginTop: 3 }}>
          <Stack direction="column" spacing={2}>
            {brands && (
              <DemoProductData
                countIsLoading={productDataIsLoading}
                selectedBrand={selectedBrand}
                activeProducts={productData?.productCount}
              />
            )}
          </Stack>

          <Stack direction="row">
            {!productDataIsLoading &&
              brands &&
              productData?.preview &&
              productData?.keywords && (
                <ShoppingProductPreview
                  product={productData?.preview}
                  keywords={productData?.keywords}
                />
              )}
          </Stack>
        </Grid>
      ) : (
        ""
      )}
    </Grid>
  );
};

export default CreateShoppingCampaign;
