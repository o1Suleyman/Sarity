import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export class TimeUtils {
  static isValidTimeOrder(
    startHour: string,
    startMinute: string,
    endHour: string,
    endMinute: string
  ): boolean {
    const startTime = parseInt(startHour) * 60 + parseInt(startMinute);
    const endTime = parseInt(endHour) * 60 + parseInt(endMinute);
    return startTime < endTime;
  }

  static isOverlapping(
    newEvent: {
      start_hour: string;
      start_minute: string;
      end_hour: string;
      end_minute: string;
    },
    existingEvents: {
      start_hour: string;
      start_minute: string;
      end_hour: string;
      end_minute: string;
    }[]
  ): boolean | "invalid_time_order" {
    if (
      !this.isValidTimeOrder(
        newEvent.start_hour,
        newEvent.start_minute,
        newEvent.end_hour,
        newEvent.end_minute
      )
    ) {
      return "invalid_time_order";
    }

    const newStart =
      parseInt(newEvent.start_hour) * 60 +
      parseInt(newEvent.start_minute);
    const newEnd =
      parseInt(newEvent.end_hour) * 60 +
      parseInt(newEvent.end_minute);

    return existingEvents.some((event) => {
      const existingStart =
        parseInt(event.start_hour) * 60 +
        parseInt(event.start_minute);
      const existingEnd =
        parseInt(event.end_hour) * 60 +
        parseInt(event.end_minute);

      return (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      );
    });
  }
}
