import { useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import PromotionsTable from "@/components/ShoppingPromotions/PromotionsTable";
import PromotionSteps from "@/components/ShoppingPromotions/PromotionSteps";
import { useShoppingPromotion } from "@/hooks/promotions-hook";
import { useCheckDevice } from "@/hooks/use-device-hook";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { useQuery } from "@tanstack/react-query";

const ManagePromotions = () => {
  const router = useRouter();
  const { query } = router;
  const { data: session } = useSession();
  const { isMobile } = useCheckDevice();
  const [toggleView, setToggleView] = useState<boolean>(false);
  const { getCurrentPromotions } = useShoppingPromotion();

  useEffect(() => {
    if (query.action === "create") {
      setToggleView(true);
    }
  }, [query.action]);

  const { data: promotionData, isLoading: getPromoIsLoading } = useQuery({
    queryKey: ["merchant_promotions", session?.user?._id],
    queryFn: () => getCurrentPromotions(session?.user?._id as string),
    enabled: Boolean(session?.user?._id && session?.user?.googleAccountId),
  });

  const handlePromoToggle = () => {
    setToggleView((prev) => !prev);
  };

  return (
    <Stack
      sx={{ marginTop: isMobile ? "0.5rem" : "3rem", width: "100%" }}
      spacing={2}
    >
      <Stack alignItems="start">
        <Chip
          icon={toggleView ? <ArrowBackIcon /> : <AddIcon />}
          onClick={handlePromoToggle}
          label={toggleView ? "Go Back" : "Create Promotion"}
          variant="outlined"
          clickable
          component="button"
        />
      </Stack>

      <Stack width="100%">
        {toggleView ? (
          <PromotionSteps cancelSteps={handlePromoToggle} />
        ) : (
          <PromotionsTable
            promo={promotionData}
            isLoading={getPromoIsLoading}
          />
        )}
      </Stack>
    </Stack>
  );
};

export default ManagePromotions;
