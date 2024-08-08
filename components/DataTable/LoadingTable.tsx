import React from "react";

import Skeleton from "@mui/material/Skeleton";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

interface IsHomePage {
  isHome?: boolean;
  length?: number;
  isDashboard?: boolean;
  numCells?: number;
}
const loadSkeletons = (length: number = 1) => {
  let totalSkeletons = [];
  for (let i = 0; i < length; i++) {
    totalSkeletons.push(
      <TableCell key={i}>
        <Skeleton width="100%" />
      </TableCell>
    );
  }
  return totalSkeletons;
};

export const LoadingTable = ({ length, numCells }: IsHomePage) => {
  const defaultNumCells = numCells ? numCells : 6;
  return (
    <>
      {Array.from({ length: length ? length : 8 }).map((_, i) => (
        <TableRow key={i}>{loadSkeletons(defaultNumCells)}</TableRow>
      ))}
    </>
  );
};

// export const LoadingTable = ({ isHome, length, isDashboard }: IsHomePage) => {
//   return (
//     <>
//       {Array.from({ length: length ? length : 8 }).map((_, i) => (
//         <TableRow key={i}>
//           <TableCell>
//             <Skeleton width="100%" />
//           </TableCell>
//           <TableCell>
//             <Skeleton width="100%" />
//           </TableCell>
//           <TableCell>
//             <Skeleton width="100%" />
//           </TableCell>
//           <TableCell>
//             <Skeleton width="100%" />
//           </TableCell>
//           <TableCell>
//             <Skeleton />
//           </TableCell>

//           {isDashboard && (
//             <>
//               <TableCell>
//                 <Skeleton width="100%" />
//               </TableCell>
//               <TableCell>
//                 <Skeleton />
//               </TableCell>
//               <TableCell>
//                 <Skeleton />
//               </TableCell>
//             </>
//           )}

//           {!isHome && (
//             <>
//               <TableCell>
//                 <Skeleton width="100%" />
//               </TableCell>
//               <TableCell>
//                 <Skeleton width="100%" />
//               </TableCell>
//               <TableCell>
//                 <Skeleton width="100%" />
//               </TableCell>
//               <TableCell>
//                 <Skeleton width="100%" />
//               </TableCell>
//             </>
//           )}
//         </TableRow>
//       ))}
//     </>
//   );
// };

// export const PartitionLoadingTable = ({
//   isHome,
//   length,
//   isDashboard,
// }: IsHomePage) => {
//   return (
//     <>
//       {Array.from({ length: length ? length : 8 }).map((_, i) => (
//         <TableRow key={i}>
//           <TableCell>
//             <Skeleton width="100%" />
//           </TableCell>
//           <TableCell>
//             <Skeleton width="100%" />
//           </TableCell>
//           <TableCell>
//             <Skeleton width="100%" />
//           </TableCell>
//           <TableCell>
//             <Skeleton width="100%" />
//           </TableCell>
//           <TableCell>
//             <Skeleton />
//           </TableCell>

//           {isDashboard && (
//             <>
//               <TableCell>
//                 <Skeleton width="100%" />
//               </TableCell>
//               <TableCell>
//                 <Skeleton />
//               </TableCell>
//               <TableCell>
//                 <Skeleton />
//               </TableCell>
//             </>
//           )}

//           {!isHome && (
//             <>
//               <TableCell>
//                 <Skeleton width="100%" />
//               </TableCell>
//               <TableCell>
//                 <Skeleton width="100%" />
//               </TableCell>
//               <TableCell>
//                 <Skeleton width="100%" />
//               </TableCell>
//               <TableCell>
//                 <Skeleton width="100%" />
//               </TableCell>
//             </>
//           )}
//         </TableRow>
//       ))}
//     </>
//   );
// };
