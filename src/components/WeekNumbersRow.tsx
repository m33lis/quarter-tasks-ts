import { createWeekNumbers } from "../helpers.tsx";

interface WeekNumbersRowProps {
  year: number | null;
  monthsVisible: string[];
  weeksInQuarter: number;
  gridCols: string;
}

export const WeekNumbersRow = ({
  year,
  monthsVisible,
  weeksInQuarter,
  gridCols,
}: WeekNumbersRowProps) => {
  if (!year) return <></>;

  return (
    <div className={`grid ${gridCols} bg-blue-100`}>
      {createWeekNumbers(monthsVisible, year, weeksInQuarter)}
    </div>
  );
};
