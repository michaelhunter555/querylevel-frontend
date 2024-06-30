import React, { useState } from "react";

import { useSession } from "next-auth/react";

import { useAccountSettings } from "@/hooks/useAccountSettings";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import FormHelperText from "@mui/material/FormHelperText";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { PlanTypes } from "./enums.plans";

const PayAsYouGoOption = () => {
  const { data: session } = useSession();
  const { singleQuotaPurchase } = useAccountSettings();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [quota, setQuota] = useState<{ [key: string]: number }>({
    quantity: 1,
    totalPrice: 5,
  });

  const handleQuantity = (amountOption: string) => {
    setQuota((prev) => {
      const newAmount =
        amountOption === "increment"
          ? (prev.quantity += 1)
          : Math.max(1, prev.quantity - 1);

      return {
        quantity: newAmount,
        totalPrice: newAmount * 5,
      };
    });
  };

  const handleQuotaCheckout = async () => {
    setIsLoading(true);
    const checkoutUrl = await singleQuotaPurchase(quota.quantity);
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
    setIsLoading(false);
  };

  return (
    <Paper sx={{ padding: "2rem", marginTop: "3rem" }}>
      <Stack direction="column" justifyContent="center" spacing={2}>
        <Typography variant="h4" fontWeight={700} color="text.secondary">
          Pay As You Go?
        </Typography>
        <Typography color="text.secondary">
          Get Quota when you need it, on demand. Plan types of{" "}
          <code>canceled</code> and <code>free</code> will update to{" "}
          <code>payAsYouGo</code>. Users with an existing subscription can use
          this option to granularly increase quota when needed.
        </Typography>
        <Typography variant="h4">${quota.totalPrice.toFixed(2)}</Typography>
        <Chip label={`${quota.quantity} tiered campaigns`} variant="outlined" />
        <Divider />
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={1}
        >
          <Button
            size="small"
            variant="outlined"
            onClick={() => handleQuantity("decrement")}
            sx={{ fontSize: "20px" }}
          >
            -
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => handleQuantity("increment")}
            sx={{ fontSize: "20px" }}
          >
            +
          </Button>
        </Stack>

        <Stack>
          <Button variant="contained" onClick={handleQuotaCheckout}>
            {isLoading ? "Loading..." : "Buy Quota"}
          </Button>
          {session?.user?.planType === PlanTypes.FREE && (
            <FormHelperText>
              Get 50% off when you buy 4 (*New & unsubscribed users only)
            </FormHelperText>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
};

export default PayAsYouGoOption;
