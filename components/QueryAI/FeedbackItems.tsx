import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

interface FeedbackItemProps {
  response: string;
  date: string;
  onDelete: () => void;
  onGet: () => void;
}

const createReadableDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};
const FeedbackItems = ({
  response,
  date,
  onDelete,
  onGet,
}: FeedbackItemProps) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = response;
  const textContent = tempDiv.textContent || tempDiv.innerText;

  return (
    <Paper
      onClick={onGet}
      elevation={0}
      sx={{ padding: 1, borderRadius: 3, cursor: "pointer", width: "100%" }}
    >
      <Stack direction="row" justifyContent="space-between" spacing={2}>
        <Stack direction="column">
          <Typography variant="subtitle2" sx={{ fontSize: 10 }}>
            {textContent.substring(0, 20)}...
          </Typography>
          <Typography
            gutterBottom
            variant="subtitle2"
            fontWeight={700}
            sx={{ fontSize: 10 }}
          >
            {createReadableDate(date)?.split(",")[0]}
          </Typography>
        </Stack>
        <Stack direction="row">
          <Tooltip title="view">
            <IconButton disableRipple onClick={onGet}>
              <VisibilityIcon
                sx={{
                  fontSize: 11,
                  "&:hover": {
                    color: (theme) =>
                      theme.palette.mode === "light" ? "black" : "#f1f1f1",
                  },
                }}
              />
            </IconButton>
          </Tooltip>
          <Tooltip title="delete">
            <IconButton disableRipple onClick={onDelete}>
              <CloseIcon color="error" sx={{ fontSize: 11 }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default FeedbackItems;
