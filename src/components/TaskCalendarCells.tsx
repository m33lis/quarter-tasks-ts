import { Task } from "../App";
import { createCalendarCells } from "../helpers";

interface TaskCalendarCellsProps {
  tasks: Task[];
  year: number | null;
  monthsVisible: string[];
  gridCols: string;
}

export const TaskCalendarCells = ({
  tasks,
  year,
  monthsVisible,
  gridCols,
}: TaskCalendarCellsProps) => {
  return tasks.map((task, index) => (
    <div className={`grid ${gridCols}`} key={`${task.name}-row-${index}`}>
      {createCalendarCells(task, year, monthsVisible)}
    </div>
  ));
};
