"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteEvent from "./delete-event";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { useRouter } from "next/navigation";
import { BorderBeam } from "../magicui/border-beam";

export default function Event({
  id,
  name,
  startHour,
  startMinute,
  endHour,
  endMinute,
}: {
  id: number;
  name: string;
  startHour: string;
  endHour: string;
  startMinute: string;
  endMinute: string;
}) {
  const [isOngoing, setIsOngoing] = useState(false);
  const router = useRouter();

  const checkIfOngoing = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const startTimeInMinutes = parseInt(startHour) * 60 + parseInt(startMinute);
    const endTimeInMinutes = parseInt(endHour) * 60 + parseInt(endMinute);
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    return (
      currentTimeInMinutes >= startTimeInMinutes &&
      currentTimeInMinutes <= endTimeInMinutes
    );
  };

  useEffect(() => {
    // Check initially
    setIsOngoing(checkIfOngoing());

    // Update every minute
    const interval = setInterval(() => {
      setIsOngoing(checkIfOngoing());
    }, 10000);

    return () => clearInterval(interval);
  }, [startHour, startMinute, endHour, endMinute]);

  const formatTimeRange = (
    startHour: string,
    startMinute: string,
    endHour: string,
    endMinute: string,
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative"
    >
      <Card className="w-full overflow-x-hidden">
        <CardHeader
          className="cursor-pointer"
          onClick={() => router.push(`/events/${id}`)}
        >
          <CardTitle className="flex items-center gap-2">
            {name}
            {isOngoing && (
              <Badge className="text-green-700 bg-green-100">Ongoing</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-between cursor-pointer">
          <div>
            {formatTimeRange(startHour, startMinute, endHour, endMinute)}
          </div>
          <DeleteEvent id={id} redirect={false} />
        </CardContent>
        {isOngoing ? (
          <BorderBeam
            colorFrom="#008236"
            colorTo="#dcfce7"
            duration={7}
            size={60}
          />
        ) : null}
      </Card>
    </motion.div>
  );
}
