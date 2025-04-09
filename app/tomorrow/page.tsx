import TasksList from "@/components/events/tasks-list";
import Workout from "../events/[id]/page";

export default function Tomorrow() {
  return (
    <div className="m-4">
      <TasksList showTomorrow />
    </div>
  );
}
