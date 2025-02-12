import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import NewEvent from "@/components/events/new-event";
import TasksList from "./events/tasks-list";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import Workout from "./events/workout";
import NotesList from "./journal/notes-list";
import CreateNote from "./journal/create-note";

export default function Dashboard() {
  return (
    <div className="flex-1 flex flex-col items-center gap-2 m-2">
      <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
        Your day at a glance
      </h2>
      <ResizablePanelGroup
        direction="horizontal"
        className="max-w-md rounded-lg border md:min-w-[70vw]"
      >
        <ResizablePanel defaultSize={50}>
          <div className="h-full p-2">
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
            <ResizablePanel defaultSize={51}>
              <div className="h-full p-2">
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight m-2">
                  Today's workout
                </h4>
                <Separator />
                <ScrollArea className="mt-2">
                  <Workout />
                </ScrollArea>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={49}>
              <div className="flex flex-col h-full p-2">
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight m-2">
                  Journal
                </h4>
                <Separator className="mb-1" />
                <ScrollArea>
                  <NotesList />
                </ScrollArea>
                <Separator className="mb-1 mt-auto" />
                <CreateNote />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
      <NewEvent />
    </div>
  );
}
