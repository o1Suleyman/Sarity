import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import DeleteGoal from "./delete-goal"
export default function Goal({name, id}:{name:string, id:number}) {
    return (
        <Card>
  <CardHeader className="p-5">
    <div className="flex justify-between items-center">
    <CardTitle>{name}</CardTitle>
    <DeleteGoal id={id} />
    </div>
  </CardHeader>
</Card>
    )
}