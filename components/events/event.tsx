import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import DeleteEvent from "./delete-event";

export default function Event({
  id,
  name,
  startHour,
  endHour,
  startMinute,
  endMinute,
}: {
  id: number;
  name: string;
  startHour: string;
  endHour: string;
  startMinute: string;
  endMinute: string;
}) {
  return (
    <Card className="w-full overflow-x-hidden">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between">
        <div>
        {startHour}:{startMinute} - {endHour}:{endMinute}
        </div>
        <DeleteEvent id={id}/>
      </CardContent>
    </Card>
  );
}
