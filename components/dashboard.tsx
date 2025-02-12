import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import NewEvent from "@/components/events/new-event";
import TasksList from "./events/tasks-list";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import WorkoutsList from "./events/workouts-list";

export default function Dashboard() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center gap-4">
      <ResizablePanelGroup
        direction="horizontal"
        className="max-w-md rounded-lg border md:min-w-[70vw]"
      >
        <ResizablePanel defaultSize={50}>
          <div className="h-[60vh] p-2">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight m-2">
              Today's tasks
            </h4>
            <Separator />
            <ScrollArea className="h-[50vh] mt-2">
              <TasksList />
            </ScrollArea>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={50}>
            <div className="h-[60vh] p-2">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight m-2">
              Today's workout
            </h4>
            <Separator />
            <ScrollArea className="h-[50vh] mt-2">
              <WorkoutsList />
            </ScrollArea>
          </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">Work in progress</span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
      <NewEvent />
    </div>
  );
}
