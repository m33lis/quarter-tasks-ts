import { useState } from "react";
import TaskList from "./TaskList.tsx";
import Calendar from "./Calendar.tsx";

export type Task = {
  name: string;
  startDate: string;
  endDate: string;
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  return (
      <div className="flex flex-row w-[100%]">
        <div>
          <TaskList tasks={tasks} setTasks={setTasks} />
        </div>
        <div>
          <Calendar tasks={tasks} />
        </div>
      </div>
  );
}

export default App;
