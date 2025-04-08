import { createClient } from "@/utils/supabase/server";
import Goal from "./goal";

export default async function GoalsList() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("goals").select("*");
  return (
    <div className="flex flex-col gap-4 w-2/3">
      {data?.map((goal) => (
        <Goal key={goal.id} name={goal.name} id={goal.id} />
      ))}
    </div>
  );
}
