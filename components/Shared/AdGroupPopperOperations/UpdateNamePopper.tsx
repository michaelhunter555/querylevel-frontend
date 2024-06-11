// import React from "react";

// import { AdGroupOperationsPopper } from "./AdGroupPopper";

// interface UpdateNamePopper {
//   currentAdGroupName: string;
//   adGroupId: string | number;
//   updateNameAnchorId: string;
//   updateNameAnchorEl: { [key: string]: HTMLElement | null };
//   updateNameAnchorHandler: (
//     event: React.MouseEvent<HTMLElement>,
//     id: number
//   ) => void;
//   updateNameHandler?: (name: string, id: number | string) => Promise<void>;
//   updateNameIsLoading: boolean;
// }

// export const UpdateNamePopper = ({
//   updateNameAnchorId,
//   updateNameAnchorEl,
//   updateNameAnchorHandler,
//   updateNameHandler,
//   updateNameIsLoading,
//   currentAdGroupName,
//   adGroupId,
// }: UpdateNamePopper) => {
//   return (
//     <AdGroupOperationsPopper
//       id={updateNameAnchorId as string}
//       open={!!updateNameAnchorEl}
//       onCancel={(event: React.MouseEvent<HTMLElement>) =>
//         updateNameAnchorHandler(event, adGroupId as number)
//       }
//       anchorEl={updateNameAnchorEl[adGroupId]}
//       placement={"bottom-start"}
//       operationType={0}

//       updateNameIsLoading={updateNameIsLoading}
//     />
//   );
// };
