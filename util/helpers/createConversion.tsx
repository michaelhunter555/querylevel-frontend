import { State } from "@/types";

export const createConversionObject = (formState: State) => ({
  conversionName: formState?.inputs?.conversionName?.value as string,
  defaultValue: formState?.inputs?.defaultValue?.value as number,
  alwaysUseDefaultValue: formState?.inputs?.alwaysUseDefaultValue
    ?.value as boolean,
  countingType: formState?.inputs?.countingType?.value as number,
  attributionModel: formState?.inputs?.attributionModel?.value as number,
  primaryForGoal: formState?.inputs?.primaryForGoal?.value as boolean,
  viewThroughLookbackWindowDays: formState?.inputs
    ?.viewThroughLookbackWindowDays?.value as number,
  clickThroughLookbackWindowDays: formState?.inputs
    ?.clickThroughLookbackWindowDays?.value as number,
});
