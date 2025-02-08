import { IconCloud } from "@/components/magicui/icon-cloud"
import { cn } from "@/lib/utils"

const slugs = [
  "googletasks",
  "gmail",
  "googlecalendar",
  "syncthing",
  "obsidian",
  "anki",
  "evernote",
  "git",
  "github",
  "googledrive",
  "notion",
  "todoist",
  "slack",
  "icloud",
  "clockify"
]

export default function IconCloudDemo({ className }: { className?: string }) {
  const images = slugs.map((slug) => `https://cdn.simpleicons.org/${slug}/${slug}`)

  return (
    <div
      className={cn(
        "relative flex size-full max-w-lg items-center justify-center overflow-hidden rounded-lg bg-background",
        className,
      )}
    >
      <IconCloud images={images} className="opacity-80" />

      {/* Absolutely positioned container for the X lines */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden flex items-center justify-center">
        {/* Wrap both lines in a container so they share the same transform center */}
        <div className="relative w-[100%] h-[100%]">
          {/* First diagonal line */}
          <div
            className="
              absolute left-1/2 top-1/2 
              w-[80%] h-0.5 
              bg-gradient-to-r from-transparent via-red-600/80 to-transparent
              transform origin-center rotate-45
              -translate-x-1/2 -translate-y-1/2
            "
          />
          {/* Second diagonal line */}
          <div
            className="
              absolute left-1/2 top-1/2 
              w-[80%] h-0.5 
              bg-gradient-to-r from-transparent via-red-600/80 to-transparent
              transform origin-center -rotate-45
              -translate-x-1/2 -translate-y-1/2
            "
          />
        </div>
      </div>
    </div>
  )
}
