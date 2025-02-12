import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import DeleteNote from "./delete-note"
  
export default async function Note({name, id, content}: {name:string, id:number, content:string}) {
    return (
        <Card>
        <CardHeader>
          <CardTitle>{name}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-between">
          <DeleteNote id={id} redirect={false} />
        </CardContent>
      </Card>
    )
}