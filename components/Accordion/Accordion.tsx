import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface AccordionizeProps {
  children: React.ReactNode;
  details: string;
  isExpanded: boolean;
  toggleAccordion: () => void;
  isEditingCampaign?: boolean;
  updateCampaign?: () => void;
  onClose?: () => void;
}

export const Accordionize = ({
  children,
  details,
  isExpanded,
  toggleAccordion,
  isEditingCampaign,
  updateCampaign,
  onClose,
}: AccordionizeProps) => {
  return (
    <Accordion expanded={isExpanded} onChange={toggleAccordion}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1" color="text.secondary">
          {details}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
      {isEditingCampaign && (
        <Stack>
          <Divider />
          <Stack spacing={2} direction="row" alignItems="center">
            <Button
              onClick={() => {
                toggleAccordion();
                onClose?.();
              }}
            >
              Cancel
            </Button>
            <Button onClick={updateCampaign}>Save</Button>
          </Stack>
        </Stack>
      )}
    </Accordion>
  );
};
