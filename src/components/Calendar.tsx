import { useEffect, useState } from "react";
import { Task } from "../App";
import dayjs, { Dayjs } from "dayjs";
import { getWeeksInMonths, monthsOfQuarter, resolveGridCols } from "../helpers";
import { QuarterSelection } from "./QuarterSelection";
import { MonthsRow } from "./MonthsRow";
import { WeekNumbersRow } from "./WeekNumbersRow";
import { TaskCalendarCells } from "./TaskCalendarCells";

interface CalendarProps {
  tasks: Task[];
}

const Calendar = ({ tasks }: CalendarProps) => {
  const [currentDay, setCurrentDay] = useState<Dayjs | null>(null);
  const [quarter, setQuarter] = useState<number | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [monthsVisible, setMonthsVisible] = useState<string[]>([]);
  const [yearMonthMap, setYearMonthMap] = useState<Record<string, number>>();
  const [weeksInQuarter, setWeeksInQuarter] = useState<number>(13);

  useEffect(() => {
    setCurrentDay(dayjs());
    setQuarter(dayjs().quarter());
    setYear(dayjs().year());
    setMonthsVisible(monthsOfQuarter(dayjs().quarter()));
  }, []);

  useEffect(() => {
    if (year) {
      setYearMonthMap(getWeeksInMonths(year));
      let sum = 0;
      const weeksInMonths = getWeeksInMonths(year);
      monthsVisible.forEach((month) => (sum += weeksInMonths[month]));
      setWeeksInQuarter(sum);
    }
  }, [year, quarter]);

  return (
    <div className="flex flex-col">
      <QuarterSelection
        currentDay={currentDay}
        setCurrentDay={setCurrentDay}
        setQuarter={setQuarter}
        setYear={setYear}
        setMonthsVisible={setMonthsVisible}
        quarter={quarter}
        year={year}
        gridCols={resolveGridCols(weeksInQuarter)}
      />
      {currentDay && (
        <>
          <MonthsRow
            monthsVisible={monthsVisible}
            yearMonthMap={yearMonthMap}
            gridCols={resolveGridCols(weeksInQuarter)}
          />
          <WeekNumbersRow
            year={year}
            monthsVisible={monthsVisible}
            weeksInQuarter={weeksInQuarter}
            gridCols={resolveGridCols(weeksInQuarter)}
          />
          <TaskCalendarCells
            tasks={tasks}
            year={year}
            monthsVisible={monthsVisible}
            gridCols={resolveGridCols(weeksInQuarter)}
          />
        </>
      )}
    </div>
  );
};

export default Calendar;
