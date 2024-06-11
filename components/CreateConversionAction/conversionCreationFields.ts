import { TConversionTable } from "@/types";

export const createConversionFields = {
  conversionName: {
    value: "",
    isValid: false,
  },
  defaultValue: {
    value: 1,
    isValid: true,
  },
  alwaysUseDefaultValue: {
    value: true,
    isValid: true,
  },
  countingType: {
    value: 3,
    isValid: true,
  },
  attributionModel: {
    value: 106,
    isValid: true,
  },
  primaryForGoal: {
    value: true,
    isValid: true,
  },
  viewThroughLookbackWindowDays: {
    value: 1,
    isValid: true,
  },
  clickThroughLookbackWindowDays: {
    value: 90,
    isValid: true,
  },
};

export const handleFormFields = (conversionData: TConversionTable) => {
  return {
    conversionName: {
      value: conversionData?.name || "",
      isValid: true,
    },
    defaultValue: {
      value: conversionData?.value_settings.default_value || 0,
      isValid: true,
    },
    alwaysUseDefaultValue: {
      value: conversionData?.value_settings?.always_use_default_value ?? false,
      isValid: true,
    },
    countingType: {
      value: conversionData?.counting_type || 0,
      isValid: true,
    },
    attributionModel: {
      value:
        conversionData?.attribution_model_settings?.attribution_model || "",
      isValid: true,
    },
    primaryForGoal: {
      value: conversionData?.primary_for_goal ?? false,
      isValid: true,
    },
    viewThroughLookbackWindowDays: {
      value: conversionData?.view_through_lookback_window_days,
      isValid: true,
    },
    clickThroughLookbackWindowDays: {
      value: conversionData?.click_through_lookback_window_days,
      isValid: true,
    },
  };
};
