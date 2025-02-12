import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import DeleteNote from "./delete-note"
import Link from "next/link"
  
export default async function Note({name, id, content}: {name:string, id:number, content:string | null}) {
    return (
        <Card>
        <Link href={`/journal/${id}`}><CardHeader>
          <CardTitle>{name}</CardTitle>
        </CardHeader></Link>
        <CardContent className="flex justify-between">
          <CardDescription className="line-clamp-2">{content ? content : "Click to edit"}</CardDescription>
          <DeleteNote id={id} />
        </CardContent>
      </Card>
    )
}