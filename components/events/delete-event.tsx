"use client"

import { Button } from "../ui/button"
import { DeleteEventAction } from "./actions"
import { Trash2 } from "lucide-react"

export default function DeleteEvent({id}: {id:number}) {
    return <Button onClick={() => DeleteEventAction(id)} variant={"destructive"}><Trash2 /></Button>
}