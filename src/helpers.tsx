import dayjs from "dayjs";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import duration from "dayjs/plugin/duration";
import isLeapYear from "dayjs/plugin/isLeapYear";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekday from "dayjs/plugin/weekday";
import { Task } from "./App";
import * as HoverCard from "@radix-ui/react-hover-card";

dayjs.extend(quarterOfYear);
dayjs.extend(duration);
dayjs.extend(weekOfYear);
dayjs.extend(weekday);
dayjs.extend(isLeapYear);

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const monthsOfQuarter = (quarter: number | null) => {
  if (!quarter) return [];

  let months: number[] = [];
  switch (quarter) {
    case 1:
      months = [0, 1, 2];
      break;
    case 2:
      months = [3, 4, 5];
      break;
    case 3:
      months = [6, 7, 8];
      break;
    case 4:
      months = [9, 10, 11];
      break;
  }
  return months.map((v) => dayjs().month(v).format("MMMM"));
};

function getWeeksInMonths(year: number): Record<string, number> {
  // Array of month names for easy access to month names

  // Initialize the result object with each month set to 0 weeks
  const weeksInMonths: Record<string, number> = monthNames.reduce(
    (acc, month) => {
      acc[month] = 0;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Start with January 1st of the given year
  const currentDate = new Date(year, 0, 1); // January 1st of the year

  // Iterate through all days of the year
  while (currentDate.getFullYear() === year) {
    // Check if the current day is a Monday (1 = Monday)
    if (currentDate.getDay() === 1) {
      // Find the Thursday of the current week
      const thursdayDate = new Date(currentDate);
      thursdayDate.setDate(thursdayDate.getDate() + 3); // 3 days after Monday is Thursday

      // Determine which month the Thursday falls into
      const thursdayMonth = thursdayDate.getMonth();

      // Increment the week count for the month of the Thursday if it's valid
      if (thursdayMonth === 0) {
        // If it's January (0 = January)
        // Check if it's the same year's date or next year's date
        if (thursdayDate.getFullYear() === year) weeksInMonths[monthNames[0]]++; // Count week for January
      } else {
        weeksInMonths[monthNames[thursdayMonth]]++; // Count week for the month of the Thursday
      }
    }

    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return weeksInMonths;
}

const createCalendarCells = (
  task: Task,
  year: number | null,
  monthsVisible: string[],
) => {
  const cells = [];
  const currentWeek = dayjs(`${year}-${monthsVisible[0]}`).week();
  const currentYear = dayjs(`${year}-${monthsVisible[0]}`).year();

  const taskStartWeek = dayjs(task.startDate).week();
  const taskStartYear = dayjs(task.startDate).year();
  const taskEndWeek =
    dayjs(task.endDate).week() === 1 && dayjs(task.endDate).month() === 11
      ? 53
      : dayjs(task.endDate).week();
  const taskEndYear = dayjs(task.endDate).year();

  let weeksInQuarter = 13;
  if (year) {
    let sum = 0;
    const weeksInMonths = getWeeksInMonths(year);
    monthsVisible.forEach((month) => (sum += weeksInMonths[month]));
    weeksInQuarter = sum;
  }

  for (let i = currentWeek; i < currentWeek + weeksInQuarter; i++) {
    const color =
      i >= taskStartWeek &&
      taskStartYear === currentYear &&
      i <= taskEndWeek &&
      taskEndYear === currentYear
        ? "bg-blue-300"
        : "bg-blue-100";

    cells.push(
      color === "bg-blue-300" ? (
        <HoverCard.Root key={`${task.name}-${i}-hoverCardRoot`}>
          <HoverCard.Trigger asChild>
            <div
              className={`flex justify-center ${color} border border-solid border-white`}
              key={`${task.name}-${i}`}
            >
              &nbsp;
            </div>
          </HoverCard.Trigger>
          <HoverCard.Content>
            <div
              className="bg-white rounded p-2"
              key={`${task.name}-${i}-hovercard`}
            >
              <div>{task.name}</div>
              <div>
                Start date: {dayjs(task.startDate).format("MM-DD-YYYY")}
              </div>
              <div>End date: {dayjs(task.endDate).format("MM-DD-YYYY")}</div>
            </div>
          </HoverCard.Content>
        </HoverCard.Root>
      ) : (
        <div
          className={`flex justify-center ${color} border border-solid border-white`}
          key={`${task.name}-${i}`}
        >
          &nbsp;
        </div>
      ),
    );
  }

  return cells;
};

const createWeekNumbers = (
  monthsVisible: string[],
  year: number,
  weeksInQuarter: number,
) => {
  const numbers = [];

  const firstMonthOfQuarter = monthsVisible[0];
  const indexOfFirstMonthVisible = monthNames.indexOf(firstMonthOfQuarter);

  const weeksInMonths = getWeeksInMonths(year);
  let weeksBeforeFirstMonthVisible = 0;
  for (let i = 0; i < indexOfFirstMonthVisible; i++) {
    weeksBeforeFirstMonthVisible += weeksInMonths[monthNames[i]];
  }

  for (
    let i = weeksBeforeFirstMonthVisible;
    i < weeksBeforeFirstMonthVisible + weeksInQuarter;
    i++
  ) {
    numbers.push(
      <div className="flex justify-center" key={`week-${i}`}>
        {i + 1}
      </div>,
    );
  }
  return numbers;
};

const resolveGridCols = (weeks: number) => {
  switch (weeks) {
    case 12:
      return "grid-cols-[repeat(12,_1fr)]";
    case 13:
      return "grid-cols-[repeat(13,_1fr)]";
    case 14:
      return "grid-cols-[repeat(14,_1fr)]";
    default:
      return "grid-cols-[repeat(13,_1fr)]";
  }
};

export {
  monthsOfQuarter,
  getWeeksInMonths,
  createCalendarCells,
  monthNames,
  createWeekNumbers,
  resolveGridCols,
};
