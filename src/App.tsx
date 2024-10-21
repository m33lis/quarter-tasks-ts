import { useState } from "react";
import TaskList from "./components/TaskList";
import Calendar from "./components/Calendar";

export type Task = {
  name: string;
  startDate: string;
  endDate: string;
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  return (
    <div className="flex flex-row">
      <TaskList tasks={tasks} setTasks={setTasks} />
      <Calendar tasks={tasks} />
    </div>
  );
}

export default App;
