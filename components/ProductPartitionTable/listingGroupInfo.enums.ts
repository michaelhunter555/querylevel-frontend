/**
 * LISTING_GROUP_INFO

all_products
product_brand
product_condition
product_channel_exclusity
product_channel
product_item_id
product_type

CASE_VALUE: {},
product_brand: {
value: string
}

product_channel: {
channel: enums.ProductChannel
}

product_condition: {
condition: enums.ProductCondition
}

product_item_id: {
value: string
}

product_type: {
level: enum.ProductTypeLevel,
value: string
}
 * 
 * 
 * listing_group.
 * ad_group_criterion: {
 * listing_group: {
 * type: enums,
 * case_value: null || {},
 * parent_ad_group_criterion: null || string(resourceName),
 * path: { dimensions: [] || [{listingDimsionsInfo: { property: value }}]}}
 * }
 */

const a = [
  "all_products",
  "product_brand",
  "product_condition",
  "product_channel_exclusity",
  "product_channel",
  "product_item_id",
  "product_type",
];
