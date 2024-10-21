import dayjs, { Dayjs } from "dayjs";
import { monthsOfQuarter } from "../helpers";

interface QuarterSelectionProps {
  currentDay: Dayjs | null;
  setCurrentDay: (day: Dayjs | null) => void;
  setQuarter: (quarter: number | null) => void;
  setYear: (year: number | null) => void;
  setMonthsVisible: (months: string[]) => void;
  quarter: number | null;
  year: number | null;
  gridCols: string;
}

export const QuarterSelection = ({
  currentDay,
  setCurrentDay,
  setQuarter,
  setYear,
  setMonthsVisible,
  quarter,
  year,
  gridCols,
}: QuarterSelectionProps) => {
  return (
    <div className={`grid ${gridCols}`}>
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
  );
};
