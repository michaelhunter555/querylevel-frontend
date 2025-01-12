import React, { useEffect, useState } from "react";

import DatePickerField from "@/components/Shared/DatePicker/DatePicker";
import { useCheckDevice } from "@/hooks/use-device-hook";
import { useForm } from "@/hooks/useForm";
import type { TShoppingPromotionRequest } from "@/types";
import { FormHelperText, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import type { SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { TextFieldInput } from "../CreateCampaignSteps/CreateShoppingCampaign/TextFieldInputs";
import {
  createPromotionData,
  initialPromotionItems,
} from "./createPromotionItems";
import PromotionSelectors from "./PromotionSelectors";

interface PromotionFormProps {
  onSubmitForm: (promotionData: TShoppingPromotionRequest) => Promise<void>;
  couponValueType: number;
  selectPromotionIndex: number;
  cancelSteps: () => void;
  response: { message: string; ok: boolean };
  isPostLoading: boolean;
}

const checkDateConflict = (fromDate: string, toDate: string): boolean => {
  const startDate = new Date(fromDate).getTime();
  const endDate = new Date(toDate).getTime();
  //if start
  return startDate > endDate;
};

const customField = (couponValueType: number) => {
  if (couponValueType === 0) {
    return { field: "percentOff", title: "select percent Off", adornment: "%" };
  } else if (couponValueType === 1) {
    return { field: "amountOff", title: "select amount off", adornment: "$" };
  }
};
const PromotionForm = ({
  onSubmitForm,
  couponValueType,
  selectPromotionIndex,
  cancelSteps,
  response,
  isPostLoading,
}: PromotionFormProps) => {
  const { isMobile } = useCheckDevice();
  const [promoId, setPromoId] = useState<number>(0);

  //check if promo applies to specific products.
  const isSpecific: boolean =
    selectPromotionIndex === 1 ||
    selectPromotionIndex === 2 ||
    selectPromotionIndex === 3 ||
    selectPromotionIndex === 4;

  //initialize formState - we get couponValueType from parent
  const [formState, inputHandler, setFormData] = useForm(
    {
      //coupon value passed form parent
      couponValueType: {
        value: couponValueType === 1 ? "MONEY_OFF" : "PERCENT_OFF",
        isValid: true,
      },
      //spread initial properties
      ...initialPromotionItems,
      //set product applicability to specific if segmenting
      ...(isSpecific
        ? {
            productApplicability: { value: "SPECIFIC_PRODUCTS", isValid: true },
          }
        : { productApplicability: { value: "ALL_PRODUCTS", isValid: true } }),
      //check which properties to add based on coupon type %off or $off
      ...(couponValueType === 0
        ? { percentOff: { value: 0, isValid: false } }
        : couponValueType === 1 && { amountOff: { value: 0, isValid: false } }),
      //handle property for min purchase amount
      ...(selectPromotionIndex === 4 && {
        minimumPurchaseAmount: { value: 0, isValid: false },
      }),
      ...(promoId && { promotionId: { value: promoId, isValid: false } }),
    },
    false
  );

  //listen for form validity & check until all required inputs satisfied
  useEffect(() => {
    if (formState?.isValid) {
      setFormData({ ...formState?.inputs }, true);
    }
  }, [formState?.isValid]);

  //convert data into object and pass the parent for API request
  const handleFormSubmit = async (event: React.FormEvent) => {
    event?.preventDefault();
    const promotionData: TShoppingPromotionRequest = createPromotionData(
      formState,
      couponValueType
    );
    await onSubmitForm(promotionData);

    if (response.ok) {
      setFormData({ ...initialPromotionItems }, false);
    }
  };

  const generateRandomId = () => {
    const newId = Math.floor(Math.random() * 99999999);
    setPromoId(newId);
    inputHandler("promotionId", String(`${newId}__promo`), newId !== 0);
  };

  const input = customField(couponValueType);

  //if true there is a date conflict - should disable button
  const hasDateConflict = checkDateConflict(
    String(formState?.inputs?.startTime.value),
    String(formState?.inputs?.endTime?.value)
  );

  return (
    <Container
      maxWidth={isMobile ? "lg" : "md"}
      component={Paper}
      sx={{ padding: 2 }}
    >
      <Box component="form" onSubmit={handleFormSubmit}>
        <Grid container direction={"row"} spacing={2}>
          <Grid item xs={7}>
            <TextFieldInput
              fullWidth={true}
              disabled={
                (formState?.inputs?.longTitle?.value as string).length > 60
              }
              id="longTitle"
              name="longTitle"
              value={formState?.inputs?.longTitle?.value || ""}
              inputHandler={inputHandler}
              hasAdornment={false}
              title="Title of this promo*"
              type="text"
              helperText="Add a title under 60 characters."
            />
          </Grid>
          {
            <Grid item xs={5}>
              <TextFieldInput
                id={String(input?.field)}
                name={String(input?.field)}
                title={String(input?.title)}
                fullWidth={true}
                value={
                  formState?.inputs?.[input?.field as keyof typeof formState]
                    ?.value
                }
                inputHandler={inputHandler}
                hasAdornment={true}
                type="number"
                step="1"
                adornmentValue={input?.adornment}
              />
            </Grid>
          }
          {/* coupon value & language */}
          <Grid item xs={12} md={5}>
            <TextFieldInput
              fullWidth={true}
              disabled={true}
              id="couponValueType"
              name="couponValueType"
              value={formState?.inputs?.couponValueType?.value}
              inputHandler={inputHandler}
              hasAdornment={false}
              title="Coupon Type*"
              type="text"
            />
          </Grid>
          <Grid item xs={5} md={3}>
            <PromotionSelectors
              title="Target Country"
              promotionField="targetCountry"
              formState={formState}
              onChange={(event: SelectChangeEvent<string>) =>
                inputHandler(
                  "targetCountry",
                  event.target.value,
                  event.target.value !== ""
                )
              }
            />
          </Grid>
          <Grid item xs={5} md={3}>
            <TextFieldInput
              disabled={true}
              id="contentLanguage"
              name="contentLanguage"
              value={formState?.inputs?.contentLanguage?.value}
              inputHandler={inputHandler}
              hasAdornment={false}
              title="Language*"
              type="text"
              helperText="i.e. English"
            />
          </Grid>
          {/*  */}
          <Grid item xs={12} md={8}>
            <TextFieldInput
              fullWidth={true}
              adornmentValue={
                <Button variant="outlined" onClick={generateRandomId}>
                  Generate Id
                </Button>
              }
              id="promotionId"
              name="promotionId"
              value={formState?.inputs?.promotionId?.value}
              inputHandler={inputHandler}
              hasAdornment={true}
              title="Promo Id*"
              type="text"
              helperText="Unique Id to associate with this promotion code"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <PromotionSelectors
              isDisabled={true}
              title="Product Applicability"
              promotionField="productApplicability"
              formState={formState}
              onChange={(event: SelectChangeEvent<string>) =>
                inputHandler(
                  "productApplicability",
                  event.target.value,
                  event.target.value !== ""
                )
              }
            />
          </Grid>
          <Grid item xs={6} md={5}>
            <PromotionSelectors
              title="Offer Type"
              promotionField="offerType"
              formState={formState}
              onChange={(event: SelectChangeEvent<string>) =>
                inputHandler(
                  "offerType",
                  event.target.value,
                  event.target.value !== ""
                )
              }
            />
          </Grid>
          <Grid item xs={6} md={5}>
            <TextFieldInput
              fullWidth={true}
              id="genericRedemptionCode"
              name="genericRedemptionCode"
              value={
                String(formState?.inputs?.genericRedemptionCode?.value) || ""
              }
              inputHandler={inputHandler}
              hasAdornment={false}
              title="Redemption Code*"
              type="text"
              helperText="code to redeem offer"
            />
          </Grid>

          <Grid item xs={12}>
            <PromotionSelectors
              title="Redemption Channel"
              promotionField="redemptionChannel"
              formState={formState}
              onChange={(event: SelectChangeEvent<string>) =>
                inputHandler(
                  "redemptionChannel",
                  event.target.value,
                  event.target.value !== ""
                )
              }
            />
          </Grid>
          <Grid item xs={6}>
            <Typography color="text.secondary">Start Date</Typography>
            <DatePickerField
              formState={formState?.inputs?.startTime?.value as string}
              name="startTime"
              inputHandler={inputHandler}
              fullWidth={true}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography color="text.secondary">End Date</Typography>
            <DatePickerField
              formState={formState?.inputs?.endTime?.value as string}
              name="endTime"
              inputHandler={inputHandler}
              fullWidth={true}
            />
          </Grid>
        </Grid>
        {hasDateConflict && (
          <FormHelperText error>
            Start date must be before an end date.
          </FormHelperText>
        )}
        <Divider sx={{ margin: "0.5rem auto" }} />
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="flex-end"
        >
          <Button color="error" variant="outlined" onClick={cancelSteps}>
            Cancel
          </Button>
          <Button
            variant="contained"
            type="submit"
            disabled={!formState.isValid || hasDateConflict}
          >
            {isPostLoading ? "...Creating" : "Create Promotion"}
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default PromotionForm;
