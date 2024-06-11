import React, { useMemo } from "react";

import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { LoadingTable } from "../DataTable/LoadingTable";

export type SearchTermData = {
  id: string;
  name: string;
  status: string | number;
  cost_micros: number;
  clicks: number;
  impressions: number;
  all_conversions: number;
  search_term_match_type: number;
  search_term: string;
}[];

const SearchViewDataTable: React.FC<{
  data: SearchTermData;
  isLoading: boolean;
}> = ({ data, isLoading }) => {
  //console.log(data.length);

  const campaignSearchTerms = useMemo(() => {
    return data;
  }, [data]);

  return (
    <TableContainer component={Card} sx={{ marginTop: "2rem" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Checkbox size="small" sx={{ padding: 0 }} />
            </TableCell>
            <TableCell>Name</TableCell>

            <TableCell>Search Term</TableCell>
            <TableCell>MatchType</TableCell>
            <TableCell>impressions</TableCell>
            <TableCell>Clicks</TableCell>
            <TableCell>Cost</TableCell>
            <TableCell>Conversions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!isLoading &&
            campaignSearchTerms?.map((data, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Checkbox size="small" sx={{ padding: 0 }} />
                </TableCell>
                <TableCell>{data?.name}</TableCell>
                <TableCell>{data?.search_term}</TableCell>
                <TableCell>{data?.search_term_match_type}</TableCell>
                <TableCell>{data?.impressions}</TableCell>
                <TableCell>{data?.clicks}</TableCell>
                <TableCell>
                  {(data?.cost_micros / 1000000).toFixed(2)}
                </TableCell>
                <TableCell>{data?.all_conversions}</TableCell>
              </TableRow>
            ))}
          {isLoading && <LoadingTable isHome={false} />}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SearchViewDataTable;
