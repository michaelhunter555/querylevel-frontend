import {
  CouponValueTypeProps,
  OfferTypeProps,
  ProductApplicabilityProps,
  RedemptionChannelProps,
  State,
  StoreApplicability,
  TargetCountryProps,
} from "@/types";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Typography from "@mui/material/Typography";

interface PromotionSelectorProps {
  promotionField: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  formState: State;
  title: string;
  isDisabled?: boolean;
}

const PromotionSelectors = ({
  formState,
  promotionField,
  onChange,
  title,
  isDisabled,
}: PromotionSelectorProps) => {
  const fields = [
    { type: "couponValueType", enum: CouponValueTypeProps },
    { type: "redemptionChannel", enum: RedemptionChannelProps },
    { type: "productApplicability", enum: ProductApplicabilityProps },
    { type: "offerType", enum: OfferTypeProps },
    { type: "storeApplicability", enum: StoreApplicability },
    { type: "targetCountry", enum: TargetCountryProps },
  ];

  let promoEnum;
  let field;
  for (let i = 0; i < fields.length; i++) {
    if (promotionField === fields[i].type) {
      promoEnum = fields[i].enum;
      field = fields[i].type;
    }
  }

  return (
    <>
      <Typography color="text.secondary">{title}</Typography>
      <Select
        fullWidth
        disabled={isDisabled}
        id={promotionField}
        name={promotionField}
        onChange={onChange}
        value={
          (formState?.inputs?.[field as string]?.value as string) ||
          promoEnum?.[1]
        }
      >
        {promoEnum &&
          Object.entries(promoEnum)
            .filter(([key, value]) => !isNaN(value))
            .map(([key, value]) => (
              <MenuItem key={value} value={key}>
                {key}
              </MenuItem>
            ))}
      </Select>
    </>
  );
};

export default PromotionSelectors;
