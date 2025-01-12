import React, { useState } from "react";

import { useSession } from "next-auth/react";

import { useInvalidateQuery } from "@/hooks/invalidateQueries";
import { useShoppingPromotion } from "@/hooks/promotions-hook";
import { useCheckDevice } from "@/hooks/use-device-hook";
import { useShoppingCampaign } from "@/hooks/useShoppingCampaign";
import { TShoppingPromotionRequest } from "@/types";
import { Box, InputAdornment, TextField } from "@mui/material";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import FormHelperText from "@mui/material/FormHelperText";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";

import SuccessModal from "../Modal/SuccessModal";
import { StyledFadeIn } from "../Shared/StyledFadeInComponents";
import PromotionForm from "./PromotionsForm";
import SelectPromotionType from "./SelectPromotionType";

interface PromotionStepsProps {
  cancelSteps: () => void;
}

const promotionByType: string[] = [
  "All Products",
  //"Item Id",
  "Brand",
  "Product Type",
  "Min. Price",
];

const PromotionSteps = ({ cancelSteps }: PromotionStepsProps) => {
  const { createPromotion, isPostLoading } = useShoppingPromotion();
  //check device type
  const { isMobile } = useCheckDevice();
  //use our active session id
  const { data: session } = useSession();
  //get brands by merchant center
  const { getMerchantsData, getMerchantProductTypes } = useShoppingCampaign();
  //promo id
  const [promoSelect, setPromoSelected] = useState<number | null>(null);
  //index of selected promotion applicability
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  //handle page change state
  // const [page, setPage] = useState({
  //   page: 0,
  //   limit: 15,
  // });
  // const [pageTokens, setPageTokens] = useState<string[]>([]);
  // //const [productIds, setProductIds] = useState<{ [key: string]: boolean }>({});
  // const [toggleForm, setToggleForm] = useState<boolean>(false);
  const [brandPromo, setBrandPromo] = useState<{
    [key: string]: string | number | null;
  }>({});

  const [productTypePromo, setProductTypePromo] = useState<{
    [key: string]: string | number | null;
  }>({});

  const [minimumPurchaseAmount, setMinimumPurchaseAmount] = useState<
    number | null
  >(0);
  const { invalidateQuery } = useInvalidateQuery();
  const [promoResponse, setPromoResponse] = useState<{
    message: string;
    ok: boolean;
  }>({ message: "", ok: false });

  const brandKeys = Object.keys(brandPromo);
  const productTypeKeys = Object.keys(productTypePromo);

  //get all brands in Merchant center
  const { data: brands, isLoading: brandsLoading } = useQuery({
    queryKey: ["promo_brands"],
    queryFn: () => getMerchantsData(),
    enabled: Boolean(selectedIndex === 1 && session?.user?._id),
  });

  //get all productTtypes
  const { data: productTypes, isLoading: productTypesIsLoading } = useQuery({
    queryKey: ["product_type_promo"],
    queryFn: () => getMerchantProductTypes(String(session?.user?._id)),
    enabled: Boolean(selectedIndex === 2 && session?.user?._id),
  });

  // const { data: allProducts, isLoading: loadingProducts } = useQuery({
  //   queryKey: ["all_merchant_products", page.page],
  //   queryFn: () =>
  //     getAllMerchantCenterProducts(
  //       String(session?.user?._id),
  //       String(page.limit),
  //       //take page# -1 to retrieve idex of page token
  //       pageTokens[page.page - 1] ?? undefined
  //     ),
  //   enabled: Boolean(
  //     session?.user?._id && (selectedIndex === 0 || selectedIndex === 1)
  //   ),
  // });

  // useEffect(() => {
  //   //get page token from response
  //   if (
  //     allProducts?.nextPageToken &&
  //     !pageTokens.includes(allProducts?.nextPageToken)
  //   ) {
  //     setPageTokens((prev) => [...prev, allProducts?.nextPageToken]);
  //   }
  // }, [allProducts?.nextPageToken]);

  // const handlePageforWard = () => {
  //   //increment page by 1
  //   setPage((prev) => ({
  //     ...prev,
  //     page: prev.page + 1,
  //   }));
  // };

  // const handlePageBack = () => {
  //   // decrement page by 1
  //   setPage((prev) => ({ ...prev, page: Math.min(prev.page - 1, 1) }));
  // };

  //promo type for amount off or percentage off
  const handlePromotionType = (id: number) => {
    setPromoSelected(id);
  };
  //console.log("Products", productIds);

  // const handleToggleFormItems = () => {
  //   setToggleForm((prev) => !prev);
  // };

  const handleBrandPromo = (brand: string, index: number) => {
    setBrandPromo((prev) => {
      const col = { ...prev };
      //check if its there already
      if (brand in col) {
        //if so remove it
        delete col[brand];
      } else {
        col[brand] = index;
      }
      return col;
    });
  };

  const handleProductTypePromo = (brand: string, index: number) => {
    setProductTypePromo((prev) => {
      const col = { ...prev };
      //check if its there already
      if (brand in col) {
        //if so remove it
        delete col[brand];
      } else {
        col[brand] = index;
      }
      return col;
    });
  };

  const handleCreatePromotion = async (
    promotion: TShoppingPromotionRequest
  ) => {
    if (session?.user?._id) {
      //pass form data & session id
      const newPromotion: { message: string; ok: boolean } =
        await createPromotion(
          {
            ...promotion,
            ...(selectedIndex === 1 && { brand: [...brandKeys] }),
            ...(selectedIndex === 2 && { productType: [...productTypeKeys] }),
            ...(selectedIndex === 3 && {
              minimumPurchaseAmount: {
                currency: "USD",
                value: Number(minimumPurchaseAmount),
              },
            }),
          },
          session?.user?._id
        );

      if (newPromotion?.ok) {
        //set promo success message
        setPromoResponse(newPromotion);
        setBrandPromo({});
        setProductTypePromo({});
        setMinimumPurchaseAmount(0);
        setSelectedIndex(null);
        setPromoSelected(null);
        await invalidateQuery("merchant_promotions");
      }
    }
  };

  const handleModal = () => {
    setPromoResponse({ message: "", ok: false });
    cancelSteps();
  };

  return (
    <Stack spacing={2} width={isMobile ? "100%" : "auto"}>
      <SuccessModal
        success={promoResponse.ok}
        message={promoResponse?.message}
        open={promoResponse?.ok}
        onClose={handleModal}
      />
      <SelectPromotionType onSelectPromotion={handlePromotionType} />
      <Divider />
      <Stack
        direction={isMobile ? "column" : "row"}
        alignItems="center"
        spacing={2}
        width={isMobile ? "100%" : "auto"}
      >
        {promoSelect !== null && (
          <>
            <FormHelperText>
              What will this promotion apply to? :
            </FormHelperText>
            {promotionByType.map((val, i) => (
              <StyledFadeIn key={i} visible={promoSelect !== null} delay={0.3}>
                <Chip
                  sx={{
                    width: isMobile ? 300 : "100%",
                    border: "1px solid grey",
                  }}
                  size="medium"
                  variant={selectedIndex === i ? "filled" : "outlined"}
                  clickable
                  onClick={() => {
                    setSelectedIndex(i);
                  }}
                  component="button"
                  label={val}
                />
              </StyledFadeIn>
            ))}
          </>
        )}
      </Stack>

      {/* All Products */}
      {selectedIndex === 0 && (
        <StyledFadeIn visible={true} delay={0} yAxis={5}>
          <PromotionForm
            isPostLoading={isPostLoading}
            response={promoResponse}
            cancelSteps={cancelSteps}
            selectPromotionIndex={selectedIndex}
            couponValueType={promoSelect as number}
            onSubmitForm={(promotionData: TShoppingPromotionRequest) =>
              handleCreatePromotion(promotionData)
            }
          />
        </StyledFadeIn>
      )}

      {/* When selecting brands */}
      {selectedIndex === 1 && (
        <Stack>
          <Divider>
            <Typography color="text.secondary" variant="subtitle2">
              Brands
            </Typography>
          </Divider>
          <Typography color="text.secondary" variant="subtitle2">
            Your brands:
          </Typography>
          <Stack
            spacing={2}
            direction="row"
            sx={{ width: "100%", ...(isMobile && { overflowX: "auto" }) }}
          >
            {brands &&
              !brandsLoading &&
              brands?.map((brand: string, i: number) => (
                <StyledFadeIn
                  visible={selectedIndex === 1}
                  delay={i * 0.1}
                  yAxis={20}
                >
                  <Chip
                    clickable
                    onClick={() => handleBrandPromo(brand, i)}
                    component="button"
                    color={brandKeys.includes(brand) ? "primary" : "default"}
                    variant={brandKeys.includes(brand) ? "filled" : "outlined"}
                    key={`${brand}__${i}`}
                    label={brand}
                  />
                </StyledFadeIn>
              ))}
          </Stack>
          <StyledFadeIn
            sx={{ marginTop: "0.5rem" }}
            visible={brandPromo.length !== 0}
            delay={0.3}
            yAxis={5}
          >
            <Typography color="text.secondary">
              This promotion applies to:{" "}
            </Typography>
            <Stack direction="row" alignItems="center">
              {brandKeys.length > 0 ? (
                <>
                  {brandKeys.slice(0, 3).map((brand, i) => (
                    <Chip
                      key={`${brand}_${i}`}
                      label={brand}
                      variant="outlined"
                      size="small"
                      sx={{ margin: 0.5 }}
                    />
                  ))}
                  {brandKeys.length > 3 && (
                    <Tooltip title={brandKeys.join(", ")}>
                      <Chip
                        label={`+${brandKeys.length - 3} more`}
                        variant="filled"
                        size="small"
                        // Replace with modal or tooltip
                        sx={{ margin: 0.5 }}
                      />
                    </Tooltip>
                  )}
                </>
              ) : (
                <Typography color="text.secondary" variant="subtitle2">
                  No brands selected
                </Typography>
              )}
            </Stack>
            {brandKeys.length !== 0 && (
              <StyledFadeIn
                visible={brandKeys.length !== 0}
                delay={0.3}
                yAxis={5}
              >
                <PromotionForm
                  isPostLoading={isPostLoading}
                  response={promoResponse}
                  cancelSteps={cancelSteps}
                  selectPromotionIndex={selectedIndex}
                  couponValueType={promoSelect as number}
                  onSubmitForm={(promotionData: TShoppingPromotionRequest) =>
                    handleCreatePromotion(promotionData)
                  }
                />
              </StyledFadeIn>
            )}
          </StyledFadeIn>
        </Stack>
      )}

      {/* When selecting productTYpe */}

      {selectedIndex === 2 && (
        <Stack>
          <Divider>
            <Typography color="text.secondary" variant="subtitle2">
              Product Types
            </Typography>
          </Divider>
          <Typography color="text.secondary" variant="subtitle2">
            Available Product Types:
          </Typography>
          <Stack
            spacing={2}
            direction="row"
            sx={{ width: "100%", ...(isMobile && { overflowX: "auto" }) }}
          >
            {productTypes &&
              !productTypesIsLoading &&
              productTypes?.map((type: string, i: number) => (
                <StyledFadeIn
                  visible={selectedIndex === 2}
                  delay={i * 0.1}
                  yAxis={20}
                >
                  <Chip
                    clickable
                    onClick={() => handleProductTypePromo(type, i)}
                    component="button"
                    color={
                      productTypeKeys.includes(type) ? "primary" : "default"
                    }
                    variant={
                      productTypeKeys.includes(type) ? "filled" : "outlined"
                    }
                    key={`${type}__${i}`}
                    label={type}
                  />
                </StyledFadeIn>
              ))}
          </Stack>
          <StyledFadeIn
            sx={{ marginTop: "0.5rem" }}
            visible={brandPromo.length !== 0}
            delay={0.3}
            yAxis={5}
          >
            <Typography color="text.secondary">
              This promotion applies to:{" "}
            </Typography>
            <Stack direction="row" alignItems="center">
              {productTypeKeys.length > 0 ? (
                <>
                  {productTypeKeys.slice(0, 3).map((brand, i) => (
                    <Chip
                      key={`${brand}_${i}`}
                      label={brand}
                      variant="outlined"
                      size="small"
                      sx={{ margin: 0.5 }}
                    />
                  ))}
                  {productTypeKeys.length > 3 && (
                    <Tooltip title={productTypeKeys.join(", ")}>
                      <Chip
                        label={`+${productTypeKeys.length - 3} more`}
                        variant="filled"
                        size="small"
                        // Replace with modal or tooltip
                        sx={{ margin: 0.5 }}
                      />
                    </Tooltip>
                  )}
                </>
              ) : (
                <Typography color="text.secondary" variant="subtitle2">
                  No types selected
                </Typography>
              )}
            </Stack>
            {productTypeKeys.length !== 0 && (
              <StyledFadeIn
                visible={productTypeKeys.length !== 0}
                delay={0.3}
                yAxis={5}
              >
                <PromotionForm
                  isPostLoading={isPostLoading}
                  response={promoResponse}
                  cancelSteps={cancelSteps}
                  selectPromotionIndex={selectedIndex}
                  couponValueType={promoSelect as number}
                  onSubmitForm={(promotionData: TShoppingPromotionRequest) =>
                    handleCreatePromotion(promotionData)
                  }
                />
              </StyledFadeIn>
            )}
          </StyledFadeIn>
        </Stack>
      )}

      {selectedIndex === 3 && (
        <StyledFadeIn visible={selectedIndex === 3} delay={0.3} yAxis={5}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              marginBottom: "0.5rem",
              width: { xs: "100%", md: 250 },
            }}
          >
            <Typography color="text.secondar" variant="subtitle2">
              Applies to all items over the price of:
            </Typography>
            <TextField
              type="number"
              value={minimumPurchaseAmount}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setMinimumPurchaseAmount(Number(event.target.value))
              }
            />
          </Box>

          <StyledFadeIn
            visible={minimumPurchaseAmount !== 0}
            delay={0.3}
            yAxis={5}
          >
            <PromotionForm
              isPostLoading={isPostLoading}
              response={promoResponse}
              cancelSteps={cancelSteps}
              selectPromotionIndex={selectedIndex}
              couponValueType={promoSelect as number}
              onSubmitForm={(promotionData: TShoppingPromotionRequest) =>
                handleCreatePromotion(promotionData)
              }
            />
          </StyledFadeIn>
        </StyledFadeIn>
      )}
    </Stack>
  );
};

export default PromotionSteps;
