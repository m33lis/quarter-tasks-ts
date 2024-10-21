interface MonthsRowProps {
  yearMonthMap?: Record<string, number>;
  monthsVisible: string[];
  gridCols: string;
}

export const MonthsRow = ({
  gridCols,
  monthsVisible,
  yearMonthMap,
}: MonthsRowProps) => {
  if (!yearMonthMap) return <></>;

  return (
    <div className={`grid ${gridCols}`}>
      {monthsVisible?.map((month, index) => {
        const weeks = yearMonthMap[month];
        const colSpan = weeks == 5 ? "col-span-5" : "col-span-4";

        return (
          <div
            className={`${colSpan} w-full flex justify-center bg-blue-300 border border-solid border-white`}
            key={`${month}-${index}`}
          >
            {month}
          </div>
        );
      })}
    </div>
  );
};
