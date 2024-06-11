type TimeOverlapProps = { startTime: string; endTime: string };
type ScheduleProps = Record<
  string,
  {
    startTime: string;
    endTime: string;
    ids?: number[] | undefined;
    day?: number | number[] | undefined;
  }
>;

//check selected time with the next
const timesDoOverlap = (
  timeOne: TimeOverlapProps,
  timeTwo: TimeOverlapProps
) => {
  const startOne = parseInt(timeOne.startTime.replace(":", ""), 10);
  const endOne = parseInt(timeOne.endTime.replace(":", ""), 10);
  const startTwo = parseInt(timeTwo.startTime.replace(":", ""), 10);
  const endTwo = parseInt(timeTwo.endTime.replace(":", ""), 10);

  return startOne < endTwo && startTwo < endOne;
};

export const checkForConflicts = (schedule: ScheduleProps) => {
  const times = Object.values(schedule);
  let conflict = false;
  const specialDays = {
    9: [2, 3, 4, 5, 6],
    10: [7, 8],
    11: [2, 3, 4, 5, 6, 7, 8],
  };

  //TODO: need to also check if special day conflicts with another special day

  outerLoop: for (let i = 0; i < times.length; i++) {
    for (let j = i + 1; j < times.length; j++) {
      //check if day is special day or not
      const dayI = specialDays[times[i].day as keyof typeof specialDays] ?? [
        times[i].day,
      ];
      const dayJ = specialDays[times[j].day as keyof typeof specialDays] ?? [
        times[j].day,
      ];

      //check for similar day segments
      const dayOverlap = dayI?.some((day) => dayJ.includes(day));
      //check if times overlap;
      const timesHasOverlap = timesDoOverlap(times[i], times[j]);

      //if same day and time overlap, we have a conflict
      if (dayOverlap && timesHasOverlap) {
        conflict = true;
        break outerLoop;
      }
    }
  }
  return conflict;
};
