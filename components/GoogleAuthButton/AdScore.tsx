import { useCheckDevice } from "@/hooks/use-device-hook";
import Box from "@mui/material/Box";
import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

export default function AdScore(
  props: CircularProgressProps & { value: number }
) {
  const { isMobile } = useCheckDevice();
  return (
    <>
      <svg width={0} height={0}>
        <defs>
          <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e01cd5" />
            <stop offset="100%" stopColor="#1CB5E0" />
          </linearGradient>
        </defs>
      </svg>
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress
          size={isMobile ? 40 : 80}
          variant="determinate"
          {...props}
          sx={{ "svg circle": { stroke: "url(#my_gradient)" } }}
        />

        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="caption"
            component="div"
            sx={{ color: "text.secondary" }}
          >
            {!props.value ? "-" : `${Math.round(props.value)}%`}
          </Typography>
        </Box>
      </Box>
    </>
  );
}
