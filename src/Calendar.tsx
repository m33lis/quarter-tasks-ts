import { useEffect, useState } from "react";
import { Task } from "./App";
import dayjs, { Dayjs } from "dayjs";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import duration from "dayjs/plugin/duration";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekday from "dayjs/plugin/weekday";

dayjs.extend(quarterOfYear);
dayjs.extend(duration);
dayjs.extend(weekOfYear);
dayjs.extend(weekday);

interface CalendarProps {
  tasks: Task[];
}

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
  return months.map((v) => dayjs().month(v).format("MMM"));
};

const Calendar = ({ tasks }: CalendarProps) => {
  const [currentDay, setCurrentDay] = useState<Dayjs | null>(null);
  const [quarter, setQuarter] = useState<number | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [monthsVisible, setMonthsVisible] = useState<string[]>([]);

  useEffect(() => {
    setCurrentDay(dayjs());
    setQuarter(dayjs().quarter());
    setYear(dayjs().year());
    setMonthsVisible(monthsOfQuarter(dayjs().quarter()));
  }, []);

  const howManyWeeksPerMonth = (month: string): number => {
    const base = dayjs(`${year}-${month}`);

    // Exception
    if (month === "Dec") {
      console.log(month, 54 - base.startOf("month").week());
      return 54 - base.startOf("month").week();
    }

    console.log(
      month,
      base.endOf("month").week() - base.startOf("month").week(),
    );
    return base.endOf("month").week() - base.startOf("month").week();
  };

  const createWeekNumbers = () => {
    const numbers = [];
    const currentWeek = dayjs(`${year}-${monthsVisible[0]}`).week() - 1;

    for (let i = currentWeek; i < currentWeek + 13; i++) {
      numbers.push(
        <div className="flex justify-center" key={`week-${i}`}>
          {i + 1}
        </div>,
      );
    }
    return numbers;
  };

  const createCalendarCells = (task: Task) => {
    const cells = [];
    const currentWeek = dayjs(`${year}-${monthsVisible[0]}`).week() - 1;

    const taskStartWeek = dayjs(task.startDate).week();
    const taskEndWeek =
      dayjs(task.endDate).month() === 11 ? 53 : dayjs(task.endDate).week();

    for (let i = currentWeek; i < currentWeek + 13; i++) {
      const color =
        i + 1 >= taskStartWeek && i + 1 <= taskEndWeek
          ? "bg-blue-300"
          : "bg-blue-100";

      cells.push(
        <div
          className={`flex justify-center ${color} border border-solid border-white`}
          onMouseEnter={(event) => {
            // show hovercard with task data
            if (color === "bg-blue-300") {
              console.log(task, event);
            }
          }}
          key={`${task.name}-${i}`}
        >
          &nbsp;
        </div>,
      );
    }

    return cells;
  };

  return (
    <div className="flex flex-col">
      {/* calender container */}
      {/* header row */}
      <div className="grid grid-cols-[repeat(13,_1fr)]">
        {/* TODO: Make back and forward buttons work */}
        <button
          className="col-start-5 bg-blue-100 font-bold"
          onClick={() => {
            const newDate = dayjs(currentDay).subtract(1, "quarter");
            setCurrentDay(newDate);
            setQuarter(newDate.quarter());
            setYear(newDate.year());
            setMonthsVisible(monthsOfQuarter(newDate.quarter()));
          }}
        >
          &lt;
        </button>
        <div className="col-span-3  font-bold">
          Quarter {quarter}, {year}
        </div>
        <button
          className="col-start-9 bg-blue-100 font-bold"
          onClick={() => {
            const newDate = dayjs(currentDay).add(1, "quarter");
            setCurrentDay(newDate);
            setQuarter(newDate.quarter());
            setYear(newDate.year());
            setMonthsVisible(monthsOfQuarter(newDate.quarter()));
          }}
        >
          &gt;
        </button>
      </div>
      {currentDay && (
        <>
          {/* header month */}
          <div className="grid grid-cols-[repeat(13,_1fr)]">
            {monthsVisible?.map((month) => (
              <div
                className={`col-span-${howManyWeeksPerMonth(month)} w-full flex justify-center bg-blue-300`}
              >
                {month}
              </div>
            ))}
          </div>

          {/* header month */}
          <div className="grid grid-cols-[repeat(13,_1fr)] bg-blue-100">
            {createWeekNumbers()}
          </div>
          {tasks.map((task) => (
            <div
              className="grid grid-cols-[repeat(13,_1fr)]"
              key={`${task.name}-row`}
            >
              {createCalendarCells(task)}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Calendar;
