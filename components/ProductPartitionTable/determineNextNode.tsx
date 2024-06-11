import { AdGroupCriterionResource } from "@/types";

export const determineNextNode = (node: AdGroupCriterionResource): string => {
  // Access the children of the node to check their properties
  const children = node?.children || [];

  // types of children are present
  let hasBrandInChildren = false;
  let hasTypeInChildren = false;
  let hasProductIdInChildren = false;

  // check all children
  children?.forEach((child) => {
    if (child.listing_group.case_value?.product_brand?.value) {
      hasBrandInChildren = true;
    }
    // if (child.listing_group.case_value?.product_type?.value) {
    //   hasTypeInChildren = true;
    // }
    if (child.listing_group.case_value?.product_item_id?.value) {
      hasProductIdInChildren = true;
    }
  });

  // find next option based on the child props
  if (hasBrandInChildren && !hasTypeInChildren && hasProductIdInChildren) {
    return "item_id";
  } else if (hasBrandInChildren) {
    return "brand";
  }
  // else if (hasTypeInChildren) {
  //   return "type";
  // }
  else if (hasProductIdInChildren) {
    return "item_id";
    //if node has no children, check its case_value and set expected select values
  } else if (node?.children?.length === 0) {
    const { case_value } = node?.listing_group;
    if (case_value?.product_brand?.value) {
      return "item_id";
    }
  }

  // Default to "brand" if unable to determine from children
  return "brand";
};
