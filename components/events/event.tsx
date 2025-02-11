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
  const formatTimeRange = (
    startHour: string,
    startMinute: string,
    endHour: string,
    endMinute: string
  ) => {
    const startHourNum = parseInt(startHour);
    const endHourNum = parseInt(endHour);
    const startPeriod = startHourNum >= 12 ? "PM" : "AM";
    const endPeriod = endHourNum >= 12 ? "PM" : "AM";

    const formatHour = (hour: number) => hour % 12 || 12;

    const startTime = `${formatHour(startHourNum)}:${startMinute}`;
    const endTime = `${formatHour(endHourNum)}:${endMinute}`;

    if (startPeriod === endPeriod) {
      return `${startTime} - ${endTime} ${startPeriod}`;
    } else {
      return `${startTime} ${startPeriod} - ${endTime} ${endPeriod}`;
    }
  };

  return (
    <Card className="w-full overflow-x-hidden">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between">
        <div>
          {formatTimeRange(startHour, startMinute, endHour, endMinute)}
        </div>
        <DeleteEvent id={id} />
      </CardContent>
    </Card>
  );
}
