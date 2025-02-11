import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  
export default function Event({name, startHour, endHour, startMinute, endMinute}: {name: string, startHour: string, endHour: string, startMinute: string, endMinute: string}) {
    return (
        <Card className="w-full overflow-x-hidden">
  <CardHeader>
    <CardTitle>{name}</CardTitle>
  </CardHeader>
  <CardContent>
  {startHour}:{startMinute} - {endHour}:{endMinute}
  </CardContent>
</Card>

    )
}