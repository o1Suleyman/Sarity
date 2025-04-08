import NotesList from "@/components/journal/notes-list";

export default function Journal() {
  return (
    <div className="flex flex-1 justify-center m-4">
      <div className="w-full max-w-4xl">
        <NotesList />
      </div>
    </div>
  );
}
