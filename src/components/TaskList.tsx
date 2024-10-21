import { useState } from "react";
import { Task } from "../App";
import { SubmitHandler, useForm } from "react-hook-form";
import dayjs from "dayjs";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface TaskListProps {
  tasks: Task[];
  setTasks: (
      tasks: (
          oldTasks: Task[],
      ) => (Task | { endDate: string; name: string; startDate: string })[],
  ) => void;
}

const schema = z
    .object({
      name: z.string().min(1, "Name is a required field"),
      startDate: z
          .string()
          .min(1, "Start date is a required field")
          .refine((value) => dayjs(value, "YYYY-MM-DD").isValid(), {
            message: "Invalid date, please use YYYY-MM-DD as date format",
          }),
      endDate: z
          .string()
          .min(1, "End date is a required field")
          .refine((value) => dayjs(value, "YYYY-MM-DD").isValid(), {
            message: "Invalid date, please use YYYY-MM-DD as date format",
          }),
    })
    .refine((values) => dayjs(values.endDate).isAfter(dayjs(values.startDate)), {
      message: "End date cannot be before start date",
    });

const TaskList = ({ tasks, setTasks }: TaskListProps) => {
  const [inputOpen, setInputOpen] = useState<boolean>(false);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<Task>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<Task> = ({ name, startDate, endDate }) => {
    setTasks((oldTasks: Task[]) => [...oldTasks, { name, startDate, endDate }]);
    reset();
    setInputOpen(false);
  };

  return (
      <div className="w-[400px]">
        <ul className="mt-12 mr-2">
          <li>
            <div className="grid grid-cols-3 gap-2 bg-blue-300">
              <div className="min-w-14 max-w-32">Task name</div>
              <div className="min-w-14 max-w-32">Start date</div>
              <div className="min-w-14 max-w-32">End date</div>
            </div>
          </li>
          {tasks?.map((task, index) => (
              <li className="grid grid-cols-3 gap-2" key={`${task.name}-${index}`}>
                <div className="min-w-14 max-w-32">{task.name}</div>
                <div className="min-w-14 max-w-32">
                  {dayjs(task.startDate).format("DD-MM-YYYY")}
                </div>
                <div className="min-w-14 max-w-32">
                  {dayjs(task.endDate).format("DD-MM-YYYY")}
                </div>
              </li>
          ))}
          <li>
            {inputOpen && (
                <div className="flex flex-col justify-center">
                  <form
                      className="grid grid-cols-3 gap-2"
                      onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className="min-w-14 max-w-32">
                      <input
                          placeholder="Task name"
                          {...register("name")}
                          className="min-w-14 max-w-20"
                      />
                      <span className="text-xs text-red-700">
                    {errors.name?.message}
                  </span>
                    </div>
                    <div className="min-w-14 max-w-32">
                      <input
                          {...register("startDate")}
                          placeholder="Start date"
                          className="min-w-14 max-w-20"
                      />
                      <div className="text-xs text-red-700">
                        {errors.startDate?.message}
                      </div>
                    </div>
                    <div className="min-w-14 max-w-32">
                      <input
                          {...register("endDate")}
                          placeholder="End date"
                          className="min-w-14 max-w-20"
                      />
                      <div className="text-xs text-red-700">
                        {errors.endDate?.message}
                        {/* @ts-expect-error not sure how to define name for this part of form */}
                        {errors[""]?.message}
                      </div>
                    </div>
                    <div className="col-span-3">
                      <div className="flex flex-row justify-evenly">
                        <input type="submit" />
                        <button
                            onClick={() => {
                              reset();
                              setInputOpen(false);
                            }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
            )}
            {!inputOpen && (
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-3 flex flex-row justify-center">
                    <button onClick={() => setInputOpen(true)}>Add New +</button>
                  </div>
                </div>
            )}
          </li>
        </ul>
      </div>
  );
};
export default TaskList;
