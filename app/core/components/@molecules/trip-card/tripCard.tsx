"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

import { useCountries } from "@lib/hooks/use-contries";
import { cn } from "@/lib/utils";

type TripCardProps = {
  id: string;
  name: string;
  country: string;
  created_at?: string;
};

export default function TripCard(props: TripCardProps) {
  const { id, name, country, created_at } = props;
  const router = useRouter();
  const { getByValue } = useCountries();
  const countryInfo = getByValue(country);

  const createdDate = created_at
    ? format(new Date(created_at), "yyyy.MM.dd", { locale: ko })
    : null;

  const createdISO = created_at
    ? new Date(created_at).toISOString()
    : undefined;

  const handleNavigate = () => {
    router.push(`/my-trip/${id}`);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLElement> = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleNavigate();
    }
  };

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border",
        "cursor-pointer transition-all duration-200 ease-out",

        // 🌞 Light mode
        "bg-white/90 border-slate-200 shadow-[0_12px_30px_rgba(15,23,42,0.06)]",
        "hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.12)]",
        "hover:border-slate-300",

        // 🌙 Dark mode
        "dark:bg-slate-900/70 dark:border-slate-700/70 dark:backdrop-blur",
        "dark:shadow-[0_16px_40px_rgba(0,0,0,0.6)]",
        "dark:hover:-translate-y-1 dark:hover:border-slate-500",
        "dark:hover:shadow-[0_22px_55px_rgba(0,0,0,0.85)]",

        // 공통 hover ring
        "hover:ring-1 hover:ring-slate-200/80 dark:hover:ring-slate-500/80"
      )}
      role="button"
      tabIndex={0}
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
      aria-label={`${countryInfo?.label ?? country} 여행 카드: ${name}`}
    >
      <header className="flex items-center justify-between px-4 pt-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
          <span className="text-base">{countryInfo?.flag ?? "🌍"}</span>
          <span>{countryInfo?.label ?? country}</span>
        </div>

        {createdDate && createdISO && (
          <time
            className="rounded-full px-3 py-1 text-[10px] font-medium"
            dateTime={createdISO}
          >
            생성 {createdDate}
          </time>
        )}
      </header>

      <section className="flex flex-1 flex-col px-4 pb-4 pt-3">
        <h2 className="line-clamp-2 text-base font-semibold">{name}</h2>

        <p className="mt-2 text-xs text-slate-500">
          여행 상세 페이지에서 메모, 일정, 체크리스트 등을 관리할 수 있어요.
        </p>

        <footer className="mt-4 flex justify-end items-center gap-1 text-xs text-slate-300">
          <span className="opacity-90">자세히 보기</span>
          <span className="text-[10px] opacity-60" aria-hidden="true">
            →
          </span>
        </footer>
      </section>
    </article>
  );
}
