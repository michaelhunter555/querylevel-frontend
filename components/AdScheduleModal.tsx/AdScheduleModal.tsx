import React, { useEffect, useMemo, useState } from "react";

import { AdSchedule, useAdScheduleApi } from "@/hooks/campaign-hooks";
import { useInvalidateQuery } from "@/hooks/invalidateQueries";
import AddIcon from "@mui/icons-material/Add";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Modal from "@mui/material/Modal";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Content, PageContainer } from "../Footer/FooterStyles";
import { styledScroll } from "../GoogleAuthButton/AuthStyles";
import { StyledBoxContainer } from "../Modal/ModalStyles";
import { ScheduleEntries } from "./ScheduleEntries";
import { SingleDayOfWeek } from "./singleSelectDayNames";
import { checkForConflicts } from "./timeConflictChecker";

interface AdScheduleResponse {
  //modal
  open: boolean;
  onClose: () => void;
  //schedule
  scheduleIsLoading: boolean;
  campaignAdSchedule: AdSchedule[];
  name: string;
  campaignId: string | number;
}

// Dummy conversion function - replace with actual logic
const convertMinutesToEnum = (minutes: string) => {
  switch (minutes) {
    case "00":
      return "ZERO";
    case "15":
      return "FIFTEEN";
    case "30":
      return "THIRTY";
    case "45":
      return "FORTY_FIVE";
    default:
      return "ZERO"; // Default case or handle error
  }
};

export const minuteMapping: Record<number, string> = {
  2: "00",
  3: "15",
  4: "30",
  5: "45",
};

export const AdScheduleModal = ({
  campaignAdSchedule,
  campaignId,
  open,
  onClose,
  scheduleIsLoading,
  name,
}: AdScheduleResponse) => {
  const { updateAdSchedule, isUpdatingSchedule } = useAdScheduleApi();
  const { invalidateQuery } = useInvalidateQuery();
  const [timeConflictCheck, setTimeConflictCheck] = useState<boolean>(false);
  const [timeSchedules, setTimeSchedules] = useState<
    Record<
      string,
      {
        startTime: string;
        endTime: string;
        ids?: number[];
        day?: number | number[];
      }
    >
  >({});
  const [existingTimeSchedules, setExistingTimeSchedules] = useState<
    Record<
      string,
      {
        startTime: string;
        endTime: string;
        ids?: number[];
        day?: number | number[];
      }
    >
  >({});

  const adScheduleMap = useMemo(() => {
    const scheduleMap: {
      [key: string]: {
        days: SingleDayOfWeek[];
        details: any[];
        id: number[];
      };
    } = {};

    campaignAdSchedule?.forEach(({ ad_schedule, resource_name }) => {
      if (ad_schedule && resource_name) {
        const { day_of_week, start_hour, end_hour, start_minute, end_minute } =
          ad_schedule;
        const timeKey = `${start_hour}:${start_minute}-${end_hour}:${end_minute}`;
        const id = Number(resource_name?.split("~").pop());

        if (!scheduleMap[timeKey]) {
          scheduleMap[timeKey] = { days: [], details: [], id: [] };
        }
        scheduleMap[timeKey].days.push(day_of_week);
        scheduleMap[timeKey].details.push({
          id,
          ...ad_schedule,
        });
        scheduleMap[timeKey].id.push(id);
      }
    });

    // Transform the grouped data to identify special day ranges
    const transformedScheduleMap = Object.entries(scheduleMap)?.map(
      ([timeKey, { days, details, id }]) => {
        // Sort days to help with identifying continuous ranges
        days.sort((a, b) => a - b);

        const isMonToFri =
          days.length === 5 &&
          days[0] === SingleDayOfWeek.MONDAY &&
          days[4] === SingleDayOfWeek.FRIDAY;
        const isSatToSun =
          days.length === 2 &&
          days[0] === SingleDayOfWeek.SATURDAY &&
          days[1] === SingleDayOfWeek.SUNDAY;

        const isMondayToSunday =
          days.length === 7 &&
          days[0] === SingleDayOfWeek.MONDAY &&
          days[days.length - 1] === SingleDayOfWeek.SUNDAY;

        return {
          timeKey,
          id,
          dayRange: isMondayToSunday
            ? SingleDayOfWeek.MONDAY_SUNDAY
            : isMonToFri
            ? SingleDayOfWeek.MONDAY_FRIDAY
            : isSatToSun
            ? SingleDayOfWeek.SATURDAY_SUNDAY
            : days,
          details,
        };
      }
    );

    return transformedScheduleMap;
  }, [campaignAdSchedule]);

  useEffect(() => {
    if (adScheduleMap) {
      let initialTimes: Record<
        string,
        {
          startTime: string;
          endTime: string;
          ids: number[];
          day: number | number[];
        }
      > = {};
      adScheduleMap?.forEach(({ timeKey, id, dayRange }) => {
        const { startTime, endTime } = convertTimeSchedule(timeKey);
        initialTimes[timeKey] = { startTime, endTime, ids: id, day: dayRange };
      });
      const cloneExistingSchedule = JSON.parse(JSON.stringify(initialTimes));
      setExistingTimeSchedules(cloneExistingSchedule);
      setTimeSchedules(initialTimes);
    }
  }, [adScheduleMap, onClose]);

  useEffect(() => {
    if (timeSchedules) {
      setTimeConflictCheck(checkForConflicts(timeSchedules));
    }
  }, [timeSchedules]);

  const convertTimeSchedule = (
    timeKey: string
  ): { startTime: string; endTime: string } => {
    const [startTimePart, endTimePart] = timeKey?.split("-");
    const parseTime = (time: string) => {
      const [hour, minuteIndex] = time?.split(":").map(Number);
      const minute =
        minuteMapping[minuteIndex] ?? minuteIndex?.toString()?.padStart(2, "0");
      return `${hour?.toString().padStart(2, "0")}:${minute}`;
    };
    return {
      startTime: parseTime(startTimePart),
      endTime: parseTime(endTimePart),
    };
  };

  const handleDayChange = (timeKey: string, newDay: number) => {
    setTimeSchedules((prev) => {
      const newTimeSchedule = {
        ...prev,
        [timeKey]: {
          ...prev[timeKey],
          day: newDay,
        },
      };
      return newTimeSchedule;
    });
  };

  const handleTimeChange = (
    timeKey: string,
    newTime: string,
    type: "start" | "end"
  ) => {
    setTimeSchedules((prev) => {
      const updatedTimes = { ...prev };

      const scheduleToUpdate = updatedTimes[timeKey];
      if (scheduleToUpdate) {
        if (type === "start") {
          scheduleToUpdate.startTime = newTime;
        } else if (type === "end") {
          scheduleToUpdate.endTime = newTime;
        }
      }

      // No need to manually update ids or day here, as they should remain unchanged
      return updatedTimes;
    });
  };

  const handleRemoveTime = (timeKey: string) => {
    setTimeSchedules((prev) => {
      const { [timeKey]: _, ...remaining } = prev;
      return remaining;
    });
  };

  const handleAddNewScheduleData = () => {
    const newTimeKey = Math.floor(Math.random() * 1e6);
    const newTimeSchedule = {
      startTime: "9:00",
      ids: [],
      endTime: "20:00",
      day: SingleDayOfWeek.MONDAY,
    };
    setTimeSchedules((prev) => ({
      ...prev,
      [newTimeKey]: newTimeSchedule,
    }));
  };

  const noSchedulesToStart = Object.values(existingTimeSchedules).length === 0;
  const noCurrentSchedules = Object.values(timeSchedules).length === 0;

  const loadingSkeleton = (
    <Box sx={{ margin: "2rem auto", width: "90%" }}>
      <Skeleton sx={{ width: "100%" }} />
      <Skeleton sx={{ width: "80%" }} />
      <Skeleton sx={{ width: "80%" }} />
    </Box>
  );

  return (
    <Modal open={open} onClose={onClose}>
      <StyledBoxContainer
        height="auto"
        width="50%"
        sx={{ ...styledScroll, maxHeight: "80vh" }}
      >
        <PageContainer minHeight="auto">
          <Content>
            <Typography variant="h6" color="text.secondary">
              Ad Schedule - {name}{" "}
            </Typography>
            <Typography gutterBottom color="text.secondary">
              create or edit your ad schedule
            </Typography>
            <Alert severity={"info"}>
              Create or Update your schedule. Add a max of 10 segments. Utilize
              grouped days (i.e. mon - fri)
            </Alert>
            <Divider sx={{ margin: 2 }} />

            {!scheduleIsLoading && !isUpdatingSchedule && (
              <Button
                onClick={() => {
                  handleAddNewScheduleData();
                }}
                endIcon={<AddIcon />}
              >
                add new schedule data
              </Button>
            )}
            {!scheduleIsLoading &&
              !isUpdatingSchedule &&
              timeSchedules && //timeKey
              Object.entries(timeSchedules).map(
                ([timeKey, scheduleData], i) => {
                  //const { startTime, endTime } = convertTimeSchedule(timeKey);
                  const { startTime, endTime, ids, day } = scheduleData;
                  return (
                    <ScheduleEntries
                      key={timeKey}
                      timeKey={timeKey}
                      startTime={startTime}
                      endTime={endTime}
                      day={day as number}
                      onDayChange={handleDayChange}
                      onTimeChange={handleTimeChange}
                      onRemove={() => handleRemoveTime(timeKey)}
                    />
                  );
                }
              )}

            {scheduleIsLoading ? (
              <>{loadingSkeleton}</>
            ) : (
              isUpdatingSchedule && <>{loadingSkeleton}</>
            )}
          </Content>
          <Divider sx={{ width: "100%", marginBottom: "1rem" }} />
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Alert
                sx={{ border: 0 }}
                variant="outlined"
                severity={timeConflictCheck ? "error" : "success"}
              >
                {timeConflictCheck
                  ? "Schedule Conflict detected "
                  : "No conflicts detected"}
              </Alert>
            </Box>
            <Stack spacing={2} direction="row" alignItems="center">
              <Button
                onClick={() => {
                  onClose();

                  // setSelectedDays({});
                  // setTimeSchedules({});
                }}
                color="error"
              >
                Close
              </Button>
              <Button
                disabled={
                  timeConflictCheck ||
                  (noSchedulesToStart && noCurrentSchedules)
                }
                variant="outlined"
                onClick={async () => {
                  await updateAdSchedule(
                    existingTimeSchedules,
                    timeSchedules,
                    campaignId
                  ).then(() => {
                    invalidateQuery("adSchedule");
                    onClose();
                  });
                }}
              >
                Save
              </Button>
            </Stack>
          </Stack>
        </PageContainer>
      </StyledBoxContainer>
    </Modal>
  );
};
