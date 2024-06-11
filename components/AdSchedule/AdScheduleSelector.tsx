import React, { useEffect, useState } from "react";

import { useAdSchedule } from "@/hooks/useAdSchedule";
import { ScheduleItem } from "@/types";
import { SelectChangeEvent } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";

import {
  DayOfWeek,
  getDayName,
} from "../CreateCampaignSteps/CreateShoppingCampaign/shoppingCampaign.enums";
import { ModeSwitcher } from "./ModeSwitcher";
import { SelectDays } from "./SelectDays";
import { SelectTimes, Time } from "./SelectTimes";
import { SimpleAdSchedule } from "./SimpleAdSchedule";

const days = Object.values(DayOfWeek).filter(Number.isInteger) as DayOfWeek[];

interface SelectAdDateProps {
  onSelectAdDate: (schedule: any) => void;
}

export const AdScheduleSelector: React.FC<SelectAdDateProps> = ({
  onSelectAdDate,
}) => {
  const [selected, setSelected] = useState(0);
  const [selectFromDays, setSelectFromDay] = useState(days[0]);
  const [selectToDay, setSelectToDay] = useState(days[4]);
  const [startTime, setStartTime] = useState<Time>({ hour: 8, minute: "ZERO" });
  const [endTime, setEndTime] = useState<Time>({ hour: 16, minute: "ZERO" });
  const [toggle, setToggle] = useState<boolean>(false);
  const [scheduleApplied, setScheduleApplied] = useState(false);
  const { scheduleState, setDaySchedule } = useAdSchedule();

  useEffect(() => {
    onSelectAdDate(scheduleState);
  }, [scheduleState]);

  const handleSelectFromDay = (event: SelectChangeEvent) => {
    setSelectFromDay(parseInt(event.target.value));
  };

  const handleSelectToDay = (event: SelectChangeEvent) => {
    setSelectToDay(parseInt(event.target.value));
  };

  const handleStartTime = (time: Time | null) => {
    if (time) {
      setStartTime(time);
    }
  };

  const handleEndTime = (time: Time | null) => {
    if (time) {
      setEndTime(time);
    }
  };

  const applySchedule = () => {
    //DayOfWeek Monday starts at int 2 to Sunday ends at int 8
    for (let i = 2; i <= 8; i++) {
      const schedule: ScheduleItem = {
        day_of_week: i,
        start_hour: startTime.hour,
        start_minute: startTime.minute as
          | "ZERO"
          | "FIFTEEN"
          | "THIRTY"
          | "FORTY_FIVE",
        end_hour: endTime.hour,
        end_minute: endTime.minute as
          | "ZERO"
          | "FIFTEEN"
          | "THIRTY"
          | "FORTY_FIVE",
        isValid: true,
      };
      //if i is less than selected start or greater than the selected finish
      //this allows user to update their schedule
      if (i < selectFromDays || i > selectToDay) {
        //set those days to null because they weren't selected
        setDaySchedule(getDayName(i as DayOfWeek), null);
      } else {
        //otherwise add them to our schedule object
        setDaySchedule(getDayName(i as DayOfWeek), schedule);
      }
    }
    setScheduleApplied((prev) => !prev);
  };

  const toggleScheduleHandler = () => setToggle((prev) => !prev);

  return (
    <>
      <ModeSwitcher
        toggleScheduleHandler={toggleScheduleHandler}
        toggle={toggle}
        isDisabled={scheduleApplied}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {!toggle && (
          <SimpleAdSchedule
            selected={selected}
            onSelected={(num) => setSelected(num)}
            onSelectStartTime={(time) => setStartTime(time)}
            onSelectEndTime={(time) => setEndTime(time)}
            isDisabled={scheduleApplied}
          />
        )}

        {toggle && (
          <SelectTimes
            startTime={startTime}
            endTime={endTime}
            handleStartTime={handleStartTime}
            handleEndTime={handleEndTime}
            isDisabled={scheduleApplied}
          />
        )}

        <SelectDays
          selectFromDays={selectFromDays}
          selectToDay={selectToDay}
          handleSelectFromDay={handleSelectFromDay}
          handleSelectToDay={handleSelectToDay}
          isDisabled={scheduleApplied}
        />

        {!scheduleApplied && (
          <Chip
            label="Apply Schedule"
            component={Button}
            variant="outlined"
            onClick={applySchedule}
          />
        )}
        {scheduleApplied && (
          <Chip
            label=" Edit Schedule"
            component={Button}
            color="warning"
            onClick={() => setScheduleApplied(false)}
          />
        )}
      </Box>
    </>
  );
};
