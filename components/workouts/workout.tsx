"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import Image from "next/image";

enum ExerciseName {
  Bench = "bench",
  Pushup = "pushup",
  LatRaise = "latraise",
  Pullup = "pullup",
  Treadmill = "treadmill",
  Crunch = "crunch",
  Plank = "plank",
  Curl = "curl",
  Dips = "dips",
}

const exerciseImages: Record<ExerciseName, string> = {
  bench: "/exercises/bench.png",
  pushup: "/exercises/pushup.png",
  latraise: "/exercises/latraise.png",
  pullup: "/exercises/pullup.jpg",
  treadmill: "/exercises/treadmill.png",
  crunch: "/exercises/crunch.png",
  plank: "/exercises/plank.png",
  curl: "/exercises/curl.png",
  dips: "/exercises/dips.png",
};

class Exercise {
  private rawName: string;

  constructor(name: string) {
    this.rawName = name;
  }

  get displayName(): string {
    switch (this.rawName) {
      case "latraise":
        return "Lateral Raise";
      case "pullup":
        return "Pull-up";
      case "bench":
        return "Bench Press";
      case "pushup":
        return "Push-up";
      case "treadmill":
        return "Treadmill";
      case "crunch":
        return "Crunch";
      case "plank":
        return "Plank";
      case "curl":
        return "Curl";
      case "dips":
        return "Dips";
      default:
        return this.rawName.charAt(0).toUpperCase() + this.rawName.slice(1);
    }
  }
}

export default function Workout({ id }: { id: string | null }) {
  const [sets, setSets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingSet, setIsAddingSet] = useState(false);
  const [deletingSetIds, setDeletingSetIds] = useState<number[]>([]);
  const router = useRouter();
  const [newSetName, setNewSetName] = useState<ExerciseName | "">("");
  const [newSetMinutes, setNewSetMinutes] = useState("");

  useEffect(() => {
    const fetchWorkoutData = async () => {
      const db = await createClient();
      const { data, error } = await db
        .from("sets")
        .select("*")
        .eq("workout_id", Number(id))
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching sets:", error);
      } else {
        setSets(data || []);
      }
      setLoading(false);
    };

    fetchWorkoutData();
  }, [id]);

  const handleAddSet = async () => {
    if (!newSetName || !newSetMinutes) return;

    setIsAddingSet(true);
    const db = await createClient();
    const { data, error } = await db
      .from("sets")
      .insert({
        name: newSetName,
        minutes: Number(newSetMinutes),
        workout_id: Number(id),
      })
      .select();

    setIsAddingSet(false);

    if (error) {
      console.error("Error adding set:", error);
    } else {
      setSets([data[0], ...sets]);
      router.refresh();
      setNewSetName("");
      setNewSetMinutes("");
    }
  };

  const handleDeleteSet = async (setId: number) => {
    setDeletingSetIds((prev) => [...prev, setId]);

    const db = await createClient();
    const { error } = await db.from("sets").delete().eq("id", setId);

    setDeletingSetIds((prev) => prev.filter((id) => id !== setId));

    if (error) {
      console.error("Error deleting set:", error);
    } else {
      setSets(sets.filter((item) => item.id !== setId));
      router.refresh();
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {loading ? (
          <p className="flex items-center gap-2">
            <Loader2 className="animate-spin h-4 w-4" />
            Loading sets...
          </p>
        ) : sets.length === 0 ? (
          <p>No sets found.</p>
        ) : (
          sets.map((set) => {
            const exercise = new Exercise(set.name);
            const isDeleting = deletingSetIds.includes(set.id);
            const imageUrl =
              exerciseImages[set.name as ExerciseName]

            return (
              <Card key={set.id}>
                <CardHeader>
                  <CardTitle>{exercise.displayName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="bg-white border border-gray-200 shadow-md rounded p-2">
                    <Image src={imageUrl} alt={exercise.displayName} className="w-full h-40 object-contain" height={160} width={160}/>
                    {/* <img
                      src={imageUrl}
                      alt={exercise.displayName}
                      className="w-full h-40 object-contain"
                      loading="lazy"
                    /> */}
                  </div>
                  <p>{set.minutes} minutes</p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteSet(set.id)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    ) : (
                      <Trash2 className="mr-0" />
                    )}
                    {isDeleting ? "Deleting..." : ""}
                  </Button>
                </CardFooter>
              </Card>
            );
          })
        )}
      </div>

      {/* Add Set Drawer Trigger */}
      <div className="mt-8">
        <Drawer>
          <DrawerTrigger asChild>
            <Button>
              <Plus className="mr-2" /> Add Set
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Add a New Set</DrawerTitle>
            </DrawerHeader>
            <div className="p-4 space-y-4">
              <div>
                <Label htmlFor="exercise-select">Exercise</Label>
                <Select
                  value={newSetName}
                  onValueChange={(value: ExerciseName) => setNewSetName(value)}
                  disabled={isAddingSet}
                >
                  <SelectTrigger id="exercise-select">
                    <SelectValue placeholder="Select exercise" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ExerciseName).map((name) => {
                      const display = new Exercise(name).displayName;
                      return (
                        <SelectItem key={name} value={name}>
                          {display}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="minutes">Minutes</Label>
                <Input
                  id="minutes"
                  type="number"
                  value={newSetMinutes}
                  onChange={(e) => setNewSetMinutes(e.target.value)}
                  placeholder="e.g., 10"
                  disabled={isAddingSet}
                />
              </div>
              <div className="flex justify-end gap-2">
                <DrawerClose asChild>
                  <Button variant="outline" disabled={isAddingSet}>
                    Cancel
                  </Button>
                </DrawerClose>
                <DrawerClose asChild>
                  <Button
                    onClick={handleAddSet}
                    disabled={isAddingSet || !newSetName || !newSetMinutes}
                  >
                    {isAddingSet ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        Adding...
                      </>
                    ) : (
                      "Add"
                    )}
                  </Button>
                </DrawerClose>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
