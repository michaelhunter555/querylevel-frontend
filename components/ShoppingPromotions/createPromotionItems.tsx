import type { State } from "@/types";

export const initialPromotionItems = {
  targetCountry: { value: "US", isValid: true },
  contentLanguage: { value: "en", isValid: true },
  promotionId: { value: "", isValid: false },
  productApplicability: { value: "", isValid: false },
  offerType: { value: "GENERIC_CODE", isValid: true },
  genericRedemptionCode: { value: "", isValid: false },
  longTitle: { value: "", isValid: false },
  redemptionChannel: { value: "ONLINE", isValid: true },
  startTime: { value: "", isValid: false },
  endTime: { value: "", isValid: false },
};

export const createPromotionData = (formState: State, promoType: number) => {
  //convert times to 8601 ISO Date formats
  const startTime = new Date(
    String(formState?.inputs?.startTime?.value)
  ).toISOString();
  const endTime = new Date(
    String(formState?.inputs?.endTime?.value)
  ).toISOString();

  return {
    couponValueType: formState?.inputs?.couponValueType?.value as number,
    targetCountry: formState?.inputs?.targetCountry?.value as string,
    contentLanguage: formState?.inputs?.contentLanguage?.value as string,
    promotionId: formState?.inputs?.promotionId?.value as string,
    productApplicability: formState?.inputs?.productApplicability
      ?.value as number,
    offerType: formState?.inputs?.offerType?.value as number,
    genericRedemptionCode: formState?.inputs?.genericRedemptionCode
      ?.value as string,
    longTitle: formState?.inputs?.longTitle?.value as string,
    redemptionChannel: formState?.inputs?.redemptionChannel?.value as number,
    promotionEffectiveTimePeriod: { startTime, endTime },
    ...(promoType === 0
      ? { percentOff: Number(formState?.inputs?.percentOff?.value) as number }
      : {
          moneyOffAmount: {
            currency: "USD",
            value: Number(formState?.inputs?.amountOff?.value) as number,
          },
        }),
  };
};
