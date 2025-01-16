export enum StoreApplicability {
  STORE_APPLICABILITY_UNSPECIFIED = 0,
  ALL_STORES = 1,
  SPECIFIC_STORES = 2,
}

export enum DestinationPromotionStatus {
  STATE_UNSPECIFIED = "Unknown promotion state",
  IN_REVIEW = "The promotion is under review",
  REJECTED = "The promotion is disapproved",
  LIVE = "The promotion is approved and active",
  STOPPED = "The promotion is stopped by merchant",
  EXPIRED = "The promotion is no longer active",
  PENDING = "The promotion is not stopped, and all reviews are approved, but the active date is in the future",
}

export enum CouponValueTypeProps {
  COUPON_VALUE_TYPE_UNSPECIFIED = 0,
  MONEY_OFF = 1,
  PERCENT_OFF = 2,
  BUY_M_GET_N_MONEY_OFF = 3,
  BUY_M_GET_N_PERCENT_OFF = 4,
}

export enum RedemptionChannelProps {
  REDEMPTION_CHANNEL_UNSPECIFIED = 0,
  IN_STORE = 1,
  ONLINE = 2,
}

export enum ProductApplicabilityProps {
  PRODUCT_APPLICABILITY_UNSPECIFIED = 0,
  ALL_PRODUCTS = 1,
  SPECIFIC_PRODUCTS = 2,
}

export enum OfferTypeProps {
  OFFER_TYPE_UNSPECIFIED = 0,
  NO_CODE = 1,
  GENERIC_CODE = 2,
}

export enum TargetCountryProps {
  AU = 0,
  CA = 1,
  DE = 2,
  FR = 3,
  GB = 4,
  IN = 5,
  US = 6,
  BR = 7,
  ES = 8,
  NL = 9,
  JP = 10,
  IT = 11,
  KR = 12,
}
