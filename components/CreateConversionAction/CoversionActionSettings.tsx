import React, { useEffect, useState } from "react";

import { useInvalidateQuery } from "@/hooks/invalidateQueries";
import { useForm } from "@/hooks/useForm";
import { TConversionTable, WebsiteConversion } from "@/types";
import { createConversionObject } from "@/util/helpers/createConversion";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { styledScroll } from "../GoogleAuthButton/AuthStyles";
import {
  ConversionActionMap,
  ConversionAttributionModel,
  ConversionCountType,
  conversionTypeMapping,
} from "./conversionAction.enums";
import {
  createConversionFields,
  handleFormFields,
} from "./conversionCreationFields";
import ConversionFormFields from "./ConversionFormFields";

interface ConversionSettings {
  data: TConversionTable;
  onWebConversionUpdate: (
    conversion: WebsiteConversion,
    id: number
  ) => Promise<void>;
}

export const ConversionActionsSettings = ({
  data,
  onWebConversionUpdate,
}: ConversionSettings) => {
  const { invalidateQuery } = useInvalidateQuery();
  const [editConversion, setEditConversion] = useState<boolean>(false);
  const [formState, inputHandler, setFormData] = useForm(
    createConversionFields,
    false
  );

  useEffect(() => {
    // console.log("I CHECKED DATA");
    if (data) {
      // console.log("I converted inputs!!");
      const conversionData = handleFormFields(data);
      setFormData(conversionData, true);
    }
  }, [data, editConversion]);

  const valueSettings = data?.value_settings?.always_use_default_value
    ? `Default value, $${data?.value_settings?.default_value}`
    : `Use different values, or 0`;

  const conversionArr: Array<{ [key: string]: any | {} }> = [
    { value: data?.name, text: "Conversion Name" },
    {
      value:
        ConversionActionMap[data?.category as keyof typeof ConversionActionMap],
      text: "Category: ",
    },
    {
      value:
        conversionTypeMapping[data?.type as keyof typeof conversionTypeMapping],
      text: "Type",
    },
    {
      value: valueSettings,
      text: "Value",
    },
    {
      value: `${data?.view_through_lookback_window_days || 0} days`,
      text: "View-through conversion window",
    },
    {
      value: `${data?.click_through_lookback_window_days || 0} days`,
      text: "Click-through conversion window",
    },
    {
      value:
        ConversionCountType[
          data?.counting_type as keyof typeof ConversionCountType
        ],
      text: "Conversion Count",
    },
    {
      value:
        ConversionAttributionModel[
          data?.attribution_model_settings
            ?.attribution_model as keyof typeof ConversionAttributionModel
        ],
      text: "Attribution Model",
    },
    {
      value: data?.phone_call_duration_seconds || "",
      text: data?.phone_call_duration_seconds ? "Call Length" : "",
    },
  ];

  const handleEditToggle = () => {
    setEditConversion((prev) => !prev);
  };

  const updateWebConversionHandler = async () => {
    const newConversionData: WebsiteConversion =
      createConversionObject(formState);
    await onWebConversionUpdate(newConversionData, data?.id).then(() => {
      invalidateQuery("conversionData");
    });
  };

  return (
    <Paper elevation={0} sx={{ padding: "2rem", ...styledScroll }}>
      <Grid container direction="row" alignItems="start" spacing={2}>
        {!editConversion &&
          conversionArr?.map((conversion, index) => (
            <React.Fragment key={index}>
              <Grid item xs={12} md={5}>
                <Typography variant="subtitle2" color="text.secondary">
                  {conversion?.text && conversion?.text}
                </Typography>
              </Grid>

              <Grid item xs={12} md={5}>
                <Typography variant="subtitle2" color="text.secondary">
                  {conversion?.value && conversion?.value}
                </Typography>
              </Grid>
            </React.Fragment>
          ))}
        {editConversion && (
          <ConversionFormFields
            formState={formState}
            inputHandler={inputHandler}
          />
        )}
      </Grid>
      <Divider sx={{ margin: "0.5rem 0" }} />
      <Stack direction="row" justifyContent="flex-end" spacing={2}>
        {editConversion && (
          <Button
            color="error"
            size="small"
            onClick={() => {
              handleEditToggle();
            }}
          >
            Cancel
          </Button>
        )}
        <Button
          disabled={!formState.isValid}
          size="small"
          onClick={async () => {
            if (editConversion) {
              //send request
              await updateWebConversionHandler();
              handleEditToggle();
            } else {
              handleEditToggle();
            }
          }}
        >
          {editConversion ? "Save" : "Edit"}
        </Button>
      </Stack>
    </Paper>
  );
};
