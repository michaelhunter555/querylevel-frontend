// import React, { lazy, Suspense, useState } from "react";

// import { useSession } from "next-auth/react";

// import GoogleAuthButton from "@/components/GoogleAuthButton/GoogleAuthButton";
// import { MenuComponent } from "@/components/SidebarMenu/enums.menuItems";
// import { useGetCampaigns } from "@/hooks/campaign-hooks";
// import { useGetShoppingSearchTerms } from "@/hooks/reports-hooks";
// import { useShoppingCampaign } from "@/hooks/useShoppingCampaign";
// import { TSearchTerms } from "@/types";
// import LinearProgress from "@mui/material/LinearProgress";
// import { SelectChangeEvent } from "@mui/material/Select";
// import { useQuery } from "@tanstack/react-query";

// //import { UserSettings } from "../UserSettings/UserSettings";

// // import CampaignView from "@/components/CampaignsView/CampaignsView";
// // import CreateShoppingCampaign from "@/components/CreateCampaignSteps/CreateShoppingCampaign/CreateShoppingCampaign";
// // import { CreateWebsiteConversion } from "@/components/CreateConversionAction/CreateWebsiteConversion";
// // import SearchTermView from "@/components/SearchTerms/SearchTermView";
// // import ContactForm from "../ContactForm/ContactForm";
// const CampaignView = lazy(
//   () => import("@/components/CampaignsView/CampaignsView")
// );
// const CreateShoppingCampaign = lazy(
//   () =>
//     import(
//       "@/components/CreateCampaignSteps/CreateShoppingCampaign/CreateShoppingCampaign"
//     )
// );
// const SearchTermView = lazy(
//   () => import("@/components/SearchTerms/SearchTermView")
// );
// const CreateWebsiteConversion = lazy(
//   () => import("@/components/CreateConversionAction/CreateWebsiteConversion")
// );
// const UserSettings = lazy(
//   () => import("@/components/UserSettings/UserSettings")
// );
// const ContactForm = lazy(() => import("../ContactForm/ContactForm"));

// interface RenderComponent {
//   component: string;
// }

// export const RenderComponent = ({ component }: RenderComponent) => {
//   const { data: session, status } = useSession();
//   const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
//   const [campaignId, setCampaignId] = useState<string>("");
//   const [segment, setSegment] = useState("LAST_7_DAYS");
//   const [fetchNegativeKeywords, setFetchNegativeKeywords] = useState(false);
//   const { getNegativeKeywords } = useGetShoppingSearchTerms();
//   const sessionIsValid = session?.user._id && session?.user?.googleAccountId;
//   const { getShoppingCampaignNames } = useGetCampaigns();
//   const { getMerchantsData, getProductsData } = useShoppingCampaign();

//   const { data: campaignNames, isLoading: campaignNamesLoading } = useQuery({
//     queryKey: ["getShoppingCampaignNames"],
//     queryFn: () => getShoppingCampaignNames(),
//     enabled: Boolean(
//       session?.user?._id && component === MenuComponent.SEARCH_TERM_VIEW
//     ),
//     staleTime: 30 * 60 * 1000,
//   });

//   const getSearchTermViews = async (
//     segment: string,
//     campaignId: string | number,
//     pageToken?: string
//   ) => {
//     //setIsLoading(true);
//     try {
//       const response = await fetch(
//         `/api/reports/search-term-view-metrics?id=${session?.user?._id}&segment=${segment}&campaignId=${campaignId}&pageToken=${pageToken}`,
//         { method: "GET" }
//       );

//       if (!response.ok) {
//         throw new Error(
//           "Error retreiving search term data. check reports hooks."
//         );
//       }

//       const data = await response.json();

//       const flattenData: TSearchTerms[] = data.searchTermViewMetrics.map(
//         (searchTerm: TSearchTerms) => {
//           return {
//             adGroupName: searchTerm.ad_group.name,
//             adGroupId: searchTerm.ad_group.id,
//             campaignId: searchTerm.campaign.id,
//             ...searchTerm.segments,
//             ...searchTerm.campaign,
//             ...searchTerm.metrics,
//             ...searchTerm.search_term_view,
//           };
//         }
//       );
//       //setSearchTermData(flattenData);
//       //setIsLoading(false);
//       return flattenData;
//     } catch (err) {
//       //setIsLoading(false);
//       console.log("There was an error in getSearchTermView.tsx API call", err);
//     }
//   };

//   const { data: searchTermData, isLoading: searchTermsIsLoading } = useQuery({
//     queryKey: ["searchTermView", campaignId?.split(":")[1], segment],
//     queryFn: () => getSearchTermViews(segment, campaignId?.split(":")[1]),
//     enabled: Boolean(
//       session?.user?._id && segment && campaignId?.split(":")[1]
//     ),
//     staleTime: Infinity,
//   });

//   const { data: negativeKeywordsData, isLoading: negativeKeywordsLoading } =
//     useQuery({
//       queryKey: ["negativeKeywords", campaignId?.split(":")[1]],
//       queryFn: () => getNegativeKeywords(campaignId?.split(":")[1]),
//       enabled: Boolean(
//         fetchNegativeKeywords && campaignId?.split(":")[1] && session?.user?._id
//       ),
//       staleTime: Infinity,
//     });

//   //get all available brands from Google Merchant Center
//   const { data: brands, isLoading: brandsIsLoading } = useQuery({
//     queryKey: ["merchantsBrandsData"],
//     queryFn: () => getMerchantsData(),
//     enabled: Boolean(
//       session?.user?._id && component === MenuComponent.CREATE_CAMPAIGN
//     ),
//   });

//   //keywords, preview, productCount
//   //only run if we select a brand
//   const { data: productData, isLoading: productDataIsLoading } = useQuery({
//     queryKey: ["merchantsData", selectedBrand],
//     queryFn: () => getProductsData(selectedBrand as string),
//     enabled: Boolean(selectedBrand && session?.user?._id),
//   });

//   const handleSegmentChange = (event: SelectChangeEvent<string>) => {
//     setSegment(event.target.value);
//   };

//   let content;
//   switch (component) {
//     case MenuComponent.AUTHENTICATE:
//       content = <GoogleAuthButton />;
//       break;
//     case MenuComponent.CAMPAIGN:
//       content = sessionIsValid ? <CampaignView /> : <GoogleAuthButton />;
//       break;
//     case MenuComponent.CREATE_CAMPAIGN:
//       content = sessionIsValid ? (
//         <CreateShoppingCampaign
//           brands={brands && brands}
//           productData={productData}
//           brandsIsLoading={brandsIsLoading}
//           productDataIsLoading={productDataIsLoading}
//           onSelectedBrand={setSelectedBrand}
//           selectedBrand={selectedBrand}
//         />
//       ) : (
//         <GoogleAuthButton />
//       );
//       break;
//     case MenuComponent.SEARCH_TERM_VIEW:
//       content = sessionIsValid ? (
//         <SearchTermView
//           segment={segment}
//           onSegmentChange={handleSegmentChange}
//           campaignId={campaignId}
//           fetchNegativeKeywords={fetchNegativeKeywords}
//           onSetCampaignId={setCampaignId}
//           onFetchNegativeKeywords={setFetchNegativeKeywords}
//           campaignNames={campaignNames}
//           campaignNamesLoading={campaignNamesLoading}
//           searchTermsIsLoading={searchTermsIsLoading}
//           searchTermData={searchTermData}
//           negativeKeywordsData={negativeKeywordsData}
//           negativeKeywordsLoading={negativeKeywordsLoading}
//         />
//       ) : (
//         <GoogleAuthButton />
//       );
//       break;
//     case MenuComponent.CREATE_CONVERSION:
//       content = sessionIsValid ? (
//         <CreateWebsiteConversion />
//       ) : (
//         <GoogleAuthButton />
//       );
//       break;
//     case MenuComponent.USER_SETTINGS:
//       content = sessionIsValid ? <UserSettings /> : <GoogleAuthButton />;
//       break;
//     case MenuComponent.CONTACT:
//       content = <ContactForm />;
//       break;
//     default:
//       content = <GoogleAuthButton />;
//   }

//   return <Suspense fallback={<LinearProgress />}>{content}</Suspense>;
// };
