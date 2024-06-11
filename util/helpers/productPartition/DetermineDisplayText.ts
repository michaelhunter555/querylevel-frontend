import { AdGroupCriterionResource, DimensionsObject } from "@/types";

/**
 * @name - isEverythingElseNode
 * @param node -product_group_view
 * @returns checks whether the case_value property is null or not
 */
export const isEverythingElseNode = (
  node: AdGroupCriterionResource
): boolean => {
  const caseValue: {
    [key: string]: { [key: string]: string | null | undefined };
  } | null = node.listing_group.case_value; // {}
  if (!caseValue) return true; // Treat as "Everything Else" if case_value is not defined or empty
  //check every key in the case_value property to find the key {value: null }
  //
  return Object.keys(caseValue).every((key) => {
    const keyValue = caseValue[key];
    return !keyValue || keyValue.value === null || !keyValue.value;
  });
};

/**
 * @name - determineDisplayText
 * @param node - product_group_view
 * @param level - level in product_group_view hierarchy
 * @helpers - @isEverythingElseNode()
 * @returns a string value representation for the product partition 'everything else in (parent name)' for others node.
 */
export const determineDisplayText = (
  node: AdGroupCriterionResource,
  level?: number
) => {
  if (level === 0) {
    return "All Products";
  } else if (isEverythingElseNode(node)) {
    // For "Everything Else" nodes, determine the display text based on parent context or path
    const pathDimensions = node?.listing_group?.path?.dimensions;
    if (pathDimensions && pathDimensions.length > 0) {
      //path hierarchy is descending so its parent property is one index before it
      //target 2nd last item since the 'others' node will be an empty object {}
      const parentDimension: DimensionsObject =
        pathDimensions[pathDimensions?.length - 2] || {};
      //extract the key of that property
      const categoryKey: keyof typeof parentDimension =
        Object.keys(parentDimension)[0]; // e.g., "product_brand"
      //find its value
      const categoryValue: string | null | undefined =
        parentDimension[categoryKey]?.value; // e.g., "Dimplex"
      //if it's not the root node, return its value
      return categoryValue
        ? `Everything Else in ${categoryValue}`
        : "Everything Else in All Products";
    }
    return "Everything Else";
  } else {
    // if not 'others' node, then UNIT should have a truthy case_value[property].value
    if (node.listing_group.case_value?.product_brand?.value) {
      return node.listing_group.case_value.product_brand.value;
    } else if (node.listing_group.case_value?.product_type?.value) {
      return node.listing_group.case_value.product_type.value;
    } else if (node.listing_group.case_value?.product_item_id?.value) {
      return node.listing_group.case_value.product_item_id.value;
    }
  }
};
