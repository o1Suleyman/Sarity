import { IconCloud } from "@/components/magicui/icon-cloud"
import { cn } from "@/lib/utils"

const slugs = [
  "typescript",
  "javascript",
  "dart",
  "java",
  "react",
  "flutter",
  "android",
  "html5",
  "css3",
  "nodedotjs",
  "express",
  "nextdotjs",
  "prisma",
  "amazonaws",
  "postgresql",
  "firebase",
  "nginx",
  "vercel",
  "testinglibrary",
  "jest",
  "cypress",
  "docker",
  "git",
  "jira",
  "github",
  "gitlab",
  "visualstudiocode",
  "androidstudio",
  "sonarqube",
  "figma",
]

export default function IconCloudDemo({ className }: { className?: string }) {
  const images = slugs.map((slug) => `https://cdn.simpleicons.org/${slug}/${slug}`)

  return (
    <div
      className={cn(
        "relative flex size-full max-w-lg items-center justify-center overflow-hidden rounded-lg border bg-background",
        className,
      )}
    >
      <IconCloud images={images} className="opacity-80" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="w-4/5 h-0.5 bg-gradient-to-r from-transparent via-red-600 to-transparent rotate-45 transform shadow-sm" />
      </div>
    </div>
  )
}

