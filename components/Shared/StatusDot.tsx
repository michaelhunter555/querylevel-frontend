import { styled } from "@mui/material/styles";

interface StatusDot {
  active?: boolean;
  status?: number;
}

export const StatusDot = styled("div")<StatusDot>(
  ({ theme, active, status }) => ({
    border: `6px solid ${
      active || status === 2 ? "#188038" : status === 4 ? "#c53929" : "#9aa0a6"
    }`,
    borderRadius: "50%",
    height: 0,
    width: 0,
  })
);
//active == 2  ? 'green' : active == 3 ? 'gray'
