import { AdGroupCriterionResource, CaseValue } from "@/types";

/**
 * @name - determineModalSelectOptions
 * @param node - AdGroupCriterionResource
 * @param option - string value for selection modal options
 * @returns - array of logical options for selected partition.
 */
export const determineModalSelectOptions = (node: AdGroupCriterionResource) => {
  const caseValue: CaseValue | null = node?.listing_group?.case_value;
  const caseValueKeys = Object.keys(caseValue || {});

  if (
    caseValueKeys.length === 0 ||
    caseValueKeys.every((key) => caseValue?.[key]?.value === null)
  ) {
    return ["brand"]; // "item_id"
  }

  if (caseValue?.product_brand?.value) {
    return ["item_id"];
  } else if (caseValue?.product_type?.value) {
    return ["item_id"];
  } else if (caseValue?.product_item_id?.value) {
    return ["item_id"];
  }
  return ["brand", "item_id"];
};
