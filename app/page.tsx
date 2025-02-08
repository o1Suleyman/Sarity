import { NumberTicker } from "@/components/magicui/number-ticker";

export default function Home() {
  return (
    <div className="flex-1">
    <div className="mt-14"><NumberTicker value={100} /></div>
</div>
  );
}
