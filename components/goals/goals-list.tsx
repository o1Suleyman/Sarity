import { createClient } from "@/utils/supabase/server";
import Goal from "./goal";

export default async function GoalsList() {
    const supabase = await createClient();
    
    return (
        <div className="flex flex-col gap-4">
            {goals.map((goal, index) => (
                <Goal key={index} name={goal.name} completed={goal.completed} />
            ))}
        </div>
    )
}