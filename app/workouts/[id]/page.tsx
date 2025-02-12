"use client";

import { createClient } from "@/utils/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import DeleteEvent from "@/components/events/delete-event";
import UpdateEventForm from "@/components/events/update-event-form";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";

interface EventData {
  id: number;
  created_at: string;
  user_id: string;
  name: string;
  start_hour: string;
  end_hour: string;
  start_minute: string;
  end_minute: string;
  date: string;
  type: string;
  duration?: string;
}

export default function Workout({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
      const id = (await params).id;
      const supabase = createClient();
      const { data } = await supabase
        .from("events")
        .select("*")
        .eq("id", Number(id))
        .maybeSingle();

      if (data) {
        // Calculate duration
        const startHour = parseInt(data.start_hour);
        const startMinute = parseInt(data.start_minute);
        const endHour = parseInt(data.end_hour);
        const endMinute = parseInt(data.end_minute);

        const startTime = startHour * 60 + startMinute;
        const endTime = endHour * 60 + endMinute;
        const durationMinutes = endTime - startTime;

        const hours = Math.floor(durationMinutes / 60);
        const minutes = durationMinutes % 60;

        // Conditionally format duration
        if (hours === 0 && minutes === 0) {
          data.duration = "0m";
        } else if (hours === 0) {
          data.duration = `${minutes}m`;
        } else if (minutes === 0) {
          data.duration = `${hours}h`;
        } else {
          data.duration = `${hours}h ${minutes}m`;
        }

        setEventData(data as EventData);
      }
    };

    fetchEventData();
  }, [params]);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleUpdateSuccess = () => {
    setIsUpdateDialogOpen(false);
    router.refresh();
  };

  if (!eventData) return null;

  return (
    <div>
      <Card className="flex-1 md:mx-[20vw] md:my-[10vh] mx-[10vw] my-[5vh]">
        <CardHeader>
          <Button
            variant="ghost"
            className="w-fit mb-4"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="mr-2 size-4" /> Back
          </Button>
          <CardTitle className="text-3xl flex items-center gap-3">
            {eventData.name}
          </CardTitle>
          <CardDescription className="space-y-2 mt-4">
            <div className="flex items-center gap-2">
              <Calendar className="size-4" />
              {formatDate(eventData.date)}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-4" />
              {formatTimeRange(
                eventData.start_hour,
                eventData.start_minute,
                eventData.end_hour,
                eventData.end_minute
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge>Duration: {eventData.duration}</Badge>
            </div>
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-end gap-2">
        <Dialog
  open={isUpdateDialogOpen}
  onOpenChange={setIsUpdateDialogOpen}
>
  <DialogTrigger asChild>
    <Button variant="outline">Edit</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <div className="flex flex-col gap-4">
      <DialogTitle className="text-xl font-semibold">
        Update event details
      </DialogTitle>
      <UpdateEventForm
        eventId={eventData.id}
        currentName={eventData.name}
        onSuccess={handleUpdateSuccess}
      />
    </div>
  </DialogContent>
</Dialog>
          <DeleteEvent id={eventData.id} redirect={true} />
        </CardFooter>
      </Card>
    </div>
  );
}
