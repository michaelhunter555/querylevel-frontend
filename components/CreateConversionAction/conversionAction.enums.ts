enum ConversionActionCountingType {
  ONE_PER_CLICK = 2,
  MANY_PER_CLICK = 3,
}
export const ConversionCountType = {
  [ConversionActionCountingType.ONE_PER_CLICK]: "One Per Click",
  [ConversionActionCountingType.MANY_PER_CLICK]: "Many Per Click",
};

enum AttributionModel {
  UNSPECIFIED = 0,
  UNKNOWN = 1,
  EXTERNAL = 100,
  GOOGLE_ADS_LAST_CLICK = 101,
  GOOGLE_SEARCH_ATTRIBUTION_FIRST_CLICK = 102,
  GOOGLE_SEARCH_ATTRIBUTION_LINEAR = 103,
  GOOGLE_SEARCH_ATTRIBUTION_TIME_DECAY = 104,
  GOOGLE_SEARCH_ATTRIBUTION_POSITION_BASED = 105,
  GOOGLE_SEARCH_ATTRIBUTION_DATA_DRIVEN = 106,
}

/**
 * @name AttributionModelEnum.AttributionModel
 * @link https://developers.google.com/google-ads/api/reference/rpc/v14/AttributionModelEnum.AttributionModel
 */
export const ConversionAttributionModel = {
  [AttributionModel.GOOGLE_ADS_LAST_CLICK]: "Last Click",
  [AttributionModel.GOOGLE_SEARCH_ATTRIBUTION_FIRST_CLICK]:
    "Google Search First Click",
  [AttributionModel.GOOGLE_SEARCH_ATTRIBUTION_LINEAR]: "Linear",
  [AttributionModel.GOOGLE_SEARCH_ATTRIBUTION_TIME_DECAY]: "Time Decay",
  [AttributionModel.GOOGLE_SEARCH_ATTRIBUTION_POSITION_BASED]: "Position Based",
  [AttributionModel.GOOGLE_SEARCH_ATTRIBUTION_DATA_DRIVEN]: "Data Driven",
};

export enum ConversionActionType {
  UNSPECIFIED = 0,
  UNKNOWN = 1,
  AD_CALL = 2,
  CLICK_TO_CALL = 3,
  GOOGLE_PLAY_DOWNLOAD = 4,
  GOOGLE_PLAY_IN_APP_PURCHASE = 5,
  UPLOAD_CALLS = 6,
  UPLOAD_CLICKS = 7,
  WEBPAGE = 8,
  WEBSITE_CALL = 9,
  STORE_SALES_DIRECT_UPLOAD = 10,
  STORE_SALES = 11,
  FIREBASE_ANDROID_FIRST_OPEN = 12,
  FIREBASE_ANDROID_IN_APP_PURCHASE = 13,
  FIREBASE_ANDROID_CUSTOM = 14,
  FIREBASE_IOS_FIRST_OPEN = 15,
  FIREBASE_IOS_IN_APP_PURCHASE = 16,
  FIREBASE_IOS_CUSTOM = 17,
  THIRD_PARTY_APP_ANALYTICS_ANDROID_FIRST_OPEN = 18,
  THIRD_PARTY_APP_ANALYTICS_ANDROID_IN_APP_PURCHASE = 19,
  THIRD_PARTY_APP_ANALYTICS_ANDROID_CUSTOM = 20,
  THIRD_PARTY_APP_ANALYTICS_IOS_FIRST_OPEN = 21,
  THIRD_PARTY_APP_ANALYTICS_IOS_IN_APP_PURCHASE = 22,
  THIRD_PARTY_APP_ANALYTICS_IOS_CUSTOM = 23,
  ANDROID_APP_PRE_REGISTRATION = 24,
  ANDROID_INSTALLS_ALL_OTHER_APPS = 25,
  FLOODLIGHT_ACTION = 26,
  FLOODLIGHT_TRANSACTION = 27,
  GOOGLE_HOSTED = 28,
  LEAD_FORM_SUBMIT = 29,
  SALESFORCE = 30,
  SEARCH_ADS_360 = 31,
  SMART_CAMPAIGN_AD_CLICKS_TO_CALL = 32,
  SMART_CAMPAIGN_MAP_CLICKS_TO_CALL = 33,
  SMART_CAMPAIGN_MAP_DIRECTIONS = 34,
  SMART_CAMPAIGN_TRACKED_CALLS = 35,
  STORE_VISITS = 36,
  WEBPAGE_CODELESS = 37,
  UNIVERSAL_ANALYTICS_GOAL = 38,
  UNIVERSAL_ANALYTICS_TRANSACTION = 39,
  GOOGLE_ANALYTICS_4_CUSTOM = 40,
  GOOGLE_ANALYTICS_4_PURCHASE = 41,
}

export const conversionTypeMapping = {
  [ConversionActionType.UNSPECIFIED]: "Unspecified",
  [ConversionActionType.UNKNOWN]: "Unknown",
  [ConversionActionType.AD_CALL]: "Ad Call",
  [ConversionActionType.CLICK_TO_CALL]: "Click to Call",
  [ConversionActionType.GOOGLE_PLAY_DOWNLOAD]: "Google Play Download",
  [ConversionActionType.GOOGLE_PLAY_IN_APP_PURCHASE]:
    "Google Play In-App Purchase",
  [ConversionActionType.UPLOAD_CALLS]: "Upload Calls",
  [ConversionActionType.UPLOAD_CLICKS]: "Upload Clicks",
  [ConversionActionType.WEBPAGE]: "Webpage",
  [ConversionActionType.WEBSITE_CALL]: "Website Call",
  [ConversionActionType.STORE_SALES_DIRECT_UPLOAD]: "Store Sales Direct Upload",
  [ConversionActionType.STORE_SALES]: "Store Sales",
  [ConversionActionType.FIREBASE_ANDROID_FIRST_OPEN]:
    "Firebase Android First Open",
  [ConversionActionType.FIREBASE_ANDROID_IN_APP_PURCHASE]:
    "Firebase Android In-App Purchase",
  [ConversionActionType.FIREBASE_ANDROID_CUSTOM]: "Firebase Android Custom",
  [ConversionActionType.FIREBASE_IOS_FIRST_OPEN]: "Firebase iOS First Open",
  [ConversionActionType.FIREBASE_IOS_IN_APP_PURCHASE]:
    "Firebase iOS In-App Purchase",
  [ConversionActionType.FIREBASE_IOS_CUSTOM]: "Firebase iOS Custom",
  [ConversionActionType.THIRD_PARTY_APP_ANALYTICS_ANDROID_FIRST_OPEN]:
    "Third Party App Analytics Android First Open",
  [ConversionActionType.THIRD_PARTY_APP_ANALYTICS_ANDROID_IN_APP_PURCHASE]:
    "Third Party App Analytics Android In-App Purchase",
  [ConversionActionType.THIRD_PARTY_APP_ANALYTICS_ANDROID_CUSTOM]:
    "Third Party App Analytics Android Custom",
  [ConversionActionType.THIRD_PARTY_APP_ANALYTICS_IOS_FIRST_OPEN]:
    "Third Party App Analytics iOS First Open",
  [ConversionActionType.THIRD_PARTY_APP_ANALYTICS_IOS_IN_APP_PURCHASE]:
    "Third Party App Analytics iOS In-App Purchase",
  [ConversionActionType.THIRD_PARTY_APP_ANALYTICS_IOS_CUSTOM]:
    "Third Party App Analytics iOS Custom",
  [ConversionActionType.ANDROID_APP_PRE_REGISTRATION]:
    "Android App Pre-Registration",
  [ConversionActionType.ANDROID_INSTALLS_ALL_OTHER_APPS]:
    "Android Installs All Other Apps",
  [ConversionActionType.FLOODLIGHT_ACTION]: "Floodlight Action",
  [ConversionActionType.FLOODLIGHT_TRANSACTION]: "Floodlight Transaction",
  [ConversionActionType.GOOGLE_HOSTED]: "Google Hosted",
  [ConversionActionType.LEAD_FORM_SUBMIT]: "Lead Form Submit",
  [ConversionActionType.SALESFORCE]: "Salesforce",
  [ConversionActionType.SEARCH_ADS_360]: "Search Ads 360",
  [ConversionActionType.SMART_CAMPAIGN_AD_CLICKS_TO_CALL]:
    "Smart Campaign Ad Clicks to Call",
  [ConversionActionType.SMART_CAMPAIGN_MAP_CLICKS_TO_CALL]:
    "Smart Campaign Map Clicks to Call",
  [ConversionActionType.SMART_CAMPAIGN_MAP_DIRECTIONS]:
    "Smart Campaign Map Directions",
  [ConversionActionType.SMART_CAMPAIGN_TRACKED_CALLS]:
    "Smart Campaign Tracked Calls",
  [ConversionActionType.STORE_VISITS]: "Store Visits",
  [ConversionActionType.WEBPAGE_CODELESS]: "Webpage Codeless",
  [ConversionActionType.UNIVERSAL_ANALYTICS_GOAL]: "Universal Analytics Goal",
  [ConversionActionType.UNIVERSAL_ANALYTICS_TRANSACTION]:
    "Universal Analytics Transaction",
  [ConversionActionType.GOOGLE_ANALYTICS_4_CUSTOM]: "Google Analytics 4 Custom",
  [ConversionActionType.GOOGLE_ANALYTICS_4_PURCHASE]:
    "Google Analytics 4 Purchase",
};

enum ConversionActionCategory {
  UNSPECIFIED = 0,
  UNKNOWN = 1,
  DEFAULT = 2,
  PAGE_VIEW = 3,
  PURCHASE = 4,
  SIGNUP = 5,
  DOWNLOAD = 7,
  ADD_TO_CART = 8,
  BEGIN_CHECKOUT = 9,
  SUBSCRIBE_PAID = 10,
  PHONE_CALL_LEAD = 11,
  IMPORTED_LEAD = 12,
  SUBMIT_LEAD_FORM = 13,
  BOOK_APPOINTMENT = 14,
  REQUEST_QUOTE = 15,
  GET_DIRECTIONS = 16,
  OUTBOUND_CLICK = 17,
  CONTACT = 18,
  ENGAGEMENT = 19,
  STORE_VISIT = 20,
  STORE_SALE = 21,
  QUALIFIED_LEAD = 22,
  CONVERTED_LEAD = 23,
}

export const ConversionActionMap = {
  [ConversionActionCategory.UNSPECIFIED]: "Unspecified",
  [ConversionActionCategory.UNKNOWN]: "Unknown",
  [ConversionActionCategory.DEFAULT]: "Default",
  [ConversionActionCategory.PAGE_VIEW]: "Page View",
  [ConversionActionCategory.PURCHASE]: "Purchase",
  [ConversionActionCategory.SIGNUP]: "Signup",
  [ConversionActionCategory.DOWNLOAD]: "Download",
  [ConversionActionCategory.ADD_TO_CART]: "Add to Cart",
  [ConversionActionCategory.BEGIN_CHECKOUT]: "Begin Checkout",
  [ConversionActionCategory.SUBSCRIBE_PAID]: "Subscribe (Paid)",
  [ConversionActionCategory.PHONE_CALL_LEAD]: "Phone Call Lead",
  [ConversionActionCategory.IMPORTED_LEAD]: "Imported Lead",
  [ConversionActionCategory.SUBMIT_LEAD_FORM]: "Submit Lead Form",
  [ConversionActionCategory.BOOK_APPOINTMENT]: "Book Appointment",
  [ConversionActionCategory.REQUEST_QUOTE]: "Request Quote",
  [ConversionActionCategory.GET_DIRECTIONS]: "Get Directions",
  [ConversionActionCategory.OUTBOUND_CLICK]: "Outbound Click",
  [ConversionActionCategory.CONTACT]: "Contact",
  [ConversionActionCategory.ENGAGEMENT]: "Engagement",
  [ConversionActionCategory.STORE_VISIT]: "Store Visit",
  [ConversionActionCategory.STORE_SALE]: "Store Sale",
  [ConversionActionCategory.QUALIFIED_LEAD]: "Qualified Lead",
  [ConversionActionCategory.CONVERTED_LEAD]: "Converted Lead",
};
