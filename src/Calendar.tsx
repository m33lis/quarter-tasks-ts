import { useEffect, useMemo, useState } from "react";
import { Task } from "./App";
import dayjs, { Dayjs } from "dayjs";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import duration from "dayjs/plugin/duration";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekday from "dayjs/plugin/weekday";
import * as HoverCard from "@radix-ui/react-hover-card";
import isLeapYear from 'dayjs/plugin/isLeapYear'

dayjs.extend(quarterOfYear);
dayjs.extend(duration);
dayjs.extend(weekOfYear);
dayjs.extend(weekday);
dayjs.extend(isLeapYear);

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
            return (base.isLeapYear() ? 54 : 53) - base.startOf("month").week();
        }

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
        const currentYear = dayjs(`${year}-${monthsVisible[0]}`).year();

        const taskStartWeek = dayjs(task.startDate).week();
        const taskStartYear = dayjs(task.startDate).year();
        const taskEndWeek =
            dayjs(task.endDate).week() === 1 && dayjs(task.endDate).month() === 11 ? 53 : dayjs(task.endDate).week();
        const taskEndYear = dayjs(task.endDate).year()

        for (let i = currentWeek; i < currentWeek + 13; i++) {
            const color =
                i + 1 >= taskStartWeek && taskStartYear === currentYear && i + 1 <= taskEndWeek && taskEndYear === currentYear
                    ? "bg-blue-300"
                    : "bg-blue-100";

            cells.push(color === "bg-blue-300" ?
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
                        <div className="bg-white rounded p-2" key={`${task.name}-${i}-hovercard`}>
                            <div>{task.name}</div>
                            <div>Start date: {dayjs(task.startDate).format('MM-DD-YYYY')}</div>
                            <div>End date: {dayjs(task.endDate).format('MM-DD-YYYY')}</div>
                        </div>
                    </HoverCard.Content>
                </HoverCard.Root> : <div
                    className={`flex justify-center ${color} border border-solid border-white`}
                    key={`${task.name}-${i}`}
                >
                    &nbsp;
                </div>
            );
        }

        return cells;
    };

    const monthCells = useMemo(() => {
        return monthsVisible?.map((month, index) => {
            const weekAmount = howManyWeeksPerMonth(month) ?? 4;
            let colSpan = 'col-span-4';

            if (weekAmount === 3) {
                colSpan = 'col-span-3';
            } else if (weekAmount === 5) {
                colSpan = 'col-span-5';
            }

            return (<div
                className={`${colSpan} w-full flex justify-center bg-blue-300`}
                key={`${month}-${index}`}
            >
                {month}
            </div>)
        })

    }, [monthsVisible])

    return (
        <div className="flex flex-col">
            <div className="grid grid-cols-[repeat(13,_1fr)]">
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
                    <div className="grid grid-cols-[repeat(13,_1fr)]">
                        {monthCells}
                    </div>

                    <div className="grid grid-cols-[repeat(13,_1fr)] bg-blue-100">
                        {createWeekNumbers()}
                    </div>
                    {tasks.map((task, index) => (
                        <div
                            className="grid grid-cols-[repeat(13,_1fr)]"
                            key={`${task.name}-row-${index}`}
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
