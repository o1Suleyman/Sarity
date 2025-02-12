import IconCloudDemo from "./icon-cloud-demo";
import { LoginForm } from "./login-form";
import { SparklesText } from "./ui/sparkles-text";
import { WordRotate } from "./ui/word-rotate";
import styles from "./home.module.css";

export default function Home() {
  const words = [
    "Obsidian",
    "Notion",
    "Todoist",
    "Drive",
    "Evernote",
    "Forest",
    "Anki",
  ];
  const longestWord = words.reduce((a, b) => (a.length > b.length ? a : b), "");

  return (
    <div className="flex-1 flex justify-center items-start gap-4 mt-24">
      <div className="flex flex-col gap-4 ml-2">
        <div className="flex items-center">
          <span className="text-4xl font-bold text-black dark:text-white">
            No more juggling&nbsp;
          </span>
          <div
            className="text-4xl"
            style={{ width: `${longestWord.length}ch` }}
          >
            <WordRotate
              className="text-4xl font-bold text-black dark:text-white"
              words={words}
              duration={1800}
            />
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-3xl font-bold text-black dark:text-white">
            All you need is&nbsp;
          </span>
          <SparklesText
            text="Sarity"
            sparklesCount={5}
            className="text-3xl font-bold text-black dark:text-white"
          />
        </div>
        <div className="flex-1 flex justify-start">
          <LoginForm className="w-max" />
        </div>
      </div>
      <IconCloudDemo className="self-start hidden md:flex" />
    </div>
  );
}
